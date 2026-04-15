---
title: My First Foray Into Rust
subtitle: Legacy support for a nouveau language
description: The good, the bad, and the painful
pubDate: 2026-04-15
heroImage: /tech/blog/first-foray-into-rust.png
tags:
  - open-source
  - legal
  - opinion
  - rust
  - personal
---

I have, like many people been watching rust from the sidelines for a few years. I briefly messed around with it, but I've never bothered to really do anything with it. I recently came upon a really nice utility called [drill](https://github.com/fcsonline/drill) that I was excited to start using for a project. It's essentially a CLI for doing HTTP load-testing. I usually like to use [locust](https://locust.io/), but I ran into a ton of issues with windows, and performance. So, I gave it a try and... it was dead. I will have another post in the future about the project specifically, but long story short, I decided to hard fork it into a new utility called [floodr](https://kieranwood.ca/floodr/). But this article will be about my experience working with rust in an existing codebase as one of my first real bits of experience with the language.

It's worth noting that this is my **first** foray, so there might be known solutions to some of these issues. If you're looking to invest time in rust I would look to someone more well-versed in the language for their opinions. This is mostly just how I feel about the language after the tens of hours I've spent with it.

## The Types

The type system in rust is very robust. In particular `Result` types and the pattern matching that comes with them, is fantastic. Here is a snippet from the floodr docs with an example. The [`floodr::parsing::checker::compare`](https://kieranwood.ca/floodr/api-ref/floodr/parsing/checker/fn.compare.html) function takes in information about a current run, a file to compare to, and a threshold of how many miliseconds to consider a regression:

```rust
let current_run = vec![
    vec![
        floodr::actions::Report {
            name: "Fetch account".to_string(),
            duration: 115.0,
            status: 200,
        },
    ]
];
 
let result = floodr::parsing::checker::compare(&current_run, "example/rep.yml", &3.to_string());
 
match result {
    Ok(_) => println!("No values above threshold"),
    Err(count) => println!("{} Values over threshold", count) // "1 Values over threshold" would print
};
```

In this case a non-error state can still be considered error-ish. So, if the count actually exists then you know one of the values exceeded the threshold in this case. This means my `match` statement doesn't need to know, or care what threshold was set, just that it was exceeded. But with this expressiveness comes some issues you can see in the same example. 

There are **SO MANY TYPES** and they overlap in weird and annoying ways. In the above example in order to pass a string representation into my function I'm using `&3.to_string()`, not the worst thing in the world, I'm converting to a string, then borrowing. But, if we look futher up `"Fetch account".to_string()`, why do I need to convert a string to a string? Well, because the first string isn't a string, it's a `String`, or maybe a `str`, admittedly I never figured out the difference, I just kept doing different variations until the compiler was happy for all my examples. Another weird one was [`floodr::parsing::reader::read_csv_file_as_yml`](https://kieranwood.ca/floodr/api-ref/floodr/parsing/reader/fn.read_csv_file_as_yml.html), which took a character to represent what you used to escape your cells in a CSV, but as a `u8`. It took me about 30 minutes to finally get:

```rust
let quote_char = "'".to_string().into_bytes()[0];

let user_data = floodr::parsing::reader::read_csv_file_as_yml("example/fixtures/users.csv", quote_char);
println!("{:?}", user_data);
 
// [
//     Mapping {
//         "id": String("2"),
//         "name": String("John")
//     }, 
//     Mapping {
//         "id": String("3"), 
//         "name": String("Mary")
//     }
// ]
```

About %90 of my time was spent just doing random type dances to get things to work. Granted this is probably less of an issue in new projects where you can just make your types align with what API's you're using, but when the stars don't align, boy do they miss by a lot.

## The tooling

`cargo` is fantastic, as is `rustup`. Being able to easily swap language versions made updating an entire edition of rust a single line change. Likewise the included documentation tooling is amazing. `cargo doc` just builds a site, and you have full docs... or in theory. For some reason `cargo doc` has no `index.html` even when using a binary output. This means I had to do a bunch of [cobbling together](https://github.com/Descent098/floodr/blob/main/.github/workflows/docs.yml) of my two documentation systems (astro and `cargo doc`) to get things to work. Rust is **very** opinionated, and when the opinions are not in your favor, be prepared to do something hacky. That being said I would take the tooling in rust over basically any other language. go is a close second, and better in other ways, like race condition checking being built in, and a better standard library. 

## The Libraries and Ecosystem

USE SEMVAR PROPERLY. For the love of God, the number of broken packages that had backwards-incompatability on minor version numbers was astounding. For anyone unaware semvar is the most common versioning used and it uses a `major.minor.patch` syntax. So, major versions have **breaking** changes, minor versions have new features, and patch is for bug fixes. Updating a minor or patch **should not break anything**.

I had to update `clap` from v2 -> v4 and I expected (and there were) tons of breaking changes. I had to update `rand` from version `0.8.0` -> `0.10.0` and every function in the project no longer existed. A few others also did this and it was infuriating. Rust is "popular" but not when compared to javascript or python. If someone breaks compatability in a package in js or python I can rely on someone posting about it somewhere, and being able to find the info I need. For rust, I spent ages to find out that `rand::thread_rng()` was renamed to `rand::rng()`. That's it, that's all I had to change, but it took me ages to find that out. Likewise `reqwuest` had breaking changes on `0.12.0`-> `0.13.0`. If you want to do this just drop the first number, clearly you're not using it anyways. Just call it `reqwest 13.0` and `rand 10.0` or just use the first number please. 

Likewise [crates.io](https://crates.io/crates/floodr) is nice, but a bit annoying you can only use github. I'm looking to move off it to my own git forge soon, but I'll need to keep my account alive specifically for crates.io and go's packaging system. 

This all being said rust does have a good ecosystem, just a bit small, which is a good and bad thing. Most core utilities are there, though while on the subject having to install a random number generator, and JSON/YAML deserializer from a crate instead of one being in the standard library is questionable. The YAML system used for `serde` that allows reading YAML files is actually deprecated, but it still seems to be the best option, so I left it in there. 

## The distribution

Rust **does not have cross-platform builds**. People need to stop lying about this. This was a big reason I was interested in the language in the first place, and I've realized it's just absolutely **not true**. I tried both on windows and ubuntu to cross compile for:

- MacOS ARM for m1-m5 macs (`aarch64-apple-darwin`)
- MacOS x86 for intel macs (`x86_64-apple-darwin`)
- Windows x86 (`x86_64-pc-windows-msvc`)
- armv7 for raspberry pi (`armv7-unknown-linux-gnueabihf`)
- x86 linux (`x86_64-unknown-linux-gnu`)
- Arm 64 linux (`arch64-unknown-linux-gnu`)

Basically for windows and mac you need dedicated machines to do it properly. None of the toolchains worked, I installed `zig`, setup gcc, msvc, and god knows what else, and ran through:

- `rustup` (`rustup target add <target>`) + `cargo build --target <target>`
- [`cargo zigbuild`](https://github.com/rust-cross/cargo-zigbuild)
- [`cross`](https://github.com/cross-rs/cross)

All of them failed outside the platform they were running on. So, I landed on another [hacky CI script](https://github.com/Descent098/floodr/blob/main/.github/workflows/building.yml) that runs on dedicated VM's for each. 

Likewise [crates.io](https://crates.io) is nice, but also a bit odd. For example it:

- has weird restrictions like only allowing 5 tags for your project
- Requires github login and linking for a project
  - It also is entirely it's own custom login system and token linking that just uses OAuth or something similar
- Requires you to have **no unstaged or committed changes**

## The Finale

I like rust. Even more now than I did (in theory) before. I think that there's a good focus on performance, and reliability in ways that matter. They do need some better guidence on building and distribution (or I needed a better way to find it). Likewise, there's definitely still some rough edges and opinions, but it's a language I could see myself writing a lot of performance-critical code in. I think I have landed on where it fits into my current roster. My current go-to tools are:

- `python` for scripts, ETL, and situations where performance is irrelevant
- `javascript` when the tooling is benefitial in the browser, or  **primarily** when I'm doing content-driven work with [astro](https://astro.build)
- `go` for general purpose code, especially networking and microservice tasks

and now rust for high performance projects.
