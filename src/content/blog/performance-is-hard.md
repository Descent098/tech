---
title: "Performance is Hard"
subtitle: "Details matter a lot"
description: "Even simple code takes a lot to optimize"
pubDate: 2026-02-08T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/performance-is-hard/hero.png
tags:
  - project-management
  - open-source
  - performance
  - testing
---

Performance testing is often a pain. Trying to figure out what's happening, and a good methodology can be annoying. There's lots of little things you miss, or don't occur to you until you run into them. So, welcome to an experience in the painful various ways of doing performance testing.

## Background

I was watching a [YouTube video](https://www.youtube.com/watch?v=NwDUbheiNrI) recently. The video was talking about writing more "readable" code. While I agree with the author's point, I also was curious if there were any performance implications to doing this. To save you some time in looking it up, the code was basically a bit of code that removes "stop words" ("the", "and", "to", etc.), then sums the remaining words. This sort of task is pretty common in linguistic analysis. Here is what the code looked like:

```py
stopwords = ["to", "the", "and"]

def original(sentence:str) -> int:
    return sum([len(word) for word in sentence.split() if word.lower() not in stopwords])

def changed(sentence:str) -> int:
    total = 0
    for word in sentence.split():
        if word.lower() not in stopwords:
            total += len(word)
    return total
```

While I agreed with the author, I assumed the second set of code would be slower since you have to initialize a variable. Then I realized the first function is creating a list instead of yieldig results, meaning the overhead from that could actually make it slower than the second, then I realized....

This could go on for a bit, and often does in a professional context. So, how can we actually tell?

## Semi-practical approach

I recently started looking into compilers. Because of this I know that python is a byte-code interpreted language. So, the code is first converted into bytecode, then that bytecode is converted into machine instructions on the machine. 

![source code conversion to machine code](/tech/blog/performance-is-hard/conversion.png)

Therefore, just check which method has less bytecode. Additionally the interpreter does a bunch of work to optimize python code in it's initial parse phase, so I assumed that a larger ast tree could also slow down initial execution, and decided to check the length of that as well:

```py
import ast, inspect, dis
from contextlib import redirect_stdout

original_ast = ast.dump(ast.parse(inspect.getsource(original)), indent=4)
changed_ast = ast.dump(ast.parse(inspect.getsource(changed)), indent=4)

original_raw_bytecode = original.__code__.co_code
changed_raw_bytecode = changed.__code__.co_code

print(f"Original: {len(original_ast)=} {len(original_raw_bytecode)=}\n\n")
print(f"changed: {len(changed_ast)=} {len(changed_raw_bytecode)=}")
print(original_raw_bytecode == changed_raw_bytecode)

# Write the bytecode to a file to be looked at later
with open('original_bytecode.txt', 'w+') as f:
    with redirect_stdout(f):
        dis.dis(original)
with open('changed_bytecode.txt', 'w+') as f:
    with redirect_stdout(f):
        dis.dis(changed)
```

So with this we get something like:

```
Original: len(original_ast)=2004 len(original_raw_bytecode)=164
Changed: len(changed_ast)=1879 len(changed_raw_bytecode)=136
```

So, the more readable version actually has a smaller AST and less bytecode, so faster, right?

## Actual Tests

Hopefully most people can recognize that there were a lot of assumptions being made up until this point. Not to mention the above analysis is great and all, but it's a bit complicated. It's a lot of work for even testing 1-5 line functions, enough that I would probably have to look up how to do this each time. So, let's do what you should actually start with, which is some performance testing. Essentially just doing a head-to-head drag race of the functions. I setup a new python file, and imported the functions from earlier:

```py
import timeit
from main import original, changed

RUNS_PER_TEST = 300

if __name__ == "__main__":
  test_str = "I went to the store to get some milk"
  for function in (original, changed):
    time_taken = timeit.timeit(f"function(\"{test_str}\")", globals={"function":function}, number=RUNS_PER_TEST)
    print(f"For the function {function.__code__.co_name}() it took an average of {time_taken/RUNS_PER_TEST} over {RUNS_PER_TEST} runs")
```

Which gave us some results:

```py
For the function original() it took an average of 8.643333179255327e-07 over 300 runs
For the function changed() it took an average of 8.049999208499988e-07 over 300 runs
```

Great, so now we **know** that `less bytecode = faster`, right? I was still skeptical, so I decided to throw in 2 additional tests, long data. I grabbed dante's inferno, and the illiad from [project guttenberg](https://www.gutenberg.org/), and updated my script:

```py
import timeit, os
from main import original, changed

RUNS_PER_TEST = 300

TEST_CONTENT = ("I went to the store to get some milk",)
for filename in os.listdir("test_files"):
    with open(os.path.join("test_files", filename), "r") as f:
        TEST_CONTENT = (*TEST_CONTENT, f.read())


if __name__ == "__main__":
    for function in (original, changed):
        for test_str in TEST_CONTENT:
            time_taken = timeit.timeit(f"function(\"{test_str}\")", globals={"function":function}, number=RUNS_PER_TEST)
            print(f"For the function {function.__code__.co_name}() it took an average of {time_taken/RUNS_PER_TEST} for a string of length {len(test_str)} over {RUNS_PER_TEST} runs")
        print("\n\n")
```

and... immediately got an error:


```
Traceback (most recent call last):
  File "C:\Users\Kieran\Desktop\New folder (2)\ast-compare\testing.py", line 9, in <module>
    TEST_CONTENT = (*TEST_CONTENT, f.read())
                                   ~~~~~~^^
  File "C:\Program Files\Python313\Lib\encodings\cp1252.py", line 23, in decode
    return codecs.charmap_decode(input,self.errors,decoding_table)[0]
           ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d in position 698274: character maps to <undefined>
```

Whoops, forgot to ignore encoding errors, so I just update `open(os.path.join("test_files", filename), "r")` to `open(os.path.join("test_files", filename), "r", errors="replace")` and we're good to go...

```
Traceback (most recent call last):
  File "C:\Users\Kieran\Desktop\New folder (2)\ast-compare\testing.py", line 15, in <module>
    time_taken = timeit.timeit(f"function(\"{test_str}\")", globals={"function":function}, number=RUNS_PER_TEST)
  File "C:\Program Files\Python313\Lib\timeit.py", line 237, in timeit
    return Timer(stmt, setup, timer, globals).timeit(number)
           ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Program Files\Python313\Lib\timeit.py", line 125, in __init__
    compile(stmtprefix + stmt, dummy_src_name, "exec")
    ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<timeit-src>", line 2
    function("The Project Gutenberg eBook of The Divine Comedy of Dante Alighieri: The Inferno
             ^
SyntaxError: unterminated string literal (detected at line 2)
```

I forgot the timeit module doesn't clean strings. So, when it's reading the test file it needs to be multiline, and I figured I would make it a raw string to avoid any other issues (`f"function(r\"\"\"{test_str}\"\"\")"`), now we get:

```
For the function original() it took an average of 7.203333855917057e-07 for a string of length 36 over 300 runs
For the function original() it took an average of 0.011985885999941577 for a string of length 701018 over 300 runs
For the function original() it took an average of 0.020434559000035126 for a string of length 1135355 over 300 runs

For the function changed() it took an average of 8.713333712269863e-07 for a string of length 36 over 300 runs
For the function changed() it took an average of 0.012348862333456055 for a string of length 701018 over 300 runs
For the function changed() it took an average of 0.02166200099978596 for a string of length 1135355 over 300 runs
```

So, the original method is actually faster at everything? This is where we start to see the cracks in our testing. What we're doing right now is called micro-benchmarking. Essentially a small function we're testing, but because the function is so small, and we're doing so few runs (300), our data is mostly random noise. So, let's bump everything up a notch, instead of running each function for 300 runs 1 time over each test, let's run it for 100,000 times and repeat it 5 times (500,000 total runs):

```py
import timeit, os
from main import original, changed, better

RUNS_PER_TEST = 100_000
REPEATS = 5

TEST_CONTENT = ("I went to the store to get some milk",)
for filename in os.listdir("test_files"):
    with open(os.path.join("test_files", filename), "r", errors="replace") as f:
        TEST_CONTENT = (*TEST_CONTENT, f.read())


if __name__ == "__main__":
    for function in (original, changed, better):
        for test_str in TEST_CONTENT:
            times_taken = timeit.repeat(f"function(r\"\"\"{test_str}\"\"\")", globals={"function":function}, number=RUNS_PER_TEST, repeat=REPEATS)
            time_taken = sum(times_taken)/REPEATS
            print(f"For the function {function.__code__.co_name}() it took an average of {(time_taken/RUNS_PER_TEST)} for a string of length {len(test_str)} over {RUNS_PER_TEST} runs")
```

Now the question is, did you catch it? No, not in the code, in the plan. What's the problem? We're going to try to parse 2 books that after our last run would be a length of 1,836,373 500,000 times PER function. Needless to say this would take hours to run. So, instead let's cut it back to a more reasonable 1,000 iterations over 5 repeats and take the average, luckily our iterations are easy to modify:

```
For the function original() it took an average of 7.116399938240647e-07 for a string of length 36 over 1000 runs
For the function original() it took an average of 0.012160437520011329 for a string of length 701018 over 1000 runs
For the function original() it took an average of 0.02153335889999289 for a string of length 1135355 over 1000 runs

For the function changed() it took an average of 5.868799984455109e-07 for a string of length 36 over 1000 runs
For the function changed() it took an average of 0.012463741740002296 for a string of length 701018 over 1000 runs
For the function changed() it took an average of 0.02186674654001836 for a string of length 1135355 over 1000 runs
```

Now we get a better picture. For small strings the second function is faster, and for large strings it's within a reasonable margin of error. So, if we were using this function with mostly smaller strings, and the occasional book, the more readable function is better. With this test, we still don't really know why though...

## An Attempt at Improvement

I mentioned earlier a theory, that theory being that since we're constructing a list to sum in the first function, that is what's potentially making our code slow. Well, we now have a way to test that theory. Instead of summing a list, let's just sum a generator:

```py
def better(sentence:str) -> int:
    return sum(
                len(word) 
                for word in sentence.split() 
                if word.lower() not in stopwords
              )
```

We just add it to our test script and we now get:


```
For the function original() it took an average of 7.275400217622519e-07 for a string of length 36 over 1000 runs
For the function original() it took an average of 0.012006968539976516 for a string of length 701018 over 1000 runs
For the function original() it took an average of 0.021591952560003846 for a string of length 1135355 over 1000 runs

For the function changed() it took an average of 6.501800147816538e-07 for a string of length 36 over 1000 runs
For the function changed() it took an average of 0.013643119279970415 for a string of length 701018 over 1000 runs
For the function changed() it took an average of 0.023325797899998727 for a string of length 1135355 over 1000 runs

For the function better() it took an average of 1.3409199891611935e-06 for a string of length 36 over 1000 runs
For the function better() it took an average of 0.01314587348003406 for a string of length 701018 over 1000 runs
For the function better() it took an average of 0.023381438419967888 for a string of length 1135355 over 1000 runs
```

Easy way to compare changes, and as it turns out a generator is not faster here, it's about 2x slower than the other approaches for small strings. So, while this method does use less memory, the overhead of setting up the generator **seems** to be slower than the memory allocation of creating and resizing a list of strings. But, all we can say for sure is that if we want more speed, this code is not better. But we still don't necessarily know why...

## What You Should Do

Now we get to the method you should basically always use. Now we've seen the other simple options, we know we can get answers about **what** happens, but not **why**. Now, for really small functions like this we could use something like [godbolt](https://godbolt.org/) and compare the assembly, or much simpler and less error prone, we can profile the code. Profilers will run your code and tell you exactly where your code is spending the majority of it's time. Which functions, what functions they call, etc. This is the most reliable method that is less granular than assembly access, but also much simpler, and scales to larger functions. 

Python includes [profile](https://docs.python.org/3/library/profile.html) module for doing some of this testing, in general we're going to use the [cProfile](https://docs.python.org/3/library/profile.html#module-cProfile) module for our use. Our first test is too short for the built in profiler, so I modified the script to only include the larger files. Here's the code:

```py
import os, cProfile, pstats
from main import original, changed, better

TEST_CONTENT = []
for filename in os.listdir("test_files"):
    with open(os.path.join("test_files", filename), "r", errors="replace") as f:
        TEST_CONTENT = (*TEST_CONTENT, f.read())
        
if __name__ == "__main__":
    for function in (original, changed, better):
        function_name= function.__code__.co_name
        for test_str in TEST_CONTENT:
            print(f"For the function {function_name}() with input of length {len(test_str)}\n")
            cProfile.run(f'{function_name}(r\"\"\"{test_str}\"\"\")', f'{function_name}_profile.prof')
            stats = pstats.Stats(f'{function_name}_profile.prof').sort_stats(pstats.SortKey.CUMULATIVE)
            stats.print_stats(10) # Print the top 10 most time-consuming functions
            print(f"{'='*10}\n")
```

So, just like with `timeit` we basically dynamically execute the function, and in this case we're storing it to an external file. Once we do that the `pstats.Stats` object is used to parse the file, sort by cumulative running time, then print out the top 10 entries.

The output is quite long, and for some reason the setup and teardown of the profiler is included in the output. So I collapsed it below, and kept in only the dante's inferno stats but this is what we get out:

<details>
  <summary>Output</summary>

```
For the function original() with input of length 701018

Sun Feb  8 11:45:45 2026    original_profile.prof

         223680 function calls in 0.043 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.003    0.003    0.043    0.043 {built-in method builtins.exec}
        1    0.000    0.000    0.040    0.040 <string>:1(<module>)
        1    0.020    0.020    0.040    0.040 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:5(original)
   118886    0.009    0.000    0.009    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.005    0.005    0.005    0.005 {method 'split' of 'str' objects}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.sum}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}


==========

For the function changed() with input of length 701018

Sun Feb  8 11:45:45 2026    changed_profile.prof

         223679 function calls in 0.045 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.003    0.003    0.045    0.045 {built-in method builtins.exec}
        1    0.000    0.000    0.042    0.042 <string>:1(<module>)
        1    0.023    0.023    0.042    0.042 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:8(changed)
   118886    0.009    0.000    0.009    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.004    0.004    0.004    0.004 {method 'split' of 'str' objects}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}


==========

For the function better() with input of length 701018

Sun Feb  8 11:45:45 2026    better_profile.prof

         328469 function calls in 0.056 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.003    0.003    0.056    0.056 {built-in method builtins.exec}
        1    0.000    0.000    0.053    0.053 <string>:1(<module>)
        1    0.000    0.000    0.053    0.053 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:33(better)
        1    0.007    0.007    0.049    0.049 {built-in method builtins.sum}
   104789    0.027    0.000    0.042    0.000 C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:34(<genexpr>)
   118886    0.010    0.000    0.010    0.000 {method 'lower' of 'str' objects}
   104788    0.005    0.000    0.005    0.000 {built-in method builtins.len}
        1    0.004    0.004    0.004    0.004 {method 'split' of 'str' objects}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}

```

</details>

Here's what matters for how to read this. In our case we're going to keep it simple and look at the `ncalls` (number of times function was called) and `cumtime` (the cumulative time run) columns, as well as the very last column, which tells us what's running. So, If I look at our new table for `better()` it would be:


```
ncalls  cumtime   filename:lineno(function)
...
     1   0.053     C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:33(better)
     1   0.049     {built-in method builtins.sum}
104789   0.042     C:\Users\Kieran\Desktop\New folder (2)\ast-compare\main.py:34(<genexpr>)
...
```

Which we can then translate to "english" below:


| Times Called | Cumulative Run time | What Ran | 
|--------------|---------------------|----------|
| 1 | 0.053  | `main.better()` |
| 1 | 0.049  | `sum()` | 
| 104789 | 0.042 | `<genexpr>` | 

As you go you should read top to bottom. You'll notice the times get smaller as you go, this is because `better()` is what calls `sum()` which is what runs `<genexpr>`, so the cumulative time of `<genexpr>` is part of the time of `sum()` which is part of the time of `better()`.

![icicle graph of the profile](/tech/blog/performance-is-hard/manual-profile.png)

So, while it initially looks like `sum()` is the culprit, actually most of the time `sum()` is just waiting on the generator to give it the next number. The chart I created above goes by various names (flamechart, icicle chart, etc.), there's a bunch of modules that exist in the python world to create these for you, for example this is the output of [snakeviz](https://jiffyclub.github.io/snakeviz/) when I ran it on the file we made for the `better()` function:

![snakeviz visualization of better](/tech/blog/performance-is-hard/snakeviz.png)

## Advice

So, profiling provides us with both the **what** and **why**, which is something microbenchmarks cannot. Sometimes you may want to step down to the bytecode/assembly level once you actually **know** what's causing the slowdown, but it's often not necessary. As was probably apparent in this article, microbenchmarks can be handy to get a vauge idea of **speed comparissons**, but they won't help you determine **why** one's faster than another, or how to improve your fastest option. If you've never ran a profiler before I would recommend running it on some slow-running code, and knowing **why** it's slow.

## Additional Reading

UPDATE Feb 9th: As I was reading a few articles today I came across 2 that are pretty topical to this post around optimization and teting, I will add more as they come up

- [I got paid minimum wage to solve an impossible problem](https://tiespetersen.substack.com/p/i-got-paid-minimum-wage-to-solve)
- [Performance Hints](https://abseil.io/fast/hints.html)
- [napkin-math; Techniques and numbers for estimating system's performance from first-principles](https://github.com/sirupsen/napkin-math)
- [Software Performance Engineering: The Ideas I Keep Coming Back To](https://ricomariani.medium.com/software-performance-engineering-the-ideas-i-keep-coming-back-to-6f421b6a9505)
