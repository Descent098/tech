---
title: "When Standard Advice Fails"
subtitle: "When the rule of thumb stops working"
description: "Why understanding the exceptions to the rule, and measurements are imoprtant"
pubDate: 2026-02-11T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/when-standard-advice-fails/hero.png
tags:
  - project-management
  - open-source
  - performance
  - testing
  - python
---

Rules are a great tool for making things simple. There's a lot to think about when programming and rules provide shortcuts to avoid that endless complexity. For ~6 years now there are 2 rules of thumb I've recommended in python:

1. %90 of the time use a generator, not a list or tuple
2. Use dataclasses not standard classes

These rules are great, and they make the majority of python code you write faster, and more memory efficient, but...

## Every Rule Has it's Exceptions (TODO)

As I learned after my last post every rule has it's exceptions. The great part about computers is that you **can** test most things, and learn from your mistakes or pre-conceptions, which is why you should profile whenever you can. That being said, let's look at the example from the last article, and a much simpler one for dataclasses, to see why you shouldn't just blindly follow advice.

### The Elephand Sized Generator in the Room (TODO)

In my [last post](./performance-is-hard.md) I showed an example of a simple function that used a generator, and one that used a list to do string processing:

```python
def better_gen(sentence:str) -> int:
    return sum(
        len(word) 
        for word in sentence.split() 
        if word.lower() not in stopwords
    )

def better_list(sentence:str) -> int:
    return sum(
        [
            len(word) 
            for word in sentence.split() 
            if word.lower() not in stopwords
        ]
    )
```

You would expect (or at least I did) the generator to be faster, since, in general, memory allocation (particularly repeated memory allocation) is one of the slowest operations you can do. The intuition for this is pretty simple, when you want to allocate memory, you have to make sure you don't trample other memory that exists. Because of this, under the hood you need to do a bunch of checks to make sure you don't trample other memory, and then you have to ask the computer to actually reserve that memory for you, which takes a fair bit of time.

When you create a list in python you're basically asking for chunks of memory to store the data. Particularly for strings, since you don't know the final size of the data. Traditionally for memory you have a set capacity that you have allocated, then you expand that capacity as needed. This is why `Generator`s are often **necessary** to even run your code, because you can't just keep everything in memory all the time. If you have 400GB of raw data to process, you can't keep all that in memory. What generators do instead is they **lazily evaluate**, meaning they typically keep a slot of memory open for the current value they're processing, and process that value only when asked. This means that if that 400GB of data is entirely 32-byte integers, you only have 32-bytes, or whatever is necessary for the current value being allocated at a time (it's more complicated than this in practice). 

So, going back to our original function, nothing actually happens with `better_gen()` until we start itterating on it. Generally this is more memory efficient, and often **faster** than using something like a list, since the list will need to allocate memory for all of it's strings. However, in my test, after profiling, `better_gen()` is actually slower than `better_list()`. I used this as an argument why, when possible you should **profile** your code, and not just rely on theory. Many things in reality can make things more complicated.

#### Potential Explanation

The problem in this case **seems** to be twofold:

1. Python is an optimizing compiler (interpreter); This means the code you get out is not necessarily what you put in. If the compiler can find clever optimizations, it will do them for you. I'm guessing since we immediately `sum()` the list, some other fancy optimization is running to mitigate the allocation cost
2. Objects (and therefore functions) are not free

Ignoring the first one (because it's a cop-out answer), it's important to remember that code **does stuff** (very insightful). Everything you want to do has some sort of a cost, even if it's small. If I drive my car over a thin layer of gravel, the damage is negligable, drive it over a thin layer of gravel 10,000,000 times, and you'll strip the tires. I tried reading through the [cpython implementation of Generators](https://github.com/python/cpython/blob/main/Objects/genobject.c) out of curiosity. 

Now, **this next part is speculative**, I do not have enough time to fully digest this code, but after a quick reading of [this part](https://github.com/python/cpython/blob/main/Objects/genobject.c#L1037-L1110), there's at least 47 fields internally associated with each generator just in it's metadata ([potentially much more?](https://github.com/python/cpython/blob/main/Objects/genobject.c#L1390-L1440)). Most of this seems to be stack frame metadata, there's also ~8 function pointers and a few chars that have to be allocated when the struct is setup. I **assume** this runs only once when you create the generator, but if any of these allocations run each value, that could add up. Additionally calling functions is not free, there is overhead associated with calling a function (stack frames, pointer manipulation, data validation constraints, etc.). I assume the python core development team is much better at C than me, so there's probably optimizations I don't know that exist here. Either way, with our previous data it ran  104,789 times, that's enough to make up for the few miliseconds difference. Likewise, if we compare the three calls from the profiler, we get something like this:

```
   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.020    0.020    0.040    0.040 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:5(original)
   118886    0.009    0.000    0.009    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.005    0.005    0.005    0.005 {method 'split' of 'str' objects}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.sum}
...
        1    0.023    0.023    0.042    0.042 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:8(changed)
   118886    0.009    0.000    0.009    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.004    0.004    0.004    0.004 {method 'split' of 'str' objects}
...
        1    0.000    0.000    0.053    0.053 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:33(better)
        1    0.007    0.007    0.049    0.049 {built-in method builtins.sum}
   104789    0.027    0.000    0.042    0.000 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:34(<genexpr>)
   118886    0.010    0.000    0.010    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.004    0.004    0.004    0.004 {method 'split' of 'str' objects}
```

Every function ran `str.lower()`, `len(str)` and `str.split()` exactly the same number of times, **but** our generator also ran the function to generate the next value `104,789` times. This means the generator function call is essentially the only overhead. 

Now, to give the first point it's due. I don't know what black magic they're pulling to make the first two functions not have to allocate any additional memory. The semantics of `better_list()` are such that a list should be constructed containing the length of every string. Perhaps because the list is "anonymous"? I tried the below example:

TODO: TEST BELOW PERFORMANCE
```py

def better_list_worse(sentence:str) -> int:
    data = [
            len(word) 
            for word in sentence.split() 
            if word.lower() not in stopwords
        ]
    return sum(data)
```

Either way, as we see from the profiling, it's doing something clever to avoid doing the work that the program **implies** it should do. So, if you find that a generator function is running slowly, and **the data fits in memory**, try the list comprehension, it might be faster. But overall, it's probably still well worth the memory savings in larger applications.

### A Class of Data

I mentioned dataclasses, so what are they? Dataclasses are a special way of declaring python classes, here is an example of a `User` class:

```py
from dataclasses import dataclass

@dataclass(slots=True)
class User:
    name: str
    age: int
    height: float

my_user = User("Kieran", 27, 180.3)
```

Not only is it much more compact, type hinting is a core part of the experience, and it's more memory efficient. To oversimplify, essentially what this does is something like this:

```py
class User:
    __slots__ = ('name', 'age', 'height') # Static the available attributes

    def __init__(self, name:str, age:int, height:float):
        self.name = name
        self.age = age
        self.height = height

    def __repr__(self) -> str:
        "What get's returned when the instance is printed or str converted"
        return f"{self.__class__.__name__}(name={self.name}, age={self.age}, height={self.height})"
```

Both work like a normal class, but they have one caveat. Both use the `__slot__` system. Many people are probably unaware, but python classes support **dynamic attributes**. This means you can add extra attributes to a class **whenever you want**. As an example here is a (terrible) way to do that `User` class from earlier:

```py
class User:
    ...
    def __repr__(self) -> str:
        "What get's returned when the instance is printed or str converted"
        return f"{self.__class__.__name__}(name={self.name}, age={self.age}, height={self.height})"

my_user = User()
my_user.name = "kieran"
my_user.age = 27
my_user.height = 180.3
```

This means that python has **no idea** when a class is "done". This means that for the python runtime, it **cannot optimize** with certain optimizations (like chunk-allocating memory) because it needs to account for this class growing. `__slots__` instead is a way to specify which attributes will be part of this class, and will raise an `Exception` if you try to add more:

```py
from dataclasses import dataclass

@dataclass(slots=True)
class User:
    name: str
    age: int
    height: float

my_user = User("Kieran", 27, 180.3)

my_user.q = 4 # Errors
```

The above code will give you the following stack trace:

```
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'User' object has no attribute 'q'
```

Personally I think this is nicer default behaviour on top of the efficiency gains, the problem is sometimes you want the dynamic behaviour. I wrote a package a while ago called [ezspreadsheet](https://github.com/descent098/ezspreadsheet/), this package basically took a spreadsheet (`.csv`, or `.xlsx` file), read the header, and used that to construct custom classes dynamically (yes, this was a terrible idea I later fixed). In this case I was using (abusing) the dynamic behaviours, which means dataclasses would break the whole library. Likewise if you use dataclasses with slots enabled in a library that assigns arbitrary attributes, it will break.


### Why Keep the Rules?

As we've seen I was ultimately wrong **after profiling**, and I was wrong because of my reliance on a "rule". Does this imply I should drop the rule? or not have "rules" in general? Well, no. As I said earlier, rules are a good idea because they cut back on complexity. Often times in the moment we might think we're being clever, and can actually be completely wrong. Multiple times in trying to blindly (or theoretically) improve performance I made "obvious" mistakes, that are not so obvious before you try them and measure.

For the specific rule, while this case does show the performance is better in the "large" file, in reality if we bumped up the file size, or multiprocessed it, we might fully crash the system with the extra memory overhead. But, again, broadly the important thing is how we found the problem. To beat a dead horse more, I assumed, but then I **tested**, and I **learned**. Going forward if I'm using a generator, and I have extra memory overhead, I know that doing this sort of string processing in a list can be faster, so it's a possible approach I might take if I **see** a problem. The rule failing in this case is why it's important to test, because whether we share the same rules, **people (including you) will take mental shortcuts**, and those shortcuts can lead a path to nowhere good. Which is why understanding **why** a rule exists is also incredibly important to help debugging problems when you encounter the edge cases.
