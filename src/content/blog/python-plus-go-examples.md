---
title: "Python + Go: Examples"
subtitle: Case study of two real libraries using python + go
description: "Real examples of This method in action"
pubDate: 2025-05-19T00:00:00-06:00
modified_date: 2025-05-19T00:00:00-06:00
heroImage: /tech/blog/python-plus-go/diagram.excalidraw.png
language: [python, go, C]
tags:
  - python
  - go
  - C
  - web
  - theory
  - packages
---

We made it, we finally made it to the last article. If you haven't yet, please read the last two articles to get up to speed, I'm not re-covering anything from them:

- [Python + Go Intro](https://kieranwood.ca/tech/blog/python-plus-go-intro)
- [Python + Go Basics](https://kieranwood.ca/tech/blog/python-plus-go-basics)

First, I want to give you a warning of when you **shouldn't** do this. In general the useful examples I wrote were ones that were:

- **CPU bound**: if you're mostly dealing with I/O, both languages are pretty good at it. This method really shines when the computation itself is the bottleneck. 
- **Highly Concurrent**: Tasks that are [embarassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel#:~:text=In%20parallel%20computing%2C%20an%20embarrassingly,a%20number%20of%20parallel%20tasks.) come to mind, but in general Go is built to handle concurrency well compared to python and as such, anything that uses a bunch of concurrency will benefit from being in go
- **High Memory Budget**: All of the methods I describe in here aschew memory for execution time. To keep things safe and "simple" most data is copied between the environments, meaning multiple copies of variables exist in each runtime, you could avoid these issues with shared-memory approaches ([message passing](https://en.wikipedia.org/wiki/Message_passing), file i/o, databases, etc.), but I didn't bother for these examples

I do want to mention that although I warned about it before it's worth mentioning that writing this sort of code in practicallity takes understanding Go, and Python well, and a bit of C/memory management fundamentals. The demos in this article are no different.

I had originally planned to post this article a day after the last, but if you check the dates, it's been over a week since then. Turns out this code is harder to do than I first thought. With that out of the way, now we "know what we're doing", what are some examples of this done in a way that's usable for other people?


## Helpers

Because there was so much to remember I actually ended up putting together a helper library to make developing both the go and python side "easier" (none of this stuff is easy). Though, it's worth mentioning I went safety over performance, so there are many situation-specific optimizations where rolling your own code is more worthwhile (like dealing with bytes directly). Another shortcoming is structs, there was no way to deal with generic structs nicely, so you'll need to do that manually. I have the code for each example using it, and without it. Here is a diagram with the rundown of the basics:

![](/tech/blog/python-plus-go/helper-layout.excalidraw.png)

You can then use these functions to as the library to do the data binding between python and Go, and you just need to build out YOUR api (your go and python side) using the helper library. I will have a separate [git repo](https://github.com/Descent098/cgo-python-helpers) with up to date code, and eventually a [web app](https://kieranwood.ca/cgo-python-helpers/) to help make this process smoother.

If you want the current source code as of writting, here it is, but please be aware, I have done as much due diligence as I can to detect memory leaks, but lots of behaviours are 1. not documented, and 2. not trivial to diagnose, use at your own risk.

<details><summary>Source code (Hidden for brevity)</summary>

`lib.go`

```go
// # Functions
//
// # Convert C types to go types (internal; Use at entrypoint to Go libraries)
//
//	CStringToString(input *C.char) string{} //Convert a string to a c-compatible C-string (glorified alias for C.GoString)
//	CFloatArrayToSlice(cArray *C.float, length int) []float32{} // Converts a C array of floats to a slice of floats
//	CIntArrayToSlice(cArray *C.int, length int) []int{} // Takes a C integer array and coverts it to an integer slice
//	CStringArrayToSlice(cArray **C.char, numberOfStrings int) []string{} // Takes in an array of strings, and converts it to a slice of strings
//
// # Convert Go types to C types (external; Use to prep data to return to C)
//
//	StringToCString(data string) *C.char{} // Convert a string to a c-compatible C-string (glorified alias for C.CString)
//	StringSliceToCArray(data []string) *C.StringArrayResult{} // Return dynamically sized string array as a C-Compatible array
//	IntSliceToCArray(data []int) *C.IntArrayResult{} // Return dynamically sized int array as a C-Compatible array
//	FloatSliceToCArray(data []float32) *C.FloatArrayResult{} // Return dynamically float sized array as a C-Compatible array
//
// # Memory Freeing
//
//	FreeCString(data *C.char){} // Free's a C-string
//	FreeStringArray(inputArray **C.char, count C.int){} // Free's an array of strings
//	FreeIntArray(ptr *C.int){}  // Free's an array of integers
//	FreeFloatArray(ptr *C.float){} // Free's an array of floats
//
// # Debugging Functions
//
//	return_string(data *C.char) *C.char{} // Used to convert a C-compatible string to a C-compatible string, useful for debugging encoding issues
//	return_string_array(cArray **C.char, numberOfStrings int) *C.StringArrayResult{} // Used to convert a C-compatible string array to wrapper type
//	return_int_array(cArray *C.int, numberOfElements C.int) *C.IntArrayResult{} // Used to convert a C-compatible integer array to wrapper type
//	return_float_array(cArray *C.float, numberOfElements C.int) *C.FloatArrayResult{} // Used to convert a C-compatible float array to wrapper type
//	print_string(ptr *C.char){} // Prints the go representation of a C string, good for debugging encoding issues
//	print_string_array(cArray **C.char, numberOfString int){} // Prints the go representation of an array, good for debugging encoding issues
//	print_int_array(cArray *C.int, numberOfInts int){} // Prints the go representation of an array, good for debugging rounding/conversion issues
//	print_float_array(cArray *C.float, numberOfFloats int){} // Prints the go representation of an array, good for debugging rounding/conversion issues
//
// # Examples
//
// Create a function to show the internal go representation of an array of strings
//
//	 // Takes in a C string array, prints the go representation, then returns it
//	 //export print_string_array
//	 func print_string_array(cArray **C.char, numberOfStrings int) *C.StringArrayResult {
//		  internalRepresentation := CStringArrayToSlice(cArray, numberOfStrings)
//		  fmt.Printf("return_string_array() Go representation: %v\n", internalRepresentation)
//
//		  result := StringSliceToCArray(internalRepresentation)
//
//		  return result
//	 }
package main

/*
#include <stdlib.h>

typedef struct{
	int numberOfElements;
	char** data;
} StringArrayResult;

typedef struct {
    int numberOfElements;
    int* data;
} IntArrayResult;

typedef struct {
    int numberOfElements;
    float* data;
} FloatArrayResult;

*/
import "C"
import (
	"fmt"
	"unsafe"
)

// ======== Convert Go types to C type ========

// Convert a string to a c-compatible C-string (glorified alias for C.CString)
//
// Parameters:
//   - input: The Go string to convert.
//
// Returns:
//   - A pointer to the newly allocated C string (*C.char).
//     Note: The caller is responsible for freeing the allocated memory using FreeCString.
func StringToCString(input string) unsafe.Pointer {
	return unsafe.Pointer(C.CString(input))
}

// A function to take a slice and convert it to a StringArrayResult to be returned to C code
//
// Parameters:
//   - data: Slice of Go strings to convert.
//
// Returns:
//   - Pointer to a C.StringArrayResult containing the converted C strings.
//     Note: The caller is responsible for freeing the allocated memory using free_string_array_result.
func StringSliceToCArray(data []string) *C.StringArrayResult {
	count := len(data)

	// Allocate memory for an array of C string pointers (char**)
	amountOfElements := C.size_t(count)
	sizeOfSingleElement := C.size_t(unsafe.Sizeof(uintptr(0)))
	amountOfMemory := amountOfElements * sizeOfSingleElement
	stringArray := (**C.char)(C.malloc(amountOfMemory))

	// Create Array of data
	for i, currentString := range data {
		// Calculate where to put the string
		locationOfArray := uintptr(unsafe.Pointer(stringArray)) // Starting point of first byte of slice
		offsetIntoArray := uintptr(i)                           // The offset for the current element
		sizeOfSingleElement := unsafe.Sizeof(uintptr(0))        // Size of a single string

		locationInMemory := (**C.char)(unsafe.Pointer(locationOfArray + offsetIntoArray*sizeOfSingleElement))
		*locationInMemory = C.CString(currentString) // Convert go string to C string and insert at location in array

	}

	// Allocate memory for the struct
	result := (*C.StringArrayResult)(C.malloc(C.size_t(unsafe.Sizeof(C.StringArrayResult{}))))
	result.numberOfElements = C.int(count)
	result.data = stringArray

	return result
}

// Return dynamically sized int array as a C-Compatible array
//
// Parameters:
//   - data: Slice of Go integers to convert.
//
// Returns:
//   - Pointer to a C.IntArrayResult containing the converted C integers.
//     Note: The caller is responsible for freeing the allocated memory using free_int_array_result.
func IntSliceToCArray(data []int) *C.IntArrayResult {
	count := len(data)

	// Allocate memory in C for the int array
	amountOfMemory := C.size_t(count) * C.size_t(unsafe.Sizeof(C.int(0)))
	cArray := (*C.int)(C.malloc(amountOfMemory))

	// Fill in the values
	array := (*[1 << 30]C.int)(unsafe.Pointer(cArray))
	for i, val := range data {
		array[i] = C.int(val)
	}

	// Allocate the result struct
	result := (*C.IntArrayResult)(C.malloc(C.size_t(unsafe.Sizeof(C.IntArrayResult{}))))
	result.numberOfElements = C.int(count)
	result.data = cArray

	return result
}

// Return dynamically float sized array as a C-Compatible array
//
// Parameters:
//   - data: Slice of Go float32 values to convert.
//
// Returns:
//   - Pointer to a C.FloatArrayResult containing the converted C floats.
//     Note: The caller is responsible for freeing the allocated memory using free_float_array_result.
func FloatSliceToCArray(data []float32) *C.FloatArrayResult {
	count := len(data)

	// Allocate memory in C for the float array
	amountOfMemory := C.size_t(count) * C.size_t(unsafe.Sizeof(C.float(0)))
	cArray := (*C.float)(C.malloc(amountOfMemory))

	// Fill in the values
	array := (*[1 << 30]C.float)(unsafe.Pointer(cArray))
	for i, val := range data {
		array[i] = C.float(val)
	}

	// Allocate the result struct
	result := (*C.FloatArrayResult)(C.malloc(C.size_t(unsafe.Sizeof(C.FloatArrayResult{}))))
	result.numberOfElements = C.int(count)
	result.data = cArray

	return result
}

// ======== Convert C types to Go ========

// Convert a string to a c-compatible C-string (glorified alias for C.GoString)
//
// Parameters:
//   - input: Pointer to the C string to convert (*C.char).
//
// Returns:
//   - The corresponding Go string.
func CStringToString(input unsafe.Pointer) string {
	return C.GoString((*C.char)(input))
}

// Takes a C integer array and coverts it to an integer slice
//
// Parameters:
//   - cArray: Pointer to the C array of integers (*C.int).
//   - length: Number of elements in the C array.
//
// Returns:
//   - A Go slice containing the converted integers.
//
// Usage:
//
//	var cIntArray *C.int // Assuming it's set in some line after this
//	goInts := CIntArrayToSlice(unsafe.Pointer(cIntArray), length)
func CIntArrayToSlice(cArray unsafe.Pointer, length int) []int {
	// Setup buffer for array contents
	const bufferSize = 1 << 30 // Allocate a huge buffer
	slice := (*[bufferSize]C.int)(cArray)[:length:length]

	// Convert to []int
	result := make([]int, length)
	for i := 0; i < length; i++ {
		result[i] = int(slice[i])
	}
	return result
}

// Converts a C array of floats to a slice of floats
//
// Parameters:
//   - cArray: Pointer to the C array of floats (*C.float).
//   - length: Number of elements in the C array.
//
// Returns:
//   - A Go slice containing the converted float32 values.r
//
// Usage:
//
//	var cFloatArray  *C.float // Assuming it's set in some line after this
//	goFloats := CFloatArrayToSlice(unsafe.Pointer(cFloatArray), length)
func CFloatArrayToSlice(cArray unsafe.Pointer, length int) []float32 {
	// Setup buffer for array contents
	const bufferSize = 1 << 30 // Allocate a huge buffer
	slice := (*[bufferSize]C.float)(cArray)[:length:length]

	// Convert to []float32
	result := make([]float32, length)
	for i := 0; i < length; i++ {
		result[i] = float32(slice[i])
	}
	return result
}

// Takes in an array of strings, and converts it to a slice of strings
// C array -> slice of strings
//
// Parameters:
//   - cArray: Pointer to the C array of strings (**C.char).
//   - numberOfStrings: Number of strings in the C array.
//
// Returns:
//   - A Go slice containing the converted strings.
//
// Notes
//
//   - This function DOES NOT clean memory of input array, that's up to others to clear
func CStringArrayToSlice(cArray unsafe.Pointer, numberOfStrings int) []string {
	// Setup buffer for array contents
	const bufferSize = 1 << 30 // Allocate a huge buffer
	stringPointers := (*[bufferSize]*C.char)(cArray)[:numberOfStrings:numberOfStrings]

	result := make([]string, 0, numberOfStrings)
	for i := range numberOfStrings {
		result = append(result, C.GoString(stringPointers[i]))
	}
	return result
}

// ========== Debugging Functions ==========

// Used to convert a C-compatible string back to itself, good for debugging encoding issues
//
// Parameters:
//   - cString: Pointer to the C string (*C.char).
//
// Returns:
//   - Pointer to a new C string with the same content (*C.char).
//     Note: The caller is responsible for freeing the allocated memory using FreeCString.
//
//export return_string
func return_string(cString unsafe.Pointer) unsafe.Pointer {
	internalRepresentation := C.GoString((*C.char)(cString))
	result := StringToCString(internalRepresentation)
	return result
}

// Used to convert a C-compatible string array to wrapper type
//
// Parameters:
//   - cArray: Pointer to the C array of strings (**C.char).
//   - numberOfStrings: Number of strings in the C array.
//
// Returns:
//   - Pointer to a C.StringArrayResult containing the converted strings (*C.StringArrayResult).
//     Note: The caller is responsible for freeing the allocated memory using free_string_array_result.
//
//export return_string_array
func return_string_array(cArray unsafe.Pointer, numberOfStrings int) *C.StringArrayResult {

	internalRepresentation := CStringArrayToSlice(cArray, numberOfStrings)

	result := StringSliceToCArray(internalRepresentation)

	return result
}

// Used to convert a C-compatible integer array to wrapper type
//
// Parameters:
//   - cArray: Pointer to the C array of integers (*C.int).
//   - numberOfElements: Number of elements in the C array.
//
// Returns:
//   - Pointer to a C.IntArrayResult containing the converted integers (*C.IntArrayResult).
//     Note: The caller is responsible for freeing the allocated memory using free_int_array_result.
//
//export return_int_array
func return_int_array(cArray unsafe.Pointer, numberOfElements C.int) *C.IntArrayResult {
	internalRepresentation := CIntArrayToSlice(cArray, int(numberOfElements))
	result := IntSliceToCArray(internalRepresentation)
	return (*C.IntArrayResult)(result)
}

// Used to convert a C-compatible float array to wrapper type
//
// Parameters:
//   - cArray: Pointer to the C array of floats(*C.float).
//   - numberOfElements: Number of elements in the C array.
//
// Returns:
//   - Pointer to a C.FloatArrayResult containing the converted floats (*C.FloatArrayResult).
//     Note: The caller is responsible for freeing the allocated memory using free_float_array_result.
//
//export return_float_array
func return_float_array(cArray unsafe.Pointer, numberOfElements C.int) *C.FloatArrayResult {
	internalRepresentation := CFloatArrayToSlice(cArray, int(numberOfElements))
	result := FloatSliceToCArray(internalRepresentation)
	return (*C.FloatArrayResult)(result)
}

// Prints the go representation of a C string, good for debugging encoding issues
//
// Parameters:
//   - ptr: Pointer to the C string (*C.char).
//
//export print_string
func print_string(ptr unsafe.Pointer) {
	if ptr != nil {
		fmt.Printf("print_string() Go representation: %s\n", C.GoString((*C.char)(ptr)))
	} else {
		fmt.Println("print_string() received nil pointer")
	}
}

// Prints the go representation of an array, good for debugging encoding issues
//
// Parameters:
//   - cArray: Pointer to the C array of strings (**C.char).
//   - numberOfString: Number of strings in the C array.
//
//export print_string_array
func print_string_array(cArray unsafe.Pointer, numberOfString int) {
	res := CStringArrayToSlice(cArray, numberOfString)
	fmt.Printf("print_string_array() Go representation: %v\n", res)
}

// Prints the go representation of an array, good for debugging rounding/conversion issues
//
// Parameters:
//   - cArray: Pointer to the C array of integers (*C.int).
//   - numberOfInts: Number of integers in the C array.
//
//export print_int_array
func print_int_array(cArray unsafe.Pointer, numberOfInts int) {
	fmt.Printf("Got initial array with %d items, converting", numberOfInts)
	res := CIntArrayToSlice(cArray, numberOfInts)
	fmt.Println("Converted array")

	fmt.Printf("print_int_array() Go representation: %v\n", res)
}

// Prints the go representation of an array, good for debugging rounding/conversion issues
//
// Parameters:
//   - cArray: Pointer to the C array of floats (*C.float).
//   - numberOfFloats: Number of floats in the C array.
//
//export print_float_array
func print_float_array(cArray unsafe.Pointer, numberOfFloats int) {
	res := CFloatArrayToSlice(cArray, numberOfFloats)

	fmt.Printf("print_float_array() Go representation: %v\n", res)
}

// ========== Functions to free memory ==========

// Free a previously allocated C string from Go.
//
// Parameters:
//   - ptr: Pointer to the C string to be freed (*C.char).
//
//export FreeCString
func FreeCString(ptr unsafe.Pointer) {
	if ptr != nil {
		C.free(ptr)
	}
}

// Free a StringArrayResult allocated by StringSliceToCArray.
//
// Parameters:
//   - result: Pointer to the C.StringArrayResult to be freed (**C.char).
//
//export FreeStringArray
func FreeStringArray(inputArray unsafe.Pointer, count C.int) {
	for i := 0; i < int(count); i++ {
		// Calculate where to find the string
		locationOfArray := uintptr(inputArray)          // Starting point of first byte of slice
		offsetIntoArray := uintptr(i)                   // The offset for the current element
		memorySizeOfStruct := unsafe.Sizeof(uintptr(0)) // Size of a single struct

		ptr := *(**C.char)(unsafe.Pointer(locationOfArray + offsetIntoArray*memorySizeOfStruct))
		C.free(unsafe.Pointer(ptr))
	}
	C.free(inputArray)
}

// Free an *C.int.
//
// Parameters:
//   - result: Pointer to the *C.int to be freed.
//
//export FreeIntArray
func FreeIntArray(ptr unsafe.Pointer) {
	C.free(ptr)
}

// Free a *C.float.
//
// Parameters:
//   - result: Pointer to the C.FloatArrayResult to be freed (*C.float).
//
//export FreeFloatArray
func FreeFloatArray(ptr unsafe.Pointer) {
	C.free(ptr)
}

// Free a *C.StringArrayResult.
//
// Parameters:
//   - result: Pointer to the C.StringArrayResult to be freed (*C.StringArrayResult).
//
//export free_string_array_result
func free_string_array_result(StringArrayResultReference unsafe.Pointer) {
	temp := (*C.StringArrayResult)(StringArrayResultReference)
	FreeStringArray(unsafe.Pointer(temp.data), temp.numberOfElements)
	C.free(unsafe.Pointer(StringArrayResultReference))
}

// Free a *C.IntArrayResult.
//
// Parameters:
//   - result: Pointer to the C.IntArrayResult to be freed (*C.IntArrayResult).
//
//export free_int_array_result
func free_int_array_result(ptr unsafe.Pointer) {
	temp := (*C.IntArrayResult)(ptr)
	FreeIntArray(unsafe.Pointer(temp.data))
	C.free(unsafe.Pointer(ptr))
}

// Free a *C.FloatArrayResult.
//
// Parameters:
//   - result: Pointer to the C.FloatArrayResult to be freed (*C.FloatArrayResult).
//
//export free_float_array_result
func free_float_array_result(ptr unsafe.Pointer) {
	temp := (*C.FloatArrayResult)(ptr)
	FreeFloatArray(unsafe.Pointer(temp.data))
	C.free(unsafe.Pointer(ptr))
}

func main() {}
```

`lib.py`

```python
"""A package to help with building Go-python libraries"""
import os
import subprocess
from platform import platform
from ctypes import CDLL, Array, cdll, c_char_p, c_int, POINTER, c_float, Structure, string_at 

# ========== Helper Functions  ============
def get_library(dll_path:str,source_path:str="", compile:bool=False) -> CDLL:
    """Get's the DLL specified, will compile if not found and flag is specified

    Parameters
    ----------
    dll_path : str
        The path to the DLL file, if compile is specified this will be the output path

    source_path:str, optional
        The path to the source go file, only needed if compile is true, by default ""

    compile : bool, optional
        Specify if you should try to compile DLL if not in path, by default False

    Raises
    ------
    ValueError:
        If linked library is not available and/or compilable (if compile is specified)

    Returns
    -------
    CDLL
        The linked library
        
    Examples
    --------
    Build similarity.dll/similarity.so from lib.go
    
    from platform import platform
    # import library
    if platform().lower().startswith("windows"):
        library_location = os.path.join(os.path.dirname(os.path.realpath(__file__)), "similarity.dll")
    else:
        library_location = os.path.join(os.path.dirname(os.path.realpath(__file__)), "similarity.so")

    source_location = os.path.join(os.path.dirname(os.path.realpath(__file__)), "lib.go")
    
    lib = get_library(library_location, source_location, compile=True)
    
    """
    if not os.path.exists(dll_path):
        if not compile:
            raise ValueError(f"Linked Library is not available: {dll_path}")
        if platform().lower().startswith("windows"):
            additional_flags = "set GOTRACEBACK=system &&"
        else:
            additional_flags = "env GOTRACEBACK=system"
        command = f"{additional_flags} go build -ldflags \"-s -w\" -buildmode=c-shared -o \"{dll_path}\""
        if compile:
            print("\nRequired shared library is not available, building...")
            try:
                subprocess.run(command, shell=True, check=True, cwd=os.path.dirname(source_path))
            except Exception as e:
                if isinstance(e, FileNotFoundError):
                    print("Unable to find Go install, please install it and try again\n")
                else:
                    print(f"Ran into error while trying to build shared library, make sure go, and a compatible compiler are installed, then try building manually using:\n\t{command}\nExiting with error:\n\t{e}")
                raise ValueError(f"Linked Library is not available or compileable: {dll_path}")
    return cdll.LoadLibrary(dll_path)

# ========== C Structs ==========
class _CStringArrayResult(Structure):
    _fields_ = [
        ("numberOfElements", c_int),
        ("data", POINTER(c_char_p)),
    ]
    
class _CIntArrayResult(Structure):
    _fields_ = [
        ("numberOfElements", c_int),
        ("data", POINTER(c_int)),
    ]

class _CFloatArrayResult(Structure):
    _fields_ = [
        ("numberOfElements", c_int),
        ("data", POINTER(c_float)),
    ]

# ========== Setup CGo functions ==========

# import library
dll_source_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "lib.go")
if platform().lower().startswith("windows"):
    dll_file = os.path.join(os.path.dirname(os.path.realpath(__file__)),"lib.dll")
    lib = get_library(dll_file, dll_source_file, True)
else:
    dll_file = os.path.join(os.path.dirname(os.path.realpath(__file__)),"lib.so")
    lib = get_library(dll_file, dll_source_file, True)

lib.print_string_array.argtypes =  [POINTER(c_char_p), c_int]
lib.FreeStringArray.argtypes = [POINTER(c_char_p), c_int]

lib.print_int_array.argtypes =  [POINTER(c_int), c_int]
lib.FreeIntArray.argtypes = [POINTER(c_int)]

lib.print_float_array.argtypes =  [POINTER(c_float), c_int]
lib.FreeFloatArray.argtypes =  [POINTER(c_float)]

lib.return_string.argtypes = [c_char_p]
lib.return_string.restype = c_char_p

lib.FreeCString.argtypes = [c_char_p]

lib.print_string.argtypes = [c_char_p]

## ========== Array-based functions ==========

lib.FreeStringArray.argtypes = [POINTER(c_char_p), c_int]
lib.free_string_array_result.argtypes = [POINTER(_CStringArrayResult)]
lib.return_string_array.argtypes = [POINTER(c_char_p), c_int] 
lib.return_string_array.restype = POINTER(_CStringArrayResult)

lib.return_int_array.argtypes = [POINTER(c_int), c_int]
lib.return_int_array.restype = POINTER(_CIntArrayResult)
lib.free_int_array_result.argtypes = [POINTER(_CIntArrayResult)]

lib.return_float_array.argtypes = [POINTER(c_float), c_int]
lib.return_float_array.restype = POINTER(_CFloatArrayResult)
lib.free_float_array_result.argtypes = [POINTER(_CFloatArrayResult)]

# ========== Nice Typehints/Type Aliases ==========
CIntArray = Array[c_int]
CFloatArray = Array[c_float]
CStringArray = Array[c_char_p]

# ========== Python types to C ============
def prepare_string(data: str | bytes) -> c_char_p:
    """Takes in a string and returns a C-compatible string
    
    Notes
    -----
    - Does not prune null terminators (\\0 characters)

    Parameters
    ----------
    data : str | bytes
        The string to prepare

    Returns
    -------
    c_char_p
        The resulting pointer to the string
    """
    if not data:
        return c_char_p(bytes())
    if type(data) == str:
        return c_char_p(data.encode())
    return c_char_p(bytes(data))

def prepare_string_array(data:list[str|bytes]) -> tuple[CStringArray, int]:
    """Takes in a string list, and converts it to a C-compatible array

    Parameters
    ----------
    data : list[str | bytes]
        The list to convert

    Returns
    -------
    Array[c_char_p], int
        The resulting array, and the number of items
        
    Notes
    -----
    - Because the data is allocated in python, python will free the memory afterwords
    - Does not prune null terminators (\\0 characters)

    Examples
    --------
    
    lib = cdll.LoadLibrary("path/to/library.dll") # Load Library

    # Function that takes in string array, and number of items, then prints them in C
    lib.print_string_array.argtypes =  [POINTER(c_char_p), c_int]

    # Prep data using function
    data = ["Hello", "World", "!"]
    c_array, number_of_items = prepare_string_array(data)

    # Use data in C
    lib.print_string_array(c_array, number_of_items)
    
    """
    # Encode items to bytes
    data = [
            c_char_p(item.encode())
        if type(item) == str
        else
            c_char_p(bytes(item))
        for item in data
    ] 
    number_of_items = len(data)
    array_type = c_char_p * number_of_items # Create a C array of char* (aka **char)
    c_array = array_type(*data)
    return c_array, number_of_items

def prepare_int_array(data:list[int]) -> tuple[CIntArray, int]:
    """Takes in an int list, and converts it to a C-compatible array

    Parameters
    ----------
    data : list[int]
        The list of integers to convert to an array

    Returns
    -------
    Array[c_int], int
        The resulting array, and the number of items
    
    Notes
    -----
    - Because the data is allocated in python, python will free the memory afterwords
        
    Examples
    --------
    
    lib = cdll.LoadLibrary("path/to/library.dll") # Load Library

    # Function that takes in int array, and number of items, then prints them in C
    lib.print_int_array.argtypes =  [POINTER(c_int), c_int]

    # Prep data using function
    data = [1,2,3,4]
    c_array, number_of_items = prepare_int_array(data)

    # Use data in C
    lib.print_int_array(c_array, number_of_items)
    
    """
    data = [c_int(item) for item in data] # Force an error if wrong type
    number_of_items = len(data)
    array_type = c_int * number_of_items # Create a C array of int*
    c_array = array_type(*data)
    return c_array, number_of_items

def prepare_float_array(data:list[float]) -> tuple[CFloatArray, int]:
    """Takes in an float list, and converts it to a C-compatible array

    Parameters
    ----------
    data : list[float]
        The list of integers to convert to an array

    Returns
    -------
    Array[c_float], int
        The resulting array, and the number of items
    
    Notes
    -----
    - Because the data is allocated in python, python will free the memory afterwords
    - The data is only accurate up to ~4 decimals (i.e. if value is -790.5207366698761 you might get -790.520751953125)
        
    Examples
    --------
    
    lib = cdll.LoadLibrary("path/to/library.dll") # Load Library

    # Function that takes in float array, and number of items, then prints them in C
    lib.print_float_array.argtypes =  [POINTER(c_float), c_int]

    # Prep data using function
    data = [1.0,2.604,3.14159,4.964]
    c_array, number_of_items = prepare_float_array(data)

    # Use data in C
    lib.print_float_array(c_array, number_of_items)
    
    """
    data = [c_float(item) for item in data]  # Force an error if wrong type
    number_of_items = len(data)
    array_type = c_float * number_of_items # Create a C array of float*
    c_array = array_type(*data)
    return c_array, number_of_items

# ========== Convert C types to python ============
def string_to_str(pointer: c_char_p) -> str:
    """Takes in a pointer to a C string and returns a Python string

    Parameters
    ----------
    pointer : c_char_p
        A C-style string pointer returned from Go

    Notes
    -----
    - Assumes the pointer is a valid null-terminated UTF-8 encoded string
    - Does NOT free the pointer automatically, you must call `lib.FreeCString(pointer)` if needed

    Returns
    -------
    str
        The decoded Python string representation of the C string
        
    Examples
    --------
    
    c_str = prepare_string(b"Hello from Python!")
    result: str = string_to_str(c_str)
    lib.FreeCString(c_str)
    
    """
    if pointer:
        return pointer.value.decode("utf-8", errors="replace")
    return ""

def string_array_result_to_list(pointer:_CStringArrayResult) -> list[str]:
    """Takes in a pointer to a string result and returns a list of strings

    Parameters
    ----------
    pointer : _CStringArrayResult
        A pointer to a CString Result

    Notes
    -----
    - free's the original pointer

    Returns
    -------
    list[str]
        The list of strings the pointer pointed to
        
    Examples
    --------
    
    data = [
        random.choice(["Lorem", "ipsum", "dolor", "sit", "amet"]) 
        for _ in range(100)
    ]
    
    c_array, number_of_elements = prepare_string_array(data)
    
    pointer = return_string_array(c_array, number_of_elements)
    
    result:list[str] = string_array_result_to_list(pointer)
    
    """
    try:
        result_data = pointer.contents
        results = []
        for i in range(result_data.numberOfElements):
            results.append(result_data.data[i].decode(errors='replace'))
        return results
    finally:
        lib.free_string_array_result(pointer)

def int_array_result_to_list(pointer: _CIntArrayResult) -> list[int]:
    """Converts C int result struct to a Python list, and frees memory."""
    try:
        result_data = pointer.contents
        return [result_data.data[i] for i in range(result_data.numberOfElements)]
    finally:
        lib.free_int_array_result(pointer)

def float_array_result_to_list(pointer: _CFloatArrayResult) -> list[float]:
    """Converts C float result struct to a Python list, and frees memory."""
    try:
        result_data = pointer.contents
        return [result_data.data[i] for i in range(result_data.numberOfElements)]
    finally:
        lib.free_float_array_result(pointer)

# ========== Debugging Functions ==========

def return_string(text: str | bytes) -> str:
    """Debugging function that shows you the Go representation of a C string and returns the python string version

    Parameters
    ----------
    text : str | bytes
        The text to get the representation of

    Returns
    -------
    str
        The returned string
    """
    c_input = prepare_string(text)
    result = lib.return_string(c_input)

    if not result:
        return ""

    copied_bytes = string_at(result)
    decoded = copied_bytes.decode(errors="replace")

    return decoded

def return_string_array(c_array:CStringArray, number_of_elements:int) ->list[str]:
    """Debugging function that shows you the Go representation of a C array and returns the python list version

    Parameters
    ----------
    c_array : Array[c_char_p]
        The array to print and convert
    number_of_elements : int
        The number of elements in the array

    Notes
    -----
    - DOES NOT FREE INPUT ARRAY
    - This function returns the PYTHON list version, do not reassign input variable or it'll never free (i.e. c_array = return_string_array(c_array, number_of_elements))

    Returns
    -------
    list[str]
        The python string representation of the array
        
    Examples
    --------
    
    data = [
        random.choice(["Lorem", "ipsum", "dolor", "sit", "amet"]) 
        for _ in range(100)
    ]
    
    c_array, number_of_elements = prepare_string_array(data)
    
    result:list[str] = return_string_array(c_array, number_of_elements)
    
    lib.free_string_array_result(c_array, number_of_elements)
    
    """
    pointer = lib.return_string_array(c_array, number_of_elements)

    result_data = pointer.contents
    results = []
    for i in range(result_data.numberOfElements):
        results.append(result_data.data[i].decode(errors='replace'))
    return results

def return_int_array(c_array: CIntArray, number_of_elements: int) -> list[int]:
    """Debugging function that shows you the Go representation of a C int array and returns a Python list

    Notes
    -----
    - DOES NOT FREE INPUT ARRAY
    - Frees input array ONLY on exception
    - Returns the PYTHON list version, do not reassign input variable

    Returns
    -------
    list[int]
    """
    pointer = lib.return_int_array(c_array, number_of_elements)
    try:
        result_data = pointer.contents
        return [result_data.data[i] for i in range(result_data.numberOfElements)]
    except Exception as e:
        print(f"return_int_array(): Ran into error, freeing memory. Error: {e}")
        lib.free_int_array_result(c_array)  # In case you define a similar freeing function for input
        raise e
    finally:
        lib.free_int_array_result(pointer)

def return_float_array(c_array: CFloatArray, number_of_elements: int) -> list[float]:
    """Debugging function that shows you the Go representation of a C float array and returns a Python list

    Notes
    -----
    - DOES NOT FREE INPUT ARRAY ON SUCCESS
    - Frees input array ONLY on exception
    - Returns the PYTHON list version, do not reassign input variable
    - The data is only accurate up to ~4 decimals (i.e. if value is -790.5207366698761 you might get -790.520751953125)

    Returns
    -------
    list[float]
    """
    pointer = lib.return_float_array(c_array, number_of_elements)
    try:
        result_data = pointer.contents
        return [result_data.data[i] for i in range(result_data.numberOfElements)]
    except Exception as e:
        print(f"return_float_array(): Ran into error, freeing memory. Error: {e}")
        lib.free_float_array_result(c_array)  # In case you define a similar freeing function for input
        raise e
    finally:
        lib.free_float_array_result(pointer)

def print_string(text: str | bytes):
    """Prints a string's go representation, useful to look for encoding issues

    Parameters
    ----------
    text : str | bytes
        The data you want to see the go representation of
    """
    c_input = prepare_string(text)
    lib.print_string(c_input)

def print_string_array(data:list[str|bytes]):
    """Prints a string array's go representation, useful to look for encoding issues

    Notes
    -----
    - Does not free because everything is allocated in python, so GC will take care of it

    Parameters
    ----------
    data : list[str | bytes]
        The data you want to see the go representation of
    """
    c_array, number_of_items = prepare_string_array(data)

    lib.print_string_array(c_array, number_of_items)

def print_int_array(data:list[int]):
    """Prints a int array's go representation, useful to look for rounding/conversion issues

    Notes
    -----
    - Does not free because everything is allocated in python, so GC will take care of it

    Parameters
    ----------
    data : list[int]
        The data you want to see the go representation of
    """
    c_array, number_of_items = prepare_int_array(data)

    lib.print_int_array(c_array, number_of_items)

def print_float_array(data:list[float]):
    """Prints a float array's go representation, useful to look for rounding/conversion issues

    Notes
    -----
    - Does not free because everything is allocated in python, so GC will take care of it

    Parameters
    ----------
    data : list[float]
        The data you want to see the go representation of
    """
    c_array, number_of_items = prepare_float_array(data)
    lib.print_float_array(c_array, number_of_items)

# ========== Free Functions ==========
def free_c_string(ptr: c_char_p):
    """Frees a single C string returned from Go (allocated via C.CString)."""
    lib.FreeCString(ptr)

def free_string_array(ptr: CStringArray, count: int):
    """Frees an array of C strings returned from Go."""
    lib.FreeStringArray(ptr, count)

def free_int_array(ptr: CIntArray):
    """Frees a C int array returned from Go."""
    lib.FreeIntArray(ptr)
    
def free_float_array(ptr: CFloatArray):
    """Frees a C float array returned from Go."""
    lib.FreeFloatArray(ptr)

def free_string_array_result(ptr: _CStringArrayResult):
    """Frees a StringArrayResult (including the array of strings and struct itself)."""
    lib.free_string_array_result(ptr)

def free_int_array_result(ptr: _CIntArrayResult):
    """Frees an IntArrayResult (including the array and the struct itself)."""
    lib.free_int_array_result(ptr)

def free_float_array_result(ptr: _CFloatArrayResult):
    """Frees a FloatArrayResult (including the array and the struct itself)."""
    lib.free_float_array_result(ptr)

```

`__init__.py`

```python
"""A package to help with building Go-python libraries

Helper Functions
----------------
- get_library(dll_path:str,source_path:str="", compile:bool=False) -> CDLL: Get's the DLL specified, will compile if not found and flag is specified

Converting to ctypes
--------------------
- prepare_string(data: str | bytes) -> c_char_p: Takes in a string and returns a C-compatible string
- prepare_string_array(data:list[str|bytes]) -> tuple[Array[c_char_p], int]: Takes in a string list, and converts it to a C-compatible array
- prepare_int_array(data:list[int]) -> tuple[Array[c_int], int]: Takes in a int list, and converts it to a C-compatible array
- prepare_float_array(data:list[float]) -> tuple[Array[c_float], int]: Takes in a float list, and converts it to a C-compatible array

Converting from ctypes
----------------------
- string_to_str(pointer: c_char_p) -> str: Takes in a pointer to a C string and returns a Python string
- string_array_result_to_list(pointer:_CStringArrayResult) -> list[str]: 
- int_array_result_to_list(pointer: _CIntArrayResult) -> list[int]: 
- float_array_result_to_list(pointer: _CFloatArrayResult) -> list[float]: 

Debugging Functions
-------------------
- return_string(text: str | bytes) -> str: Debugging function that shows you the Go representation of a C string and returns the python string version
- return_string_array(c_array:CStringArray, number_of_elements:int) ->list[str]: Debugging function that shows you the Go representation of a C array and returns the python list version (does not free)
- return_int_array(c_array: CIntArray, number_of_elements: int) -> list[int]: Debugging function that shows you the Go representation of a C int array and returns a Python list
- return_float_array(c_array: CFloatArray, number_of_elements: int) -> list[float]: Debugging function that shows you the Go representation of a C float array and returns a Python list
- print_string(text: str | bytes): Prints a string's go representation, useful to look for encoding issues
- print_string_array(data:list[str|bytes]): Prints a string array's go representation, useful to look for encoding issues
- print_int_array(data:list[int]): Prints a int array's go representation, useful to look for rounding/conversion issues
- print_float_array(data:list[float]): Prints a float array's go representation, useful to look for rounding/conversion issues

Freeing Functions
-----------------
- free_c_string(ptr: c_char_p): Frees a single C string returned from Go (allocated via C.CString).
- free_string_array(ptr: CStringArray, count: int): Frees an array of C strings returned from Go.
- free_int_array(ptr: CIntArray): Frees a C int array returned from Go.
- free_float_array(ptr: CFloatArray): Frees a C float array returned from Go.
- free_string_array_result(ptr: _CStringArrayResult): Frees a StringArrayResult (including the array of strings and struct itself).
- free_int_array_result(ptr: _CIntArrayResult): Frees an IntArrayResult (including the array and the struct itself).
- free_float_array_result(ptr: _CFloatArrayResult): Frees a FloatArrayResult (including the array and the struct itself).
"""
import os
from platform import platform

# Exported functions
from .lib import (
    get_library,
    prepare_string,
    prepare_string_array,
    prepare_int_array,
    prepare_float_array,
    string_array_result_to_list,
    int_array_result_to_list,
    float_array_result_to_list,
    return_string,
    return_string_array,
    return_int_array,
    return_float_array,
    print_string,
    print_string_array,
    print_int_array,
    print_float_array,
    free_c_string,
    free_string_array,
    free_int_array,
    free_float_array,
    free_string_array_result,
    free_int_array_result,
    free_float_array_result,
)

# Check if library exists, and if it doesn't compile it
dll_source_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "lib.go")
if platform().lower().startswith("windows"):
    dll_file = os.path.join(os.path.dirname(os.path.realpath(__file__)),"lib.dll")
    get_library(dll_file, dll_source_file, True)
else:
    dll_file = os.path.join(os.path.dirname(os.path.realpath(__file__)),"lib.so")
    get_library(dll_file, dll_source_file, True)
```

</details>

There were some interesting lessons I learned on the way.

### Array functions

Arrays, and in particular string arrays are odd sometimes. Essentially you build a large buffer, fill it with data, and go from there. In general you're just hoping the data doesn't overflow. For example these lines in `CStringArrayToSlice()`:

```go
func CStringArrayToSlice(cStringArray unsafe.Pointer, numberOfStrings int) []string {
  // Setup buffer for array contents
	const bufferSize = 1 << 30 // Allocate a huge buffer
	stringPointers := (*[bufferSize]*C.char)(cStringArray)[:numberOfStrings:numberOfStrings]
  
  // other code
}
```

Is weird, it doesn't actualy allocate memory, but it sets up a buffer for the pointers to the strings with size of 1,073,741,824 entries (not bytes). In practical terms so long as `numberOfStrings <= 1 << 30` we're good. For a sense of scale that number of **pointers** (not data) is 8GB, and if each string was 100 bytes long that would be `100GB` of RAM to just hold the strings. Here's a chart to help understand that scale:

| Strings (count) | String Size | Safe Total RAM Use      | Safe to Try?   |
| --------------- | ----------- | ----------------------- | -------------- |
| 1 million       | \~50 bytes  | \~50–100 MB             | Yes          |
| 10 million      | \~100 bytes | \~1–2 GB                | Probably        |
| 100 million     | \~100 bytes | \~10+ GB                | Unlikely, but possible     |
| 1 billion       | any size    | 8 GB+ for pointers only | Not gonna happen |


Out of curiosity I tried 100 million strings on my machine (32GB of RAM) with the below test:

<div class="danger-banner">

The below code will kill **most** machines, I wouldn't go over 10 million strings on most devices

</div>

```py
print_string_array([random.choice(["Lorem", "ipsum", "dolor", "sit", "amet"]) for _ in tqdm(range(100_000_000))])
```

A typical page has 500 words, so roughly 200,000 pages, most books have ~200-400 pages, so this test was roughly 500-1,000 books worth of strings. Which consumed around ~16GB of ram (remember the theoretical usage is just the go side, python also has to store the data and pointers in it's own runtime). It took ~15 mins to run and locked up my machine the whole time. All this is to say, I think the library has fair default behaviour for **most** use cases if you decide to use it.

### C Types

As you may have noticed above the function I mentioned with string arrays had the signature of:

```go
func CStringArrayToSlice(cStringArray unsafe.Pointer, numberOfStrings int) []string {}
```

Not:

```go
func CStringArrayToSlice(cStringArray **C.char, numberOfStrings int) []string {}
```

The `cStringArray` had to be modified to accept an `unsafe.Pointer` not a `**C.char`, why? If you try testing in the library there's no issues, but when you're using it as a package...

Well, if you try to use it with `**C.char` you will get an error like:

```
cannot use cStringArray (variable of type **_Ctype_char) as **helper._Ctype_char value in argument to helper.CStringArrayToSlicecompilerIncompatibleAssign
```

This cryptic error is because **each package** that uses an `import "C"` creates a **separate** type. So, instead of using `**C.char` the actual type is something like `**helper.C.char` (though it's not actually even this either). I assume this is done because C is weird about namespacing, but essentially **every** time you `import "C"`, it creates **new** types. To avoid this problem we have to take the pointer as a generic pointer (essentially a `void*`), then cast it in the function to a string array. 


### Pinning

One of the hard-learned lessons was about memory pinning. I originally had a function like this:

```go
func StringSliceToCArray(data []string) *C.StringResult {
	// Other code removed

	return &C.StringResult{
		numberOfElements: C.int(count),
		data:             stringArray,
	}
}
```

This looks innocuous enough, I'm returning a `StringResult` (a wrapper for C-string arrays that includes the length), so everything should be fine, right? No, this memory wasn't created using `C.malloc`, it's a C object, but the memory is **owned by go**. So, you get an error like this:

```
panic: runtime error: cgo result is unpinned Go pointer or points to unpinned Go pointer
```

The original Go code is returning a Go pointer to Python (via cgo), but the pointer wasn't allocated in a way that's safe to pass across the language boundary. Specifically, Go's garbage collector isn't aware that the memory is being accessed from Python, and since it’s not ["pinned"](https://www.ibm.com/docs/ro/aix/7.2.0?topic=management-support-pinned-memory#:~:text=Pinning%20a%20memory,while%20being%20accessed.), it can move or collect the memory. You can get around this in a fancy way using the [`runtime/pinner`](https://go.dev/src/runtime/pinner.go) module, but [it's complicated](https://stackoverflow.com/questions/12098435/can-you-pin-an-object-in-memory-with-go) ([quite complicated](https://github.com/golang/go/issues/62380)). Instead if it's being passed to **outside go** you **always** need to malloc, fill the data, then return:

```go
func StringSliceToCArray(inputData []string) *C.StringResult {
	// Other code removed

  // Allocate memory for the struct
  result := (*C.StringResult)(C.malloc(C.size_t(unsafe.Sizeof(C.StringResult{}))))
  result.numberOfElements = C.int(count)
  result.data = stringArray // String array is a **C.char of the data from the inputData variable

  return result
}
```

The way I remember this is that when you're exporting functions you're dealing with C code pretending to be Go. So, no fancy Go functionality like nice syntax for structs is allowed when it's going to cross the barrier.


## Site Scraper

This example was the one I originally had in mind when I wanted to first try this out. Web scraping in python is a dream for data science because of it's flexibility, but data acquisition can be slow, tedious and typically [embarassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel#:~:text=In%20parallel%20computing%2C%20an%20embarrassingly,a%20number%20of%20parallel%20tasks.). So, the idea was to create something like this:

![](/tech/blog/python-plus-go/scraper-diagram.excalidraw.png)

Since the first article I basically re-implemented this whole demo. I simplified the code massively from the channel-based version I initially used, and that resolved an odd memory-leak I had, which lowered the overall RAM usage. However, this was by far the most annoying code to implement **on the go side** due to how many things could go wrong during processing. It was also the most frustrating to debug **on the python side** because the bugs I encountered were so trivial, and I was overcomplicating everything. You can find a copy of the code [here](https://github.com/Descent098/Python-Go/tree/main/examples/scraping).

### The emotional toll

This task was the shortest Go code I had to write, but the hardest C integration by far. I ended up having to rewrite the class a bunch of times, when using my benchmarking code I would keep getting this result:

```
--Go Starting--
Error while processing https://www.netflix.com: Get "https://www.netflix.com": stream error: stream ID 1; CANCEL; received from peer
Error while processing https://www.washingtonpost.com: Get "https://www.washingtonpost.com": stream error: stream ID 1; INTERNAL_ERROR; received from peer
Error while processing https://www.bestbuy.com: Get "https://www.bestbuy.com": stream error: stream ID 1; INTERNAL_ERROR; received from peer
Error while processing https://www.adidas.com: Get "https://www.adidas.com": stream error: stream ID 1; INTERNAL_ERROR; received from peer
Error while processing https://www.adobe.com: Get "https://www.adobe.com": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
Error while processing https://www.tesla.com: Get "https://www.tesla.com": stream error: stream ID 1; INTERNAL_ERROR; received from peer
Error while processing https://www.flipkart.com: context deadline exceeded (Client.Timeout or context cancellation while reading body)
Storing site 0/99
Storing site 1/99

~/Python-Go/examples/scraping>
```

It would run the first site properly, then die. The worst part was that this happened 3/5 runs, so some runs would still complete. This took me 2 days to fix of banging my head against the wall. Can you spot the bug:

```python
@dataclass
class Site:
    url:str         # the raw URL
    domain:str      # The domain the URL is hosted at
    server:str      # The value of the server header
    protocol:str    # The protocl of the site (http or https)
    contentType:str # The content type of the body (i.e. "text/html")
    body:str        # The body of the url
    port:int        # The port the url is on

    @classmethod
    def from_urls(cls:'Site', urls:list[str]) -> list['Site']:
        count = len(urls)
        encoded = [c_char_p(url.encode("utf-8")) for url in urls]
        
        # Create a C array of char* (aka **char)
        array_type = c_char_p * count
        
        url_array = array_type(*encoded)

        pointer = lib.parse_urls(url_array, count)
        if not pointer:
            raise ValueError("Failed to parse URLs")

        results = []
        for i in range(count):
            print(f"Storing site {i}/{count}")
            site_ptr = pointer[i]
            data = site_ptr
            try:
                results.append(cls(
                    url=data.url.decode(errors="replace"),
                    domain=data.domain.decode(errors="replace"),
                    server=data.server.decode(errors="replace"),
                    protocol=data.protocol.decode(errors="replace"),
                    contentType=data.contentType.decode(errors="replace"),
                    body=data.body.decode(errors="replace"),
                    port=data.port
                ))
            except AttributeError:
                continue # No data
            finally:
                cls.free_sites(pointer,count )
        return results

    @staticmethod
    def free_sites(array_pointer: _CSite, count:int):
        if not array_pointer:
            return
        lib.free_sites(array_pointer, count)
```

<details><summary>Click for Answer</summary>

The lib.free_sites() is being called in the loop:

```python
for i in range(count):
  print(f"Storing site {i}/{count}")
  site_ptr = pointer[i]
  data = site_ptr
  try:
      results.append(cls(
          url=data.url.decode(errors="replace"),
          domain=data.domain.decode(errors="replace"),
          server=data.server.decode(errors="replace"),
          protocol=data.protocol.decode(errors="replace"),
          contentType=data.contentType.decode(errors="replace"),
          body=data.body.decode(errors="replace"),
          port=data.port
      ))
  except AttributeError:
      continue # No data
  finally:
      cls.free_sites(pointer,count )
```

here is the fixed code:

```python
try:
  for i in range(count):
      print(f"Storing site {i}/{count}")
      site_ptr = pointer[i]
      data = site_ptr
      try:
          results.append(cls(
              url=data.url.decode(errors="replace"),
              domain=data.domain.decode(errors="replace"),
              server=data.server.decode(errors="replace"),
              protocol=data.protocol.decode(errors="replace"),
              contentType=data.contentType.decode(errors="replace"),
              body=data.body.decode(errors="replace"),
              port=data.port
          ))
      except AttributeError:
          continue # No data for one of the values
finally:
  cls.free_sites(pointer,count )
```

</details>

I gaslit myself for 2 days that it had to be an issue in my CGo code, when actually it was a python mistake. I'm not entirely sure why the code would succeed occasionally, that part still stumps me to this day. My assumption is I was being rate limited so my requests weren't even starting and were all returning empty data .


## Spell Check

A few years ago I needed (wanted) to implement a spell checker for a work project. It was a cli with about a dozen options for commands, as well as the ability to select from one of a few dozen environments we had. For both I wanted spell check to help catch people when things went wrong. So for example lets say you have 4 valid options, I would want code like this:

```python
valid_options = ["init", "move", "delete", "ingest"]

valid_input = False

while not valid_input:
    response = input("Enter your action: ")
    if not response in valid_options:
        suggest_word(response, valid_options)
    else: # Validated
        valid_input = True
        do_action(response)
```

So if you typed in something like `inyt` you would get a message saying `invalid command, were you trying to use init?`. Same thing with the environments if you misspelt one, it would suggest the closest valid one. With python I did this originally with [Levenstein](https://github.com/rapidfuzz/Levenshtein), but I wanted to use this as a test since the calculations can be quite computationally expensive. I wanted to keep the code simple, so I also didn't want to use multithreading, or anything fancy. Basically just a straight drag race of python alone vs python + go. 

I ended up with [two versions](https://github.com/Descent098/Python-Go/tree/main/examples/similarity):

1. The originals; These two versions use a pre-determined dictionary of ~370,000 words. Handy for more traditional spellcheck
2. With Helpers; This version instead lets you input your own dictionary of words to search through, more practical, but in most cases harder to see as much improvment (most people don't include a ton of words)

In both cases go performed admirably, and in general if I were to optimize the code with multithreading it would be a night and day difference. Here is what the setup looked like:

![](/tech/blog/python-plus-go/similarity-diagram.excalidraw.png)

### Windows Dangers

I learned a lot making spell check, but the most prominent lesson I learned was with the issues of building on windows. I Have been a long-time supporter of making code cross platform, and I personally use windows a lot, but there were many times I was being driven over the edge by how annoying it made this whole process.

To give the devil his due Microsoft is at a bit of a catch-22. There's constantly malware being written, and I understand trying to keep people safe, however, compiling can be a nightmare on windows. My original approach was a bit too clever for my own good.


<div class="warning-banner">

For windows users we [this version](https://github.com/Descent098/Python-Go/tree/main/examples/similarity/original-embedded) uses `//embed` is a common method for hackers to use to embed dangerous payloads, so windows won't let us compile until we modify settings. If you want to run it, here's the steps:

<details><summary>Click for instructions</summary>

1. Create a folder that we can use as a temporary folder. For me I add it to my downloads folder under `/go-temp`
2. From there we need to reset our `GOTEMPDIR` to the folder we created for me that's `%USERPROFILE%\Downloads\go-temp` so I would run `go env -w GOTMPDIR="%USERPROFILE%\Downloads\go-temp`
3. Set up an exclusion in the windows defender using the steps below

![](/tech/blog/python-plus-go/setup-exclusions.png)

</details>

</div>

That being said, [the second version](https://github.com/Descent098/Python-Go/tree/main/examples/similarity/original-hardcoded) of the same code fixes this in an idiotic way. I just inlined the text file directly. I don't know why microsoft doesn't consider a ~370,000 item list to be suspicious, but somehow they don't. 

## Practical tips

Here are a few other takeaways:

- Problems can come from either side of the fence
  - Some bugs will be in your go logic, some in your python logic, some in the binding layers between them. The reason I wrote the helper was to help avoid at least the last two possibilities (to some success)
  - When compiling your go code, [GOTRACEBACK](https://pkg.go.dev/runtime?utm_source=godoc#hdr-Environment_Variables) can be a godsend. The default "production" tracebacks are a nightmare to debug with. You can find information about this variable below
    - https://dave.cheney.net/tag/gotraceback
    - https://gist.github.com/pohzipohzi/eb9735099a3b6b8c808877449febd5e8
  - When debugging your python code, the [`gc`](https://docs.python.org/3/library/gc.html) module is a trap. The documentation will tell you that if you want to try to debug leaks you can checkout `gc.set_debug(gc.DEBUG_LEAK)`. The leaks referred to here are **python** related, not `ctype` related. This is useful to check if you're accidentally holding a reference to a python object, but not if your go-allocated objects are hanging around.
  - [`tracemalloc`](https://docs.python.org/3/library/tracemalloc.html) is also another python trap, it can only see memory allocated by python, none in the C runtime
- Keep your code simple
  - Working with these two discrete but linked systems is complicated enough, don't add the complexity of overly clever code on top of that
  - Originally I built everything with channels because I wanted to learn about them. I endded up dropping channels (except for my semaphore) and went with [sync.Map](https://victoriametrics.com/blog/go-sync-map/) + [sync.WaitGroup](https://victoriametrics.com/blog/go-sync-waitgroup/index.html), then I failed at that somehow and instead went with a standard array and a [sync.Mutex](https://go.dev/tour/concurrency/9). This resulted in less than 1ms time difference, but much, much simpler to understand
    - Hacks are hacky, but somteimes work well
      - Quick and dirty [Semaphore](https://medium.com/@deckarep/gos-extended-concurrency-semaphores-part-1-5eeabfa351ce)
- Testing is incredibly hard to do well
  - There are many instances that either language will try to stop you from doing before you do them. So invalid states are hard to emulate sometimes
  - In Go you CANNOT use the `C` package, which means your API has to be fully exposed with any functions you need for testing
- Go packaging is hard to get right, not an issue specific to any of this code, but just be aware of that
- It took me a few days to solve an issue in go related to how the concurrency was being managed in the scraper. 
  - Normally this would be trivial to debug with the `-race` flag, however windows further complicated development (been happening a lot recently), and I actually ended up having to switch to linux to debug what was happening because although `zig cc` is a wonderful crossplatform miracle, it doesn't run [go's race detector](https://go.dev/doc/articles/race_detector) properly.

- In general this solution is relatively fragile
  - I did not try this on multiple distributions, I suspect building these packages for various distributions would be time-consuming, and suck
  - I tested on a single [GOOS and GOARCH](https://gist.github.com/asukakenji/f15ba7e588ac42795f421b48b8aede63)
    - Different GOOS and GOARCH would need to be built separately, which makes this a pain in the ass on the go and python side (to import)

## Conclusions

I am glad I explored using CGO for accelerating python, that being said it was incredibly annoying. If you do not need it, I would not recommend it. There are many options for subtle bugs that are hard to avoid. Even in these relatively trivial examples it was a lot of code, with a good amount of surface area to break things. If you do need it, I hope the tooling I wrote is helpful. I would say give it a shot, I learned a lot, but for production I don't want to "learn" I want things that "work", and this takes a lot of fiddling to get right. 

