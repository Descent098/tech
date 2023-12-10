---
title: HHTTPPP; Creating a CLI
subtitle: Making our system more usable
description: "Allowing users to interface with our HTTP server more easily! HHTTPP; Writing your own HTTP server Part 5/5"
pubDate: 2023-10-02T00:00:00-06:00
modified_date: ""
heroImage: /astro-redesign/blog/hhttpp/hero.jpg
crosspostURL: https://schulichignite.com/blog/hhttpp/creating-the-cli/
tags:
  - python
  - scorch
  - web
  - theory
---

Now that we have our functionality, it's time to make our program more practical and easy to use. For our use case a CLI is the best tool for this!

A CLI or command line interface is a program you use by calling it from a terminal in a directory. If you're not familiar with how to use the command line very effectively, here's some resources I would recommend:

- [Terminal basics (slideshow)](https://kieranwood.ca/terminal-basics/#slide=1)
- [How to use the Command Line | Terminal Basics for Beginners (MacOS | Video)](https://www.youtube.com/watch?v=5XgBd6rjuDQ)
- [Windows Command Line Tutorial - 1 - Introduction to the Command Prompt (Video)](https://www.youtube.com/watch?v=MBBWVgE0ewk&list=PL6gx4Cwl9DGDV6SnbINlVUd0o2xT4JbMu)
- [Windows PowerShell/Command Line for Beginners (Video)](https://www.youtube.com/watch?v=FpRGRLI8Fy8)


## Why?

In our case creating a GUI (Graphical User Interface), is mostly going to be slower. Our users are primarily going to be devs and/or tech savy people we expect to know how to use a command line, and a CLI will be faster for what we need. 

Here are some of the main reasons we're creating a CLI at all instead of just making people run the script from the python file:

1. It allows you to pass arguments/flags in an easy manner
2. It can be invoked from the command line; There's no need to keep a file in every directory you want to use it in
3. It allows you to seperate your more common usage into an easy to use CLI, while allowing an API to exist for more complicated functionality or use cases
4. It can be used in other scripts/CI/CD easily since people just need to run it from the command line

So let's learn about how to setup CLI's!

## Arugment parsing

A CLI allows you to pass in flags/arguments, these flags/arguments are like funciton parameters, but they're provided by the user before the program starts. This lets users for example choose to run an app in different modes, or pass in information like an output directory for the output of a program etc.

As such the only real "processing" a CLI does besides just running existing code is argument parsing. Argument parsing is basically taking what someone types into the terminal and parsing it into usable data. The most basic way of doing this is `sys.argv`. `sys.argv` is the way that information is passed into your program from [stdin](https://www.computerhope.com/jargon/s/stdin.htm). For example if I run `python hhttpp.py -h`, then I can run:

```python
import sys

print(sys.argv) # ['hhttpp.py', '-h']
```

You can see that everything after `python` (which is the command) will be added to `sys.argv` as a list item. We could use this to for example have the first argument be a directory, and the second argument to be a port. For example if I ran `python hhttpp.py /site 8338` then `sys.argv` would be `['hhttpp.py', '/site', '8338']`. We could then use these arguments to instantiate a `Server` object, and then start it with `Server.start_server`!

### Docopt

`sys.argv` is great for very simple things, however for more flexibility we need something more robust. There are tons of argument parsers, but there are few that are as fast to develop with as [docopt](http://docopt.org/). It has a bit of a learning curve, but once you are aware of the patterns it is very fast to write. Docopt will generate your argument parsing automatically based on your usage string.

#### Usage strings

A usage string is the "help" text that appears for commands. For example a project I wrote called [ahd](https://github.com/Descent098/ahd) has this usage string:

```bash
AHD: Ad-hoc Dispatcher

Usage: 
    ahd [-h] [-v]
    ahd list [-l]
    ahd docs [-a] [-o]
    ahd config [-e] [-i CONFIG_FILE_PATH]
    ahd register <name> [<command>] [<paths>]
    ahd <name> [<command>] [<paths>] [-d]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
    -l, --long            Shows all commands in configuration with paths and commands
    -a, --api             shows the local API docs
    -o, --offline         shows the local User docs instead of live ones
    -e, --export          exports the configuration file
    -i CONFIG_FILE_PATH, --import CONFIG_FILE_PATH 
                        imports the configuration file
    -d, --details         prints the details of a command
```

Each line under the `Usage` header is a different possible pattern. For example `ahd list` would use the pattern on line 2, `ahd config -e` would use line 4. Anything inside square parenthesis (`[]`) are optional arguments/flags/variables. For everything else you can find details [here](http://docopt.org/). Anything with a `-` is a flag, typically these are used as a boolean where if they're specified they're true, and if not they're false. They also each have a long and short version (i.e. `-e` and `--export` are the same flags). Any flag that has text after it (i.e. `-i CONFIG_FILE_PATH`) allows you to store values for flags, so in this case you can type something like `--import="/file/config.yaml"`.

Let's put together a quick usage string. Here is the basic format I would always use:

```bash
<CLI_name>: <Short Description>

Usage: 
    <CLI_name> [-h] [-v]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
```

From here we can start building out a CLI. In our case we can will start by building a usage string for a math CLI (called `math`) that can be used to do various math operations. So with our template we can start with:

```bash
Math: Doing mathy things

Usage: 
    math [-h] [-v]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
```

From here we will have the following functionality:

| Command | Arguments/flags | Description |
|---------|-----------------|-------------|
| multiply | x and y both ints | Multiplies `x * y` |
| divide | x and y both ints | Divides `x / y` |
| idivide | x and y both ints | Divides `x / y` and rounds down to nearest integer |
| sqrt | x which is an int | Takes square root of x |
| pi | l an optional int for how many decimal places to show pi to (default 6) | Show digits of pi to `l` digits |

Let's build out the new usage string:

```bash
Math: Doing mathy things

Usage: 
    math [-h] [-v]
    math multiply <x> <y>
    math divide <x> <y>
    math idivide <x> <y>
    math sqrt <x>
    math pi [-l]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
    -l, --length          The number of digits of pi you want
```

Here are the functions we want to call with the CLI:

```python
def multiply(x:int, y:int) -> Union[int, float]:
    return x * y

def divide(x:int, y:int) -> Union[int, float]:
    return x / y

def idivide(x:int, y:int) -> Union[int, float]:
    return x // y

def sqrt(x:int) -> float:
    return x**.5

def pi(length:int = 6) -> Union[int, float]:
    PI = 3.141592653589793238462643
    return float(str(PI)[:length])
```

#### Docopt basics

For most other argument parsers you build the parser ([Like optparse objects](https://docs.python.org/3/library/optparse.html), or [argparse objects](https://docs.python.org/3/library/argparse.html) ), and at the end it generates usage text when people pass in `-h` or `--help`. 

Docopt does the opposite, you define your usage string and it **builds the parser for you**. This is handy because it means that for lots of simple CLI's you can build out the parser in seconds by just writing a usage string. The steps are:

1. Define a usage string
2. Pass the usage string into a docopt method
3. Docopt will parse the usage string, and the values passed in, which will be put into a dictionary you can interface with

With our math example we can do something like this:


```python
from typing import Union

from docopt import docopt

usage = """Math: Doing mathy things

Usage: 
    math [-h] [-v]
    math multiply <x> <y>
    math divide <x> <y>
    math idivide <x> <y>
    math sqrt <x>
    math pi [-l]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
    -l, --length          The number of digits of pi you want
"""


def multiply(x:int, y:int) -> Union[int, float]:
    return x * y

def divide(x:int, y:int) -> Union[int, float]:
    return x / y

def idivide(x:int, y:int) -> Union[int, float]:
    return x // y

def sqrt(x:int) -> float:
    return x**.5

def pi(length:int = 6) -> Union[int, float]:
    PI = 3.141592653589793238462643
    return float(str(PI)[:length])

args = docopt(usage, version="0.1.0")

print(args)
```

So in our case if we called the CLI with `math multiply 3 4` we would get:

```python
args == {
    '--help': False,
    '--length': False,
    '--version': False,
    '<x>': '3',
    '<y>': '4',
    'divide': False,
    'idivide': False,
    'multiply': True,
    'pi': False,
    'sqrt': False
}
```

We can call `math -h` to get our usage string, the same way we would if we built our parser from scratch. From here to implement multiply we could do:

```python
from typing import Union

from docopt import docopt

usage = """Math: Doing mathy things

Usage: 
    math [-h] [-v]
    math multiply <x> <y>
    math divide <x> <y>
    math idivide <x> <y>
    math sqrt <x>
    math pi [-l]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
    -l, --length          The number of digits of pi you want
"""


def multiply(x:int, y:int) -> Union[int, float]:
    return x * y

def divide(x:int, y:int) -> Union[int, float]:
    return x / y

def idivide(x:int, y:int) -> Union[int, float]:
    return x // y

def sqrt(x:int) -> float:
    return x**.5

def pi(length:int = 6) -> Union[int, float]:
    PI = 3.141592653589793238462643
    return float(str(PI)[:length])

args = docopt(usage, version="0.1.0")

print(args)

if args["multiply"]:
    print(multiply(int(args["<x>"]), int(args["<y>"])))
```

You will notice that **all arguments come in as strings** (besides flags which are booleans), so you need to explicitly convert to other data types like int/float. So implementing all our functionality would look something like this:

```python
from typing import Union

from docopt import docopt

usage = """Math: Doing mathy things

Usage: 
    math [-h] [-v]
    math multiply <x> <y>
    math divide <x> <y>
    math idivide <x> <y>
    math sqrt <x>
    math pi [-l DIGITS]

Options:
    -h, --help            show this help message and exit
    -v, --version         show program's version number and exit
    -l DIGITS, --length DIGITS
                          The number of digits of pi you want
"""

def multiply(x:int, y:int) -> Union[int, float]:
    return x * y

def divide(x:int, y:int) -> Union[int, float]:
    return x / y

def idivide(x:int, y:int) -> Union[int, float]:
    return x // y

def sqrt(x:int) -> float:
    return x**.5

def pi(length:int = 6) -> Union[int, float]:
    PI = 3.141592653589793238462643
    return float(str(PI)[:length])

args = docopt(usage, version="0.1.0")

if args["<x>"]:
    args["<x>"] = int(args["<x>"])
if args["<y>"]:
    args["<y>"] = int(args["<y>"])
if args["--length"]:
    args["--length"] = int(args["--length"])
else:
    args["--length"] = 6

if args["multiply"]:
    print(multiply(args["<x>"], args["<y>"]))
if args["divide"]:
    print(divide(args["<x>"], args["<y>"]))
if args["idivide"]:
    print(idivide(args["<x>"], args["<y>"]))
if args["sqrt"]:
    print(sqrt(args["<x>"]))
if args["pi"]:
    print(pi(args["--length"]))
```

We can test this without installing the cli, if the file is called `docopt_testing.py` then we can run something like `python docopt_testing.py pi --length=15`.

#### When to use docopt and when not to

Docopt is great, and some extra features it grants you without extra config are:

- Another issues docopt solves is ordering, you can 
- Invalid states will just print the usage string to the command line so people know they made a mistake
- People can check version they have installed easily with `-v`

You do have to learn how to read usage strings, but you **should** do that anyways since ou need to learn how to read usage strings to use other people's projects. If you already have these skills you should already know the rules for writing the parser!

Docopt is a great option for argument parsing, but it has it's drawbacks:

- You must have access to install libraries which is not always possible
- You are introducing a third party library and all it's bugs
- in very very simple cases it's more effort to write a usage string than just use `sys.argv`

## Our setup

For HHTTPP we will be using the following usage string:

```bash
hhttpp

Free range artisnal HTTP server

Usage:
    hhttpp [-h] [-v] [-p PORT] [-f PROXY_FOLDER]

Options:
    -h, --help            Show this help message and exit
    -v, --version         Show program's version number and exit
    -p PORT, --port PORT  The port to start the server on
    -f PROXY_FOLDER, --folder PROXY_FOLDER
                          Lets you specify a folder to proxy instead of cwd
```

So in this case we have the option to get the version, or help. From there we have 2 optional positional arguments. `-p`/`--port` and `f`/`--folder`, the reason these are not optional variables is because with optional variables **ORDER MATTERS**. Meaning if people wanted to specify a folder they would have to speficy a port, which I didn't want. In our code we provide sensible defaults, so someone can offer both, or neither of the `-p` or `-f` flags, people can also skip the `-h`, or `-v` flags completely.

From here the argument parsing looks like this:

```python 
# Python Standard Library dependencies
import os                           # Used to validate paths
import socket                       # Used to validate ports
from random import randint          # Provides a random integer between a range

# Internal Dependencies
from hhttpp import __version__      # Get the current hhttpp version
from hhttpp.classes import Server   # Used to instantiate hhttpp Server's

# Third Party Dependencies
from docopt import docopt           # Used for argument parsing

usage = """hhttpp

Free range artisnal HTTP server

Usage: 
    hhttpp [-h] [-v] [-p PORT] [-f PROXY_FOLDER]

Options:
    -h, --help            Show this help message and exit
    -v, --version         Show program's version number and exit
    -p PORT, --port PORT  The port to start the server on 
    -f PROXY_FOLDER, --folder PROXY_FOLDER 
                          Lets you specify a folder to proxy instead of cwd
"""

def main():
    # This will be the primary entrypoint for the CLI
    args = docopt(usage, version=__version__) # Will be used in later post to do CLI parsing

    # Specify default port and folder if none is provided
    port = 8338
    folder = "."

    # Override defaults if valid alternative was provided
    if args["--port"]:
        port = int(args["--port"])
    if args["--folder"]:
        if not os.path.exists(args["--folder"]):
            raise ValueError(f"Folder path {args['--folder']} does not exist")
        folder = args["--folder"]

    # Attempt to assign requested port, retry on failure
    valid_port = False
    while not valid_port:
        # Check if port is open 
        port_testing_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        destination = ("127.0.0.1", port)
        result = port_testing_socket.connect_ex(destination)

        if not result: # Port is taken, assign new random one
            new_port = randint(1_000,10_000)
            print(f"Could not connect to port {port} trying other port {new_port}")
            port = new_port
            port_testing_socket.close()
        else: # Current port is valid
            print(f"Valid port found: {port}")
            valid_port = True
            port_testing_socket.close()
    
    # Start server with specified values!
    Server(folder, port=port).start_server()
```

## Other final touches

Now we have a CLI there's a few extras we can work on to improve our CLI:

- Documenting the CLI and usage in something like a `readme.md`, or if it's really complicated a dedicated site to using the system can be handy (like [this project](https://ezcv.readthedocs.io/en/latest/cli/) I wrote). Not having a readme or some other documentation makes it really hard for people to use your project (things that seem obvious to you aren't obvious to everyone). 
- Documenting API usage for people who want to use it programatically. For example if people want to be able to extend your project, or pass argumetns themselves directly etc. (an example would be [the api docs](https://kieranwood.ca/ezcv/) for the same project from earlier)