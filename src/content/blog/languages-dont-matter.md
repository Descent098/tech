---
title: Languages Don't Matter in the Beginning
subtitle: Just pick your first language and get on with it
description: What actually matters in the beginning
pubDate: 2025-05-27
modified_date: 2025-05-27T00:00:00-06:00
heroImage: /tech/blog/modern-python/hero.png
tags:
  - java
  - python
---

When I was in my second year of university I was in computer science, but I began a teaching program surrounded by mostly software engineers. At some universities they don't bother making the distinction, but the important distinction at my university was languages. Computer scientists started by learning python, and software engineers learned Java (processing, which at the time ran on Java). We were originally teaching Java because of this, and then later the engineering program switched to python so we updated our course as well. One of the things that came up a bunch during this transition was that "python is too slow, we're setting people up for failure". 

It's no secret that python is a slow language, but at this point I had been working with it **a lot** and had experienced some of my own python projects being significantly faster than my peers Java code. When I brought this up, the response I got was something to the effect of "I don't believe you", so naturally I challenged the person to a drag race. 

## Summing

`Write a program that generates 100,000 random numbers (between 0-10,000), sums them, and prints the results`

That was the challenge, and I won. I re-ran the tests with similar approaches we both took to help re-make the same point I was making. I used [`hyperfine`](https://github.com/sharkdp/hyperfine) to benchmark:

```bash
hyperfine --runs 10 "python test.py"
Benchmark 1: python test.py
  Time (mean ± σ):      55.6 ms ±   2.2 ms    [User: 6.2 ms, System: 0.0 ms]
  Range (min … max):    53.7 ms …  60.0 ms    10 runs


hyperfine --runs 10 "java Test"
Benchmark 1: java Test
  Time (mean ± σ):      77.7 ms ±   7.0 ms    [User: 0.0 ms, System: 6.2 ms]
  Range (min … max):    72.0 ms …  87.7 ms    10 runs
```

Here's the code for each:

```python
import random

values = (random.randint(0,10_000) for _ in range(100_000))

print(sum(values))
```

```java
import java.util.Random;

public class Test{
    public static void main(String[] args) {
        int[] numbers = new int[100_000];

        Random random = new Random();
        for (int i = 0; i < 100_000; i++) {
            numbers[i] = random.nextInt(10_001); // 0 to 10,000 inclusive
        }
        int sum = 0;
        for (int num:numbers){
            sum += num;
        }
        System.out.println(sum);
    }
}
```

There are 2 key differences that gave us the results. In java it first creates an `Array`, adds all the numbers, then sums them. The python version instead yields the values directly from a `Generator`. If you don't know what those words mean, that's great, let's get deeper into it.

The Java version if we break it apart is:

1. Creating a object (Array) of 100_000 items
2. For i in range 100_000
   1. Generate a random number
   2. Try to add a number to the list
3. Create a `sum` int object starting at 0
4. Iterate through every entry of the list
   1. Add the current value at a given index to the result
5. Display the result

The python version instead:

1. Setup a generator to be used later
2. Consume the generator allocating a single integer at a time
3. Display the result

So compared to the java version, the python version only ever has 2 integers in memory, the one for the sum, and the one for the current integer. In java we instead have at least 100_001 integers, the 1 for the sum, and the 100_000 random numbers. 

## Caching

Another example of something similar was talking to someone about caches. The challenge being:

`Make a function that returns the fibonacci sequence of a number n`

Here were the results:

```bash
hyperfine --runs 10 "python round_2.py"
Benchmark 1: python round_2.py
  Time (mean ± σ):      28.8 ms ±   1.2 ms    [User: 6.1 ms, System: 4.7 ms]
  Range (min … max):    27.2 ms …  30.4 ms    10 runs


hyperfine --runs 10 "java round2"
Benchmark 1: java round2
  Time (mean ± σ):     29.823 s ±  0.599 s    [User: 29.151 s, System: 0.014 s]
  Range (min … max):   28.127 s … 30.111 s    10 runs

  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs. It might help to use the '--warmup' or '--prepare' options.
```

It's easy to miss but python is running in ms, where Java is running in seconds. Meaning java is ~1000x slower.

The Java code was:

`round2.java`
```java
public class round2 {
    static int fib(int n){
        if (n<2){
            return 1;
        }
        return fib(n-2) + fib(n-1);
    }
    public static void main(String[] args) {
        System.out.println(fib(50));
    }
}
```

and in python:

`round_2.py`
```python
from functools import lru_cache

@lru_cache
def fib(n):
    if n <2:
        return 1
    return fib(n-2) + fib(n-1)

print(fib(50))
```

So why is python faster? Because it's computing the results once. Java has to repeat steps over and over again where python can re-use old values if they're the same input. This is called [memoization](https://kieranwood.ca/compsci/Programming/Caching), and it's a common way to speed up repeat


## Get to the point

The point with these annecdotes is that python is still a slow language, but that often doesn't matter, **understanding theory does**. If you know how to cache, or how to avoid creating new objects, or the importance of memory allocations etc. etc. You will basically always write faster code than people in whatever other language. One of my courses in university was taking C++ code that on average ran 5-10x slower than the provided python code, and speeding it up to being **on par** with python. If we take a language like Java vs Python, you're looking at a performance increase of 4-10x, maybe more or less in some cases. That's great, but if you know how to cache recursive lookups, you're looking at 1000x speedups. In a [real world library](https://github.com/Descent098/speyl) I worked on the other day an algorithm change sped up the code ~670x. In other words, knowing some basic theory can make **the entirety** of the difference. So, if you're just starting out, pick whatever language feels best, and just start learning.

## When Languages Matter

So never use Java then? No, well maybe, that's up to you. The point of this post is that people focus so much on choosing a language and often miss the forrest for the trees. If you don't know how to program a language **won't save you**. Learning to program takes time and effort, and which language you choose to learn the essentials is irrelevent. There are a few topics in computer science that when you're aware of them can completely change the code you write. The approach will almost always make the biggest difference.

That being said when you're talking about very specific problems, particularly when you're running out of optimizations you know, it's worth looking into other languages. For example, it is possible to write games in python, but for large 3D AAA games you need a language with better performance characteristics. This is because for games you need sub-milisecond latency to maintain framerates. That being said you can also only use those languages properly if you understand the theory necessary to write them.

Additionally, if you do end up with a successful service, or software there is always the option to upgrade incrementally, or rewrite when you understand the domain better. Often there are a handful of operations that take up most of your runtime when you first start out, and optimizing those small areas makes a world of difference. Additionally you can often find more exotic solutions to improving performance. Most machine learning systems for example use [numpy](https://numpy.org/), which is actually a C library that interfaces with python. These approaches exist in tons of languages ([V8 with JS](https://v8.dev/), [FFI](https://stackoverflow.com/questions/5440968/understand-foreign-function-interface-ffi-and-language-binding), etc.). 

## Conclusions

So, stop procrastinating by reading arguments online about which language to start learning, and just start learning one. If the simplicity of python feels good, do that, if you like the idea of using C, great, if you like Java, go for it. If you end up habitually running into issues, identify the problems in your approach and improve. When you think you have a good reason to, start adding other languages to your toolbelt. I've started doing this recently and it's great, but starting with python was also probably the best choice I made.
