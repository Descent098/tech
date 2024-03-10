---
title: Plan Your F@$king Projects
creation_date: 2023-12-12T00:00:00-06:00
subtitle: "Getting things done"
description: "How to plan your projects effectively and get them completed"
pubDate: 2024-03-08T00:00:00-06:00
heroImage: /tech/blog/plan-your-projects.png
tags: 
    - opinion
    - open-source
    - teaching
---
Many people want to improve their coding skills, and one great way to do this is side projects. When I first started programming my first side project was a github repository where whenever I did something I thought was hard in python I just added it to the repo, put a docstring on it, and left it there. This project ended up splitting into two projects:

- [kusu](https://github.com/Descent098/kusu) (Kieran's useful script utilities): The original spirit of the project with a bunch of randomly organized "helper functions" to do things I thought were hard. As of December 2023 it has just less than 10k downloads [^1]
- [kuws](https://github.com/Descent098/kuws) (Kieran's useful web scripts): Same idea initially as kusu except I eventually turned it into a collection of scripts and a cli with options to access the important parts via an api. This package got incredibly popular and garnered shy of 30k downloads [^2]. 

These two projects were literally just a hobbled together collection of functions from random tasks I needed to do. Some of them were needed for uni projects, some of them for work stuff, some of them for automation at home. All in all they both totaled less than 500 lines of source code. I first started kusu shortly after I learned what a class was, and it shows. One of my functions in the project was[^3]:

```python
def save_to_json(data, file_path = str(os.getcwd()), file_name = "config.json"):
    """Takes two parameters:
    data: JSON formatted data (Dictionary and/or class instance with vars(<instance>))
    file_path: A string representation of the path to output config.json to
    """
    import json
    # TODO: Check for right extension in file_name
    with open(os.path.join(file_path, file_name), 'w') as write_file:
        json.dump(data, write_file)

```

Or another useful classic [^4]:

```python
import os


def clear_terminal():
    """
    Clears Terminal"""
    if os.name=='nt': #Windows
        os.system('cls')

    else:
        os.system('clear')
```

When I wrote this code it was about as good as I could do. Programming entails a lot of skills you end up learning all at once, and a lot of these functions were like a "reference guide" for me to remember some of it. My background before programming was in hardware building and repairing computers, and helping my friend do one-off contracts setting up servers (mostly just installing programs and configuring settings for him). Even for me with a bit of a background, making a "useable" package has so many things besides just the code to learn, and this is what I learned with these two projects. 

Over the time I wrote them both outside of the actual code I wrote (and coding concepts like basic networking, design patterns etc.) I learned how to do:

- Self-documenting API's (with [pdoc3](https://pdoc3.github.io/pdoc/))
- CI/CD (with [nox](https://nox.thea.codes/en/stable/), [Github Actions](https://github.com/features/actions), and [deepsource](https://deepsource.com/))
- testing frameworks (with [pytest](https://docs.pytest.org/en/7.4.x/))
- licensing essentials
- python package development (for [pypa](https://www.pypa.io/en/latest/)/[pypi](https://pypi.org/)/[pip](https://pypi.org/project/pip/))
- User documentation ([mkdocs](https://www.mkdocs.org/), [sphinx](https://www.sphinx-doc.org/en/master/))
- argument parsing (initially [argparse](https://docs.python.org/3/library/argparse.html), but eventually [docopt](http://docopt.org/))
- dozens of [standard libs](https://docs.python.org/3/library/index.html) in python
- etc.

This mostly came out of a challenge I set for myself to make 1 github contribution a day. With this I obviously couldn't just code every day on these small projects, so I learned about project management and opened issues for planning things I wanted to do. Then I came back to a project months later and had no idea what was happening, and neither did people who looked at my code, so I started adding documentation (user facing and internal). Once I had done some projects I needed reliable ways of distributing and maintaining them, so I learned testing, CI/CD to run the tests on a schedule, and package management + distribution. Each thing I learned solved a problem for me, and was not just for the sake of it.

These skills have made every other project I've done much easier, and made my projects much easier to maintain over time (though many have been neglected, but gimme a break I have a lot of them). I would argue these have honestly been more useful than A lot of my actual programming knowledge for my particular career path so far (because I change languages and environments so often), but that won't be the case for many people. Learning to problem solve my issues, then categorizing the solutions into a "knowledge repository" for referencing has been incredibly helpful. It forces you to think not just about the code your writing, but what the actual point of your code is, how it fits into your broader knowledge, and practice creating more "generalized" solutions that are more flexible.

There are definitely some mistakes, and I probably would've suggested to a younger me that I flag the project in the readme for what it was more clearly (experiments and semi-working solutions), but overall I would recommend doing something like this for yourself. But the interesting question is, what did I do to actually start all this instead of being stuck in tutorial hell[^11]? There are two things, the first is that I learned about code, not to code. Focus on concepts when you're learning, and understand that languages are built on the concepts not the syntax. Even if you're in JS or python you should know about data types, and understand type coercion etc. Know the things the language is doing for you, and learn about coding in concept, not just in practice. The second pertains to building the sorts of projects that keep you interested over time.

## The most Important Skill(s)
I would never have completed a single larger project if I didn't start planning before I started coding...

**Wait**, before you run away, just hear me out. I'm not here to tell you to "be more organized". That's way too broad. There are a few direct actions you can take at the start of a project that can help make it easier to complete.

### Dogfood is delicious
It's very hard to get inside other people's minds. It's even harder to do this well. The term dogfooding refers to the practice of creating projects that you will use yourself. There are tons of reasons to do this, but the main ones are:

- It will keep you engaged since you get something out of it
- You get the chance to find out problems in a real use case
- You solve your own problems with your code

Dogfooding your own problems is the way I came to write [ahd](https://github.com/Descent098/ahd), and [ezcv](https://github.com/Descent098/ezcv). Having your own problems, and writing them down makes planning what you need easy. Writing software is hard across multiple dimensions, some technical, but some are more soft skills. Designing something without an end in mind will result in a cluttered mess. But if you have a guiding principle (like what you think solves your problem) it becomes easy to remove some of the complexities, and focus more on the technical.

By the way the name comes from a guy who tested dogfood on his own dogs to improve it[^14].

### Define your project
When you are starting your project there are a few questions you need to ask (especially if you're going to make it open source[^12]). There's a common issue people run into called the blank canvas problem [^13].  People call it different things, but essentially the principle is that when you have to many options it can become paralyzing to do anything. I was a 3d artist for years and opening a fresh file with a vague idea of a concept almost never got me to a result. Usually I would have to challenge myself to do something with a specific tool, or specific method, or else the blank file would stay blank forever.

When you are programming a project the idea is ephemeral. There are infinite numbers of ways to tackle most problems, so you need to make some decisions and use them as rules to help guide you. This is much more philosophical than technical, but it will save you a ton of time in the long run. Here are a few examples of questions you should have answers for:

- Who am I building the app for? 
	- If you're [dogfooding](#dogfood-is-delicious), then the audience is you
	- If you're building for others, then ask them what they want in an app like this
- Why am I building it?
	- Practice
	- Money
	- Jokes[^15]
- What should it do?
	- Necessary features
	- Should it be extensible?
		- Can people write plugins for it?
	- Challenges
		- Features that are hard, but interesting to implement
- How will I achieve this
	- Pick a technology (or a few)
		- Unless the goal is to learn a technology don't be married to this, but also don't change it so often you make no progress
- When should I have a working version by?
	- What is a reasonable timeframe and hold yourself accountable to it
	- What do I need for an mvp (see [here](#break-projects-up-properly))

Once you've made these choices it gets much easier to move ahead with development.

#### Example

One of my most popular projects I've ever written is a projects called [ahd](https://github.com/Descent098/ahd). Between kuws/kusu and ahd I had written a few other projects [^5] [^6] [^7] [^8] [^9] [^10], but this was one of my first "larger" projects when I wrote it (still >1000 lines of code), and was a project that solidified a lot of my current habits. I had experimented and failed at writing a few other projects (unfortunately most I deleted ☹️ ), but for each of those projects there were small annoying pieces that I had to learn (how to write a readme, how to add scripts to your system path, how to have user documentation etc.). I ended up chucking all of these learnings into a template [^6] I could reuse. With that template starting new projects felt much easier, and all of this came together to help me write [ahd](https://github.com/Descent098/ahd). 

I ended up trying to learn linux in my first year of coding, and at the time I ended up having way too many devices I was working on (Desktop [dual boot], laptop [tri boot],  1 macbook for testing at work [was working a support desk for university websites] 3 remote linux servers, and 2 windows ones). 

As you can imagine I was hopping around **A LOT**. With that I needed ways to automate what I wanted to do, so on each machine I had a folder of scripts with a bunch of shell/batch scripts to do the same commands so I didn't have to remember them all. This was **a trash system**.

Not only was it hard to manage, but there were constantly issues with being out of sync configs. So I wanted a system where I could have 1 config, take it with me to different machines with a bunch of "functions" defined, and run those commands. This was the main purpose, and I was the main audience for it!

#### Break projects up properly

Pick a reasonable MVP (minimum viable product); Strip your project down to the bare basics you want. At most this should be 3-5 **simple** features. If it takes more than a sentence to describe, it's not a simple feature. 

For ahd it was:

- Ability to register a new command
- Ability to specify the command to run
- Ability to specify the location(s) to run the command in
- Have commands store to a configuration file using configparser

You'll notice that this first version doesn't actually solve a lot of my problems. I still can't run it across operating systems, and there's some annoyances like having to do a list of paths. Even though I knew these were problems these were the features I cut myself off with on v0.1.0, why? 

A few reasons:

1. I had planned version 2, and once I release v0.1.0 there's nothing stopping me from doing v0.2.0 right away, but finishing 0.1.0 means I could have tapped out then if I got busy without guilt. 
2. Version 0.2.0 is exciting because it's still fresh, and because it (and 0.3.0) had plans I would always have something to look forward to myself for each release
3. Sometimes you have to just have a "done" point. Being able to be finished means that when there are particularly rough features you only have a few things  to do before you can consider it "done for now"


I was excited when I started ahd (actually have a vod of building it in one go [here](https://www.youtube.com/watch?v=yZ2gEVUZO-w)), but even with excitement life can get in the way. Having a 0.1.0 means having a "checkpoint". If I only completed version 0.1.0, got busy and then came back in a year I would still have everything ready to go to dive back in. The re-entry into the project is seamless, and ditching it after v0.1.0 was *inconsequential*. I ended up ripping through v0.2.0 **but I didn't have to**. There was enough functionality to be useful enough for me to start using it and solving problems.

## Other tips
Here are some other tips about building out projects that didn't fit elsewhere.
### Tutorials are useless
Being someone who writes tutorials this one hurts to write, but it's also true. There are tons of problems with tutorials including:

- They focus on just doing a thing and rarely on why
- They're often specific to a given framework/technology
- The debugging that would require you to actually learn and research is done for you and avoided for brevity

Fundamentally these issues occur because a lot of them are driven by wanting clicks, which means the incentive is to give you something quick and fast that feels good. As such any actual learning is incidental and not necessary to the success of a tutorial in the creators eyes. This misalignment means that most tutorials you complete will be completely useless unless you just so happened to already want to **only** do **exactly** what they're teaching. 

Tutorials themselves **can** be handy in a few possible ways:

1. You use them to kickstart a project; Instead of following a tutorial exactly use the tutorial to build something you want. For example if it's a Django tutorial about building a blog use the information they give you to build a fitness app instead of following 1:1. This means you **must actively engage** with the content, and understand it to complete the work.
2. They teach a concept that happens to have a project attached; This tends to be the type of "tutorials" I write. For example instead of teaching people how to use an existing HTTP framework for networking I wrote a series implementing a simple one myself [here](https://kieranwood.ca/tech/blog/series-introduction/)

Tutorials can be a handy way to kickstart something, but they're not an end in themselves, or "actual development". They are a tool that when utilized well can help kickstart certain projects and do the actual development. One last point on this note is that no one is an expert when they first start building. Lots of people stick to tutorials to feel better about their lack of knowledge and feel a superficial sense of progress. If you don't have experience, you wont have knowledge, **and that's fine**. You build knowledge over time, but if you rely on others to do the thinking for you, then you will never gain it in the first place. Get lost in a project, and if it's irrecoverable then start over. I've had to do this dozens of times throwing out hundreds of hours of work. 

### Care about finishing
The reality is with most side projects it doesn't actually matter if you finish a version or not. No one's going to fire you, you aren't going to fail a course, and it's unlikely someone will castigate you for it. The worst part of not finishing a project comes in what surrounds not finishing a project. I teach programming courses and so I am exposed to many developers as they're getting started. Tons of them learn a little about programming, get really excited, pick out a project, then fail on feature 2 of 25. I can anecdotally think of at least 15 people who had this issue.

The problem with this isn't that someone failed (can actually be a good learning opportunity), the problem is people's perception of failure. When you set your standards astronomically high and fail then people see no reason to try again. It's one thing to fail meeting a deadline barely, but being 6 months off feels awful. That anxiety sticks around and people start feeling like they **can't** succeed. Especially with new programmers I find that the first 1-3 projects set a lot of the tone for what sort of programmers people want to be. Getting people to dial it back, finish a few versions, get into the swing and go from there is effective at making people want to continue. So treat **some** of your projects like real work, and finish them. This way you know what it's like to fully finish a project, and you have something to be proud of at the end.

## Conclusion
This was a long article to say that project work is great. It can give you a lot of knowledge, can solve your real problems, and make you more confident. Do what you can to finish projects, and don't be afraid to move on after a few versions/iterations of a project. Good luck!

[^1]: [kusu download stats (pepy.tech)](https://www.pepy.tech/projects/kusu)
[^2]: [kuws download stats (pepy.tech)](https://www.pepy.tech/projects/kuws)
[^3]: [Descent098/kusu@4508b39 (github.com)](https://github.com/Descent098/kusu/commit/4508b39a47cea8a3fb6f246fc0f910d8c22ab293#diff-4f8ececffaac8b0b4acdcb7a1b3d54298390b89932789bdf249fcd871150c3daR76-R84)
[^4]: [Descent098/kusu@4508b39 (github.com)](https://github.com/Descent098/kusu/commit/4508b39a47cea8a3fb6f246fc0f910d8c22ab293#diff-4f8ececffaac8b0b4acdcb7a1b3d54298390b89932789bdf249fcd871150c3daR1-R11)
[^5]: [Descent098/pystall: A system to automate installation and configuration of resources. (github.com)](https://github.com/descent098/pystall)
[^6]: [canadian-coding/python-package-template: Easy to use template for great PyPi packages (github.com)](https://github.com/canadian-coding/python-package-template)
[^7]: [QU-UP/KiStFl: Quick Start Flask (github.com)](https://github.com/QU-UP/KiStFl)
[^8]: [Descent098/FOLI-U: Personal Fork of CPSC 233 Group Project (github.com)](https://github.com/Descent098/FOLI-U)
[^9]: [Descent098/python-web-utilities: TODO: Integrate into SWS (github.com)](https://github.com/Descent098/python-web-utilities)
[^10]: [Descent098/Flask-Heroku: A quick and dirty setup of a Flask app, designed to be hosted on Heroku (github.com)](https://github.com/Descent098/Flask-Heroku)
[^11]: [What is Tutorial Hell? - And how to avoid it to Improve as a Developer | CodeX (medium.com)](https://medium.com/codex/what-is-tutorial-hell-and-how-to-avoid-it-to-improve-as-a-developer-8c5376c97011)
[^12]: [What is open source? | Opensource.com](https://opensource.com/resources/what-open-source)
[^13]: [Blank Canvas Paralysis | The Modern Nomad](https://www.themodernnomad.com/blank-canvas-paralysis/)
[^14]: [Eating Your Own Dog Food (computer.org)](https://www.computer.org/csdl/magazine/so/2006/03/s3005/13rRUygBwg0)
[^15]: [Descent098/otp_emoji: Used to generate 🙊 one-time pads 🤐 exclusively in emojis. (github.com)](https://github.com/Descent098/otp_emoji)