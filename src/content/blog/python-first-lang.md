---
title: A defense of python as your first language
subtitle: "Why you should learn python first"
description: "Your first language can be a hard choice, hopefully this helps make it easier"
creation_date: 2024-03-09T00:00:00-06:00
pubDate: 2024-03-09T00:00:00-07:00
heroImage: /tech/blog/python-first-lang.png
tags:
  - web
  - teaching
  - opinion
---
I have heard many people recently complain about learning python as a first language. Namely people complain that something like javascript should be used because of it's ubiquity. There are many reasons to learn python in general, but I think it is the best first language since:

1. It has a perfect amount of abstraction to learn with
2. It is simple to use
3. It has (mostly) no major language mistakes
4. It has many fields you can go into
5. It has professional relevance
6. It has a large community

## Abstraction

I mentioned python has a perfect amount of abstraction, what do I mean by this? Python is a very high-level language. This means the code you write is often doing a ton of things for you under the hood. All languages start being written in source code (what we read), and find some way to eventually be run as machine code. This transpillation (going from one language to another) in python follows a few steps. Since python is interpreted the language runs by:

1. Converting the source code you write into an AST (abstract syntax tree see [ast](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38) for details, and [this package](https://docs.python.org/3/library/ast.html))
2. The AST is turned into python [bytecode](https://www.reddit.com/r/Python/comments/1rfrfd/what_is_bytecode/) video about topic [here](https://www.youtube.com/watch?v=0IzXcjHs-P8) (you can read the bytecode with [dis](https://docs.python.org/3/library/dis.html))
3. The bytecode is fed into the **python runtime**, which then executes it as machine code on your machine

So there are at least 3 (but actually way more) steps between you and the computer. This allows python to do things for you, and to optimize your code automatically at various stages. Because of this python code is very easy to read for beginners, and allows people to focus more on the important concepts, and less on the language. Compare the following code between python, javascript, java, go and C:

*python*
```python
with open("myfile.txt") as my_file:
	contents = my_file.read()

print(contents)
```

*javascript (requires nodeJS)*
```javascript
const fs = require('node:fs');

fs.readFile('/myfile.txt', 'utf8', (err, data) => { 
	if (err) { 
		console.error(err); 
		return; 
	} 
	contents = data
	});
```
or 
```js
const fs = require('node:fs');
	try { 
		const contents = fs.readFileSync('myfile.txt', 'utf8'); 
		console.log(contents);
	} 
	catch (err) { 
		console.error(err);
	}
```
*java*
```java
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files

public class ReadFile {
  public static void main(String[] args) {
    try {
      File myObj = new File("filename.txt");
      Scanner myReader = new Scanner(myObj);
      while (myReader.hasNextLine()) {
        String data = myReader.nextLine();
        System.out.println(data);
      }
      myReader.close();
    } catch (FileNotFoundException e) {
      System.out.println("An error occurred.");
      e.printStackTrace();
    }
  }
}

```

*go*
```go
package main

import (
    "iotuil"
    "fmt"
)

func main() {
    contents, err := iotuil.ReadFile("myfile.txt")
    if err != nil {
        fmt.Printf("%v", err)
    }
    fmt.Println(string(contents))
}
```

*C* (from [here](https://www.geeksforgeeks.org/c-program-to-read-contents-of-whole-file/))
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
 
// Driver code
int main()
{
    FILE* ptr;
    char ch;
 
    // Opening file in reading mode
    ptr = fopen("myfile.txt", "r");
 
    if (NULL == ptr) {
        printf("file can't be opened \n");
    }
    // Printing what is written in file
    // character by character using loop.
    do {
        ch = fgetc(ptr);
        printf("%c", ch);
 
        // Checking if character is not EOF.
        // If it is EOF stop reading.
    } while (ch != EOF);
 
    // Closing the file
    fclose(ptr);
    return 0;
```

All (but the C code) read a file called `myfile.txt` and print it's contents, unless they get an error, in which case they print an error. But to do this requires:

| Language   | Concepts                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Python     | file paths, context managers (`with`), calling functions, variables                                                                                          |
| Javascript | imports, file paths, async vs sync, creating functions, anonymous functions/callbacks, error handling, encodings, variables, calling functions, conditionals |
| java       | imports, classes, methods, static classes, error handling, while loops, scanners, variables, calling functions, instances                                    |
| Go         | imports, file paths, variables, calling functions, error handling, format strings, conditionals                                                              |
| C          | defines, file paths, pointers, variables, calling functions, chars vs strings, EOF's, while loops, conditionals                                              |

I was surprised, and had forgotten how much you need to know to do something this basic in JS, and Java, and how little to do it in Go. Overall if you're trying to learn a language python provides a nice layer of abstraction where things like this are easy, don't get in your way, and can be scaled with better understanding. For example maybe you learned more about file paths and want to make the code run in a path relative to the file you're in, you can learn to do:

```python
import os

file_name = "myfile.txt"
file_path = os.path.join(os.path.dirname(__file__), file_name)


with open(file_path) as my_file:
	contents = my_file.read()

print(contents)
```

and continue to scale from there. Maybe you turn it into a function, and now you started learning about type safety, you can add that in to:

```python
import os
import sys

def open_file(file_name:str="myfile.txt") -> str:
	if not type(file_name) == str:
		try:
			file_name = str(file_name)
		except as e:
			error_type, msg, traceback = sys.exc_info()
			print(str(traceback))
			print(f"Could not convert {file_name} to a string with error: \n\t{error_type}:{msg}")
			sys.exit(1)
			

	file_path:str = os.path.join(os.path.dirname(__file__), file_name)
	with open(file_path) as my_file:
		contents = my_file.read()
	return contents


```

Most other categories of code are similar. Python provides you with tooling to get a handle on what you're doing, and focus on structure of the code and problem solving, not API details and intricacies. If someone wants a program to open a file, read it, and replace some text, then python let's them focus on the task, the others make them focus on the language more than the task itself for a beginner.

## Simple to use

I'm actually not talking about syntax here, I just mean actually using python. In order to run python you need to install python, and then run it from the command line. This is easy across the board on linux, windows and macOS. From there you use the interpreter, or create a file and you're good to go. If you want packages then pip is how you manage them. Pip is usually included, but can be installed with [a single script](https://bootstrap.pypa.io/get-pip.py). You then install through pip (`pip install <package>`), or use a [venv](https://docs.python.org/3/library/venv.html). With this knowledge you can run (basically) every python script and package you want. 

JavaScript on the other hand requires you to decide your runtime. NodeJS, Bun, Deno, what about the browser? Before you can even start teaching JS there's a whole background set of conversations to have to explain how to run it. This may not sound like a big deal to developers, but to **first time** programmers the additional complexity is just annoying. Then we get on to packages and it's a nightmare. Do you want npm, pnpm, some tutorials say to use npx, or yarn, which to use? For your own projects this is fine, but if you're following along in a tutorial who knows which one they will use. 

Java is even worse than JavaScript. Initially if you google it will recommend you use oracle java. There are lots of issues with this and instead you should use [openJDK](https://openjdk.org/). Once you have that up and running you just need to compile with `javac` and run with `java`. But now comes the nightmare worse than writing the code, packages. Maven, Gradle, Ant and the tons of other mutually exclusive package management systems that make java a nightmare. Someone once joked that java is just the language [eclipse](https://eclipseide.org/) happened to run, and I think this is true more and more each day. You **can't just write a java app**, you **need an IDE**.

Go is surprisingly good here. I used it years ago and hated it, but now it's so simple to use. Install via one of their guides on [their site](https://go.dev/doc/install), and run `go run <file>.go`, to build instead do `go buid <file>.go` and then run the resulting binary. Likewise go package management is very good now. One tool, and everything all built in. I would say go is actually better than python for it's simplicity these days. This is before mentioning tools like [`gopls`](https://pkg.go.dev/golang.org/x/tools/gopls) or the testing frameworks.

C is and always will be a nightmare for all of this. It was not made for the likes of mere mortals like beginner programmers. On Linux, C development has built in tools like gcc and is a first-class citizen. On windows C is a nightmare. Setting up a C environment on windows for a beginner programmer isn't worth the effort and time. Likewise most package management systems aren't worth it, and vendoring code (copy-pasting into your project) is just more reliable and easier.

## Language mistakes
This is directly a shot at Javascript. Javascript has **mistakes** in it's language definition. Because of how quickly it was written Javascript has inconsistencies these inconsistencies will break your understanding of programming and give you a bad indication of how concepts work. For example consider some issues with array's (from [here](https://www.youtube.com/watch?v=D5xh0ZIEUOE)):

```js
data = []

console.log(data[2]) // undefined
```

So I can access non-existent keys without an error and I can assign random slots out of order:
```js
data[4] = "q"

data.length // 5
```
and I can access using string indices that will be auto-converted to `int`s:
```js
data["4"] // "q"
```
Likewise At this point data is 3 `undefined`'s then a "q" `data = [undefined, undefined, undefined, "q"]` so if I wipe out the q and make it undefined the list should be empty right?

```js
data = []

data[4] = "q"

data.length // 5

data[4] = undefined

data.length // 5

data // [empty × 4, undefined]
```

But that's ok, javascript is mutable so we can just correct it ourselves ;) 

```js
data.length = 0

data.length // 0
```

and in case your wondering, yes that actually removed all the values from the array and it's actually empty now.

This is just one type of issues with arrays, issues exist with type coercisons, operations, and even things as simple as [if you need a semicolon](https://lucumr.pocoo.org/2011/2/6/automatic-semicolon-insertion/#:~:text=Virtual%20Semicolons%20in,are%20missing%20(7.9.2) or not. These errors will fundamentally change how people program, and are **exclusive to javascript**. Python offers the same dynamic typing, but properly errors when it's supposed to, and doesn't have those weird syntax bugs (though you can use semicolons in python for [-c mode](https://docs.python.org/3/using/cmdline.html#cmdoption-c)).

There is only 1 thing I would consider broken in python and even though it has a justification I think it was a potential mistake:

```python
def foo(l = []):
	l.append("q")
	return l
```

What do you think happens with this code:

```python
print(foo())
print(foo())
print(foo())
print(foo())
print(foo([]))
print(foo())
```
Unfortunately because we specified an empty list python created an object with a reference to it, and assigned the reference to the default value `l`, this means each call operates on **the same** default value:

```python
print(foo()) # ['q']
print(foo()) # ['q', 'q']
print(foo()) # ['q', 'q', 'q']
print(foo()) # ['q', 'q', 'q', 'q']
print(foo([])) # ['q']
print(foo()) # ['q', 'q', 'q', 'q','q']
```

## Fields & professional relevance

Python has a wide range of fields that you can use it for. It has industry-ready packages for machine learning, web development, data science, scripting/devops, enterprise low-code platforms and tons of other fields. Javascript and java potentially have more jobs overall in web development and enterprise respectively, but they don't have anywhere near the breadth of options.

In python alone I have had jobs in data science, distributed computing, enterprise application development, low-code development, and web-dev. JavaScript realistically has front-end development, **some** native app dev, and some UI work for games. While companies use it for other things, this is much less common than python. Java likewise has found it's footing firmly in enterprise, and very little else. Go and C both have their niche's also, but again python just has a wide range of fields you can grow into compared to the other alternatives proposed. 

With companies like [databricks](https://www.databricks.com/), and [azure](https://azure.microsoft.com/en-ca/products/power-platform) choosing them as interfaces for most of their projects, and projects like [jupyter](https://jupyter.org/), [pytorch](https://pytorch.org/) etc. there's a lot of relevance.

## It has a large community

JavaScript likely is even bigger, but python has a big enough community that there are **so many** resources about it.  Additionally the common behaviors in the community I find are better than what you get in other communities. For example the python community is less likely to be willing to break functionality in packages compared to JavaScript. Likewise the python community often has better resources and docs available for most packages than languages like C. Also because python is so often a "beginner language" there's a lot of beginner friendly content. 

## Don't be stuck in one language
This article argues what should be your first language, not your last. I hope you choose python for the reasons I argued above, but python should not be your only language. I think it gives you a good footing to go off and learn the others mentioned as well. I write 3 of the 5 languages mentioned on this list on a weekly basis. Once you start getting your footing shop around. My personal suggestion for different orders would be:

1. Web focused: 

`python --> JavaScript --> go --> Java --> C`

2. Theoretical, meaning you want to know how computers work:
 
`python --> C --> go --> JavaScript --> Java`

3. Enterprise, meaning you want highest likelihood of a job: 

`python --> JavaScript --> Java --> C --> go`

I would also recommend learning Typescript after starting to learn JavaScript. It can help avoid **some** issues of JavaScript.

## Conclusion

Learn whatever language you want, but I would recommend starting with python. On top of everything mentioned above I also think it's good to start with python because it's syntax is more uncommon. This means understanding what happens in your code is more decoupled from the syntax as you add additional languages as well. But whichever language you choose, I wish you well on your coding journey!