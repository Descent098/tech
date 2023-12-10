---
title: "Intro to VCS's"
subtitle: "How to version software"
description: "How to create versions for your software. Intro to VCS Part 1/4"
pubDate: 2023-10-16T00:00:00-06:00
modified_date: ""
heroImage: /astro-redesign/blog/vcs/hero.jpg
crosspostURL: https://schulichignite.com/blog/vcs/intro-to-vcs-systems/
tags:
  - theory
  - vcs
  - project-management
  - open-source
  - computer-science
  - terminology
  - software-engineering
---

Things change fast, and keeping track of those changes is not an easy task. Version control systems are built to help manage versions of software, and software changes. 

This comes up in a ton of places, but the most common you will see is a different "version" of software for new features in a project:

![](/blog/vcs/vs-code.png)

We see this happen in many major projects, but why do people do this? and how? This series will try to answer these questions and more!

## Why have versions?

What's the point in having different versions released for software? I think it's best to start with an old project I worked on and explain why versions mattered for it!

### Story time

When I was younger I loved to mod games. Specifically I used to do what's called ROM hacking. This is where you take an older game and add mods into the game. In this case I had decided to make a new story mode for an old gameboy game. The tools at the time for doing this were not great (and all in italian, which I don't speak or read).

So with the help of google translate I started getting to work. But multiple times along the way I ended up breaking the game to where it would no longer load, and I would have to start over from scratch. At some point I got annoyed with this, and I decided that every day I would copy the folder with the files I was working on, and keep a backup of the files from each day!

![](/blog/vcs/jank-vcs.png)

So now when I broke things I had a "checkpoint" I could go back to so I wouldn't have to start from scratch after crashes!

### A better way

So this is copying of folders is the simplest (and least robust) form of version control system. It presents several benefits, but realistically the main advantage with VCS systems is that it allows you to manage versions efficiently while being able to **easily revert back to old revisions**. Which you may want to do for several reasons including:

- Old versions work better for older systems
- New versions break/remove functionality
- People prefer how old systems operate (Photoshop)

It also means for developers that if a feature is breaking something once you release it, you have the ability to go back to a working state from before instead of having to scramble to solve the issue!

## Types of versions

Most of the time people think of versions as being something that starts at a low number, and goes up as you add features to the software ([semantic versioning](https://semver.org/) is an example). There are several different naming systems and ways these work:

- Adobe CC 2018, 2019, 2020, 2021 etc.
- IOS 7, 7.1, 7.2, 7.3, 8, 9, 10 etc.
- Python 2.7, 3.0.0, 3.1.0-alpha, 3.1.1-alpha, 3.1.2-beta, 3.1.0, 3.2.0-alpha, 3.2.1-beta, 3.2.2-beta, 3.2.0 etc.
- Android KitKat, Lollipop, Marshmallow etc.
- etc.

But VCS systems do not only allow you to manage versions that are chronological. There are tons of different types of versions you might want to have. For example it might be split by OS where you might have different code for windows vs macos vs linux vs android etc (like [vs code](https://code.visualstudio.com/Download)). 

![](/blog/vcs/vs-code-platforms.png)

They can also help you maintain a whole new version/flavour of a project. Let's take for example a project that on version 2.0 it drops support for windows XP. Someone then takes the code and decides to manage another version of the software (a "compatibilty" version) that intends to maintain all backwards compatability. You can then release versions of "normal" and "compatibility" separate:

<pre class="mermaid" style="background: #141414">
%%{init: { 'theme':'dark','gitGraph': {'showBranches': true,'showCommitLabel': false}} }%%
gitGraph:
    commit
    branch v1.9
    checkout v1.9
    commit
    commit
    checkout main
    merge v1.9
    commit
    branch v2.0
    checkout v2.0
    commit
    commit
    checkout main
    merge v2.0
    commit
    branch v2.1
    branch compatability
    checkout compatability
    commit
    checkout v2.1
    commit
    checkout compatability
    commit
    checkout v2.1
    commit
    checkout compatability
    commit
    checkout main
    merge v2.1
    commit
    checkout compatability
    commit
    commit
    checkout main
    branch v2.2
    checkout v2.2
    commit
    checkout compatability
    commit
    commit
    checkout v2.2
    commit
</pre>

Each of those versions also might then also have semantic versioning for their releases (i.e. normal version 2.1 releasing while compatibility version 1.3.4 releases). You will find this often happens with a more "configurable" version of software, and a "performance" version. All of these are valid ways of versioning a project, and can prove invaluable to a development team.

## Conclusion

We saw my version of version control, but there are a ton of issues with it including:

- Using up a ton of space because we're duplicating files for every folder
- No way to relate what features correspond to which days
- No way to revert **portions** of each days code easily (i.e. need to remove 1 feature but keep rest of changes)
- No easy way to maintain non-chronological versions alongside normal versions
- No easy way to collaborate and have others able to work on large features simultaneously


In the next article we will look at [git](https://git-scm.com) the most popular version control system, and the system that will solve the issues above!
