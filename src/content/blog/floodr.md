---
title: Floodr
subtitle: a HTTP load testing system designed to be lightweight, fast, and highly configurable
description: Rebuilding a great load-testing library
pubDate: 2026-04-20
heroImage: /tech/blog/floodr/hero.png
tags:
  - open-source
  - rust
  - personal
  - floodr
---

I am in the middle of writing a high performance caching layer to help offset some of the issues I am facing with a large CMS site. I [wrote about this previously](./usage-aware-caching), but as part of that system I needed to do some load testing. My typical tool of choice is [locust](https://locust.io), which is an amazing project. Unfortunately, as time has gone on locust has built up some weird issues for me. In particular I develop on windows (yes throw the tomatoes), and the concurrency system does not work well because of it. I tried using docker for doing some testing instead, but that created even more headaches, so I decided to look elsewhere. I'm not going to fully re-tread all my decisions up until this point, I did so in more detail [another post](./fear-of-forking#drill). The short story is I decided to fork a tool I liked, and turn it into [floodr](https://kieranwood.ca/floodr/). Here's a quick demo to give you an idea:

<script src="https://asciinema.org/a/NfDR2EDUYkyH57aO.js" id="asciicast-NfDR2EDUYkyH57aO" async="true"></script>

In this post I wanted to talk about my approach of making the fork, and give reasons for some of my choices as I went. The majority of the changes were bug-fixes, version bumps, and documentation. The tool itself was good, but it was held back largely by a handful of bugs that the fixes weren't merged in yet. In total I ended up making ~60 commits, mostly found in [this pr](https://github.com/Descent098/floodr/pull/1) (<span style="color:green">+15,528</span>  <span style="color:red">-1,370</span>).

## The Early Days

Initially I had planned on keeping the fork free of breaking changes. This meant that I decided to just fix the main issues I ran into which was a panic if a [request exceeded 3.6 seconds](https://github.com/fcsonline/drill/commit/6d7f15cd0dc4a02b94ce57b3566b279983220fba), and an annoying openSSL dependency that was [resolved with a version update](https://github.com/fcsonline/drill/commit/f9760deb80c859c33677ea2f9aa589abb598c81e). These two changes I commited upstream in [a pr](https://github.com/fcsonline/drill/pull/223).

After sleeping on it I decided to keep fixing more issues like a [bug in a regex](https://github.com/fcsonline/drill/commit/e06837d69b248f8e10f474b5fcd18c1735289704), and added a test to avoid it in the future. I then began [updating all dependencies](https://github.com/fcsonline/drill/commit/052d63daeb77ab648e4175fb007cbe08aa0af2f5) making sure to test against a baseline setup I had to check for performance degredations. Since this system is going to **be the measuring tool** I had to make sure the performance was not a bottleneck. I then [setup the documentation site](https://github.com/fcsonline/drill/commit/f370e864fe3ae67f45b60ba7f9afd66c3cba90da), and began plugging away at [docstrings](https://github.com/fcsonline/drill/commit/f731fd6d179e967a7272707f3c5c30a2e59fe77a). 

I have never used rust before this, and I mentioned [my thoughts on the language in another post](./fist-foray-into-rust), but one interesting thing is that your docstring examples **are tests**. Unless otherwise specified the examples are run every time you run `cargo test`. This is similar to an old package called [doctest](https://docs.python.org/3/library/doctest.html) in python, but it has some interesting side effects. Because each example has to actually work my first examples with the library were very sketchy, and I ended up just adding `ignore` flags to them, which visually shows a warning in the api docs:

![api docs when ignore is set](/tech/blog/floodr/doctest-ignore.png)

This is actually a great pattern. It means that you know when looking at an example that it will **actually run**, something you often can't rely on. The main argument against this pattern I've heard from people was that in the python community many people began using it as their main form of testing. This meant the documentation would be littered with thinly veiled excuses for covering edge cases in a test suite with statements like "and if you decided to include a falsy flag here, and a true for this, with these 5 other options, you get this!". I think this concern is a small price to pay, and these days I would air on the side of more testing over less, especially in open source.

## The Middle

After a while I gave up on maintaining backwards compatability and decided to make **whatever changes I wanted**, breaking or not. I decided to [restructure the whole project into all modules](https://github.com/fcsonline/drill/commit/956df7d7b50dcbd4aac23791227874fd74a0df39) except the `main.rs` (cli) and `lib.rs` (library file). This made the project much easier for me to reason about as I went on. 

When I did my [initial batch of dependency updates](https://github.com/fcsonline/drill/commit/052d63daeb77ab648e4175fb007cbe08aa0af2f5), I basically only did the low-hanging fruit. Everything that was going to take effort I left until later. Then, unfortunately later came. The main culprit was the command line parser [clap](https://crates.io/crates/clap), which required an overhaul to a [slightly different syntax](https://github.com/fcsonline/drill/commit/d432f9bc9c8107a4fba791c36c70d6336ba7157f). I couldn't understand why people liked this library, then I spent more than 2 seconds reading and found out...

In the transition from v2-v4 somewhere along the way they created a lovely syntax that is **declarative** for the parsing. When [I switched over to it](https://github.com/fcsonline/drill/commit/ab3727fe22e68783129428fce7366dfeb73fe375) it was clear to me why people liked the project now. Having written many CLI's, the way the clap system works is very slick. I will steal a short snippet to illustrate:

```rust 
use clap::{crate_version, Parser};

#[derive(Parser, Debug)]
#[command(
  name = "floodr",
  version = crate_version!(),
  about = "A configurable, simple rust-based HTTP load testing system",
  long_about = None,
)]
struct Cli {
  /// Benchmark file to run
  #[arg(default_value = "benchmark.yaml")]
  benchmark: String,

  /// Shows request statistics
  #[arg(short = 's', long = "stats", conflicts_with = "compare")]
  stats: bool,

  ... // More code
}

impl Cli {
  fn run(self) -> process::ExitCode {
    ... // More code

    return process::ExitCode::SUCCESS;
  }
}

fn main() -> process::ExitCode {
  return Cli::parse().run();
}

```

Once you know the basics of rust, this reads very nicely. You have a CLI struct with your arguments and flags, you add a run method to the implementation of it that returns a success or error code at the end, and in your `main.rs` you run the CLI's inherited `parse()` method, and then `run()` with the parsed values. Everything you need to know about the CLI is right here, and done so elegantly. The comment above each value, it becomes the help text, you can specify conflicts directly, no need to handle them in your own way later. Compare this with the old way:

```rust
use std::process;
use clap::{Arg, ArgAction, ArgMatches, Command, crate_version};

/// Configure and parse command line arguments for the application.
///
/// This uses the `clap` crate to define the CLI interface, including options for
/// benchmarks, reports, statistics, and tags.
///
/// # Returns
///
/// - `clap::ArgMatches<'a>` - The parsed command line arguments.
pub fn app_args() -> ArgMatches {
  Command::new("floodr")
    .version(crate_version!())
    .about("HTTP load testing application written in Rust inspired by Ansible syntax")
    .arg(
      Arg::new("benchmark")
        .help("Sets the benchmark file")
        .required(false)
        .default_value("benchmark.yaml"),
    )
    .arg(
      Arg::new("stats")
        .short('s')
        .long("stats")
        .help("Shows request statistics")
        .action(ArgAction::SetTrue)
        .conflicts_with("compare"),
    )
    ... // 12 other options
    .get_matches()
}

pub fn main(){
    let matches = floodr::app_args();
    let benchmark_file = matches.get_one::<String>("benchmark").unwrap().as_str();
    let report_path_option = Some(matches.get_one::<String>("report").unwrap().as_str());
    let stats_option = matches.contains_id("stats");
    ... // 12 more options to deserialize

    ... // more code

    return process::exit(0)
}
```

Not even close, the new way is much nicer, and so much easier to read. You probably couldn't tell but `benchmark` and `stats` are not the same. With all the extra syntax it's easy to miss, but `benchmark` is a positional argument, where `stats` is a flag (`--stats`, or `-s`). This is an oddity of clap itself that everything is called an argument, but because there's less boilerplate in the initial code, it's a bit easier to see IMO. The new system is 1 struct, 1 run function instead of 2 functions with 14-17 function calls each. It also made choices like [removing flags](https://github.com/fcsonline/drill/commit/6e02009e6f58906b0cd1dfb57a2e2116fa6262f0), and [changing flags to subcommands](https://github.com/fcsonline/drill/commit/3256d948a7c1b4918b3e3ef7ac1cedb3064b610a) much easier. On that note, here is what the added code for having a subcommand looks like:

```rust
use clap::{crate_version, Parser, Subcommand};


#[derive(Subcommand, Debug)]
enum Commands {
  /// Compares current execution metrics against a previous benchmark report
  Compare {
    /// Baseline report file to compare against
    report_file: String,
    /// Threshold value in milliseconds
    threshold: String,
  },
}


#[derive(Parser, Debug)]
#[command(
  name = "floodr",
  version = crate_version!(),
  about = "A configurable, simple rust-based HTTP load testing system",
  long_about = None,
)]
struct Cli {
  /// Benchmark file to run
  #[arg(default_value = "benchmark.yaml")]
  benchmark: String,

  /// Shows request statistics
  #[arg(short = 's', long = "stats", conflicts_with = "compare")]
  stats: bool,
  
  /// Subcommand to execute
  #[command(subcommand)]
  command: Option<Commands>,

  ... // More code
}

```

That's it. If I want to add new sub-commands I just add another field to the `Commands` enum, and clap will figure out the rest. The eventual result is the new CLI:

```bash
$>floodr help
A configurable, simple rust-based HTTP load testing system

Usage: floodr [OPTIONS] [BENCHMARK] [COMMAND]

Commands:
  compare  Compares current execution metrics against a previous benchmark report
  reports  Writes benchmark results to a report file
  help     Print this message or the help of the given subcommand(s)

Arguments:
  [BENCHMARK]  Benchmark file to run [default: benchmark.yml]

Options:
  -s, --stats                              Shows request statistics
      --no-check-certificate               Disables SSL certification check. (Not recommended)
      --tags <TAGS>                        Tags to include
      --skip-tags <SKIP_TAGS>              Tags to exclude
      --list-tags                          List all benchmark tags
      --list-tasks                         List benchmark tasks (executes --tags/--skip-tags filter)
  -q, --quiet                              Disables output
      --request-timeout <REQUEST_TIMEOUT>  Set timeout in seconds for a request
  -v, --verbose                            Toggle verbose output
      --exec-terminal <EXEC_TERMINAL>      Set the terminal to run exec commands with
  -h, --help                               Print help
  -V, --version                            Print version
```

Not everything I did at this point was just messing with the CLI though, I also fixed some [weird bugs, that tuned out to be missing features](https://github.com/fcsonline/drill/commit/a310725da3bcd055d449fceb45b4150ef0057675), and enhanced various features like the [comparison feature](https://github.com/fcsonline/drill/commit/2982b15812d3f6b386bedd4c89baccd4075d808b) and the [delay](https://github.com/fcsonline/drill/commit/ee030cb2907e306b02e3b6b62b7d41a7926e5702) feature. One recurring issue is **units**. The libraries under the hood like [reqwest](https://docs.rs/reqwest/latest/reqwest/) give you nanosecond precision, but not necessarily accuracy. Operating systems often can't guarentee this, so the library on top of the OS can't either. Because of this I standardized everything I could on `milliseconds` since it's the most commonly used value for web dev anyways. 

## The End

The final slog was having to make my own examples. It took hours of my time to figure out what the code was doing because most features had single, sometimes broken examples. In fact most of my fixes for bugs came from re-writing examples and realizing the feature was broken. After writing all the library documentation and remainder of the user docs it was on to polish. 

Rust has a really interesting tool called [`clippy`](https://doc.rust-lang.org/cargo/commands/cargo-clippy.html) it's essentially a CLI for telling you best practices in your rust code. I went through and [fixed up all those warnings](https://github.com/fcsonline/drill/commit/7cf474552ed643534c0e13d8203e8dd7dcebd12f), and began the slog of fixing the docstrings. 

You see, I made a deal with the devil earlier. To try to help learn the codebase I asked google antigravity to give me docstring tests. The problem was, basically all of them were wrong. Rust is probably the single worst performing language I've seen AI work with. Of the 18 or so examples it generated, 3 were sort of valid, everything else I ended up having to do from scratch (I eventually replaced the 3 also). That meant firing up a separate test project, and messing with examples to make sure they worked. This lead to various commits for [each](https://github.com/fcsonline/drill/commit/347ee1cf93939a6a472eac74fa27bb19ce4db224), [individual](https://github.com/fcsonline/drill/commit/f60d1eaa1ec34d5f9ea1e2f02c47a9908b10a07f), [module](https://github.com/fcsonline/drill/commit/5b1a5011502cb9a3661f8a5fd279e659a4534dae).

With the code and docs done it was time to revitalize the CI. This was where I learned I had been lied to. Rust **does not have cross-platform builds**. It looks like it does, people say it does, but it doesn't. After screwing with it for far too long AI finally paid me back for being useless with the code and managed to make a [CI file](https://github.com/fcsonline/drill/commit/83f1eea530b5b1ac16c2fa0966ad57b0273b2251) that builds my binaries for me. It breaks for windows... but I don't care because I've got one of those on hand. 

With my binaries built, I had one last task a docker image. Getting locust to work with docker was a pain, so I wanted to deal with that for my future self ahead of time. So, I setup a dockerfile, built it, threw it in a test compose setup, and it worked great. Then I had to deploy it to github's container registry. I took [one look at the docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), decided I've learned enough these last few weeks, and it was AI time again. I stuck my build files I created in the project, asked one of the AI's (I forget which) to give me a github workflow I could probably find online if I searched for it, and [voila](https://github.com/fcsonline/drill/commit/0917f00033b4b2f237702af79015eb4d062eefe1#diff-f7dba7ba2acdd5f1e3108e789cd859fbccdf6c3d145ce92b405e0614f4b3ea25). 

What AI lacks in competency at coding, it made up for in the abilty to copy-paste other people's CI/CD pipelines for me. 

There was a bunch of fiddling around with the [weird documentation pipeline](https://github.com/fcsonline/drill/blob/ae4d69014ddfb4bdeb5fc915a0711bb0dfe5e14a/.github/workflows/docs.yml) I wrote. The built in `cargo doc` is great, but there's no `index.html`, so I had to build the astro site, build the doc site, then copy-paste them into a directory structure, and create my links in the user docs site to files that would hopefully be there at build time... Yeah, I screwed this up a bunch. Github actions is suprisingly finicky compared to when I used it last, particularly around weirdness with using `bun` instead of (or I guess in conjunction with) `node`. So, javascript also managed to ruin my experience with rust, impressive. Anyways, I made my final small changes, [put the project up on crates.io](https://crates.io/crates/floodr), [deployed the doc site](https://kieranwood.ca/floodr/), and [made the first release](https://github.com/Descent098/floodr/releases/tag/0.10.0).

## The future

There are a bunch of improvements I would still like to make. Many of which are just cleaning up the tooling and maintenance burden of the project, but on top of that I have some ideas for new features.

### Direct Invocation

I love the idea of a `yaml` plan to do tests with, but also it would be nice for simple one-off tests to be able to just specify a route or set of routes, a time frame, and the concurrency to run with. Something like:

```bash
floodr run <duration> <routes> --base <base> --concurrency <concurrency>
```

So, to run for 30 seconds hitting `/` and `/api/counter` with `30` threads you could do:

```bash
floodr run 30 "/,/api/counter" --base http://localhost:4896 --concurrency 30 
```


### Improved Reporting

Currently reports are only used for [comparisons](https://kieranwood.ca/floodr/cli/comparisons/), it would be nice down the road to also allow for export to PDF's as an actual report that people can then distribute when drafting an analysis of a system.

### TUI

Again, I like `yaml`, but the ability to interactively run a session would also save a lot of the edit->save->run->edit->save->run looping that happens when setting up tests. Ideally the TUI should interactively allow you to:

1. Build out a benchmark plan
2. Run benchmarks as little sessions you can flip back and forth between
3. Export the plan
4. Export reports after runs have happened

A mockup would be something like this:

![tui mockup](/tech/blog/floodr/tui.png)

I'm currently looking into [ratatui](https://ratatui.rs/) as an option for building this out, it's reminiscent of the [charm libraries](https://charm.land/) in go which I love.

### Web interface

This is more vauge of an idea, but it would be nice in the future to be able to run floodr as a web service. The main advantage of this is in environments like docker where instead of having to setup a benchmark file, mess with it, re-run or rebuild a container on every run, then copy out the files, you could just have a persistent server. That persistent server would allow you to configure runs, and could even act as a historical record of previous runs in situations where that information is useful. This is pretty similar to what [locust](https://locust.io/) offers, but it would be nice to take things further.

Things like suggested benchmark times for different types of pages, warnings about page weights, etc. Essentially more of a site health testing suite. This may end up being a separate project that just utilizes floodr down the road since I don't want people who just need a quick load testing tool to have to download an additional massive web server. I have also heard of the cargo [features](https://doc.rust-lang.org/cargo/reference/features.html) system, which lets you pick what you include, so maybe it's a good candidate for that as well.

### Architectural Overhaul

Both the TUI and web interface would require a large architectural overhaul as currently the system just does it's iterations, builds all the data into a vector and returns it. To facilitate the various features I want I would need to have some sort of iterable that yields values. I don't know the rust equivalent yet, but you can imagine it being similar to something like this in python:

```python
class Result: # Represents the result of an action taken
    name: str
    status: int
    duration: float
    ... # Other fields

class Action:
    name: str
    ... # Other fields
    
    def execute() -> Result:
        """Does the action"""

def run_iterataion(plan:list[Action]) -> Generator[Result]:
    for item in plan:
        yield item.execute()
```

When using `run_iteration()` we can then lazily pick off values as they become available. Ideally we would also want some sort of cancellable context to kill the run mid-flight if we need to.

## Fin

All in all it was at least 20 hours of work (probably more) over about 10 days. Mostly done in spurts of a few hours at a time, after a day or two of no-lifing it. I just finished a C++ course, which ironically made learning rust much easier, and gave me a new appreciation for it. It's basically c++++ (for me at least). As I've been using the project more I've noticed some other problems that I need to fix. There also seem to be some issues that are common across all the load-testing frameworks I've tried, which suggests I will have some more deep-dives on here in the future as to why. I can't wait to keep building this project and see where it ends up. If you want to try it out [here's the repo](https://github.com/Descent098/floodr). If you're familiar with rust I would love some feedback on the project, and contributions are welcome if you're interested!
