---
title: Building a Good Github profile
subtitle: Building your street cred
description: "Now we have a github profile it's time to make it worth visiting! Intro to VCS Part 4/4"
pubDate: 2023-11-06T00:00:00-06:00
heroImage: /astro-redesign/blog/vcs/hero.jpg
crosspostURL: https://schulichignite.com/blog/vcs/building-a-good-github-profile/
tags:
  - theory
  - vcs
  - project-management
  - open-source
  - computer-science
  - terminology
  - software-engineering
  - legal
---

So, you've signed up for github, but your profile looks incredibly bland. How do you go about improving it? Why bother?

## Why?

Most people think of github as just social media for developers. I understand why (and would disagree), but if we are going to use this analogy then it's social media that serves a different purpose to others. A github profile can often be used as a point of reputation. While it seems like reputation might not matter it can play a big role in several things including hiring practices, and even the willingness for some communities to allow you to contribute.

The reason for this is simple, talk is cheap. Your github profile lets you show off the work you have done, and as such **shows**, not tells what you can do. Anyone can say they know how to write a website, but if your code is up online you can **prove** you can write a website. Anyone can say they built projects while in university, anyone who puts them on github can **prove** they made projects.

I have had several oppurtunities come my way directly because of [my github profile](https://github.com/descent098), and today I wanted to talk about how to build a better github profile!

## Extra work

One thing I want to mention before we get into this. This article assumes you **want** to work on projects that aren't school/work related. Most jobs will not allow you to post your work for them on github (but some do!). If this is your approach then some of the information in this article will be helpful, but most of it will be useless.

It is not a requirement that you do work on projects on your own time to be a good developer, however it is definitely something that makes you more hireable down the road. That being said there is a potentially maladaptive culture that exists in some development spaces that try to pressure people into working themselves to the bone, don't do this. 

You **do not have to be contributing to projects every day** for this advice to be useful, and for your account to be helpful towards your job prospects. If you make 2-3 projects a year the advice is still helpful. Scale the amount of work you want to do to what's healthy for you, and try to avoid burning yourself out! Likewise these are suggestions, you don't have to implement them all, or even implement them all the time for every project!

## Using your account

This might seem obvious but the first step to building a good github profile is using your github account. The contribution graph on the homepage is often what shows who works on software, and who just talks about software:

![](/blog/vcs/contrib-graph.png)

I don't want this to just be platitudes, so let's talk about ways you can start using your account you may not have considered:

- Put your side projects on github; Lots of people write projects separately from github, or don't use git at all. Building out a github profile is a great excuse to learn git, and demonstrates you know how to use it to potential employers. Likewise even your small side projects demonstrate you are actively trying to improve
- **Don't do experimentation in the dark**; One of the easiest ways to improve your contributions is to have a repo for your experimenting ([here's mine](https://github.com/Descent098/projects-experiments)). Whether it be an interesting package/module you want to mess around with, or just testing out a technique having an experimentation repo can be great for showing off your creativity, demonstrating you code regularly, and **having snippets of code for you to reference back to**. One of [my most popular packages](https://github.com/Descent098/sdu) started this way ([so did this one](https://github.com/Descent098/sws))

### Planning boards

It is common in software development to do [kanban boards](https://en.wikipedia.org/wiki/Kanban_board), basically it's software that lets you break up tasks into "tickets". You can then place these tickets in todo, and are able to see what you need to work on, while having columns for in-progress and done, so you can see what you're working on now, and what you've finished:

![](/blog/vcs/kanban-board.png)

Planning your project is handy for a few reasons. But the main one is that if you are someone who picks up projects then wants to put them down for a while breaking things up into project boards helps you step in and out of a project. All your ideas about how to proceed and what to do when you pick it back up are stored for you!

### Picking good projects

Picking good projects get easier the more projects you do. The hardest thing is often getting started. Dogfooding is the idea that you write software you intend to use. Maybe you just started working out, and instead of just using an existing app you can write your own to track your progress. Maybe you want to automate a tedious aspect of your job. Whatever it is do something you at least **could** use. This will help with motivation initially, and generally you should aim to pick projects that challenge you, but don't feel insermountable. One way to address this is with versions.

It all comes back around, but in seriousness write down all the features you want in an app. Pick 2 or three that matter, and set a deadline for yourself to complete version 0.1.0 by. With version 0.1.0 just being those few features you picked, and maybe a few small things. 

For me one of my first projects was [ahd](https://github.com/Descent098/ahd/) I had the idea for it. At the time I was doing lots of server maintenance and spending time in the command line. I wanted something that made it easy to register my commonly used commands and run them when I wanted. So I thought about what I wanted, and I gave myself a week to create:

- A Cli that let you register commands that would run
- An interface to run those commands
- A config file to check the current state of the app

If I go back to look at the release for version 0.1.0, I can see [here](https://github.com/Descent098/ahd/releases/tag/0.1.0) that's all I did. I already had version 0.2.0 planned, but I set a breakpoint for myself so that I could achieve something that works, but was incomplete. Doing this is great because it avoids the problem of never feeling like you're done. If you have 10-15 features, you might find one of those features slows you down, but if version 0.1.0 needs ALL those features, then taking a break feels like failure. 

Whereas if you break it up and go slowly there are plenty of points where you can plan ahead for the next version, but also put the project down for a while. I haven't commited any code to ahd in 2 years as of writing this. But because I already have the planning board for the next feature, I can dive back in when I want to. Like I will soon because I want to use the project at my job! Check out [the cult of done](https://thomasdeneuville.com/cult-of-done-manifesto/) (video about it [here](https://www.youtube.com/watch?v=bJQj1uKtnus)) for more suggestions, but make sure you set some sort of deadline for your first few projects as well. If you don't you'll find you will never make time to work on them!

### A contribution is a contribution

The development world is bigger than you think. Github's tools know this and include more than just commits as a contribution. If you're not sure if you can help with the code on the project you can also volunteer to do more project management (triaging issues, helping with documentation, helping organize tasks etc.). 

Open source is starved for people who want to fill these roles and it's one of the best ways to get into a project and begin learning about it, which can help you contribute later, or just keep contributing how you are. These skills will also prove invaluable in industry. The ability to organize your work, and especially estimate the difficulty of tasks is a skill sorely lacking. Learning how to do all this while the stakes are lower is a great way to get more experience that will help your work in the long run!

## Readme

Instead of just having a normal github page you have the option to create a github readme. This is a special repository that is written in [markdown](https://www.markdownguide.org/). These repositories are your username (for example my username is Descent098, so my repo is called [Descent098](https://github.com/Descent098/Descent098)), and they showup when people look up your user account before your contribution graph.

These pages are a great way to:

- Introduce yourself
- Categorize your repos
- Mention if you're looking for a job
- Showoff your skills

There's an infinite number of ways to format your readme, but you can see [mine](https://github.com/Descent098/Descent098) as an example, and you can even fork it as a starting point. On top of that there's a [great repository](https://github.com/matiassingers/awesome-readme) that gives you some cool tools you can use to improve your readme.

## Make each repo count

Once you have a project or two under your belt, start thinking about what makes projects you use great. From there try to emulate them. The better your repositories are, the better they look on your profile and/or resume. Not to mention you want people to want to use your code, and making your repo look more reputable is a great way to do that!


### Readmes

A readme is the first thing people see when they hit your project. A good readme can be the reason people decide to use it. Here's a few things you should include at a minimum:

- What the project does including:
  - A short tag-line-like description
  - A list of features
  - A list of "why use this project" or "who it's made for"
- A quick start guide with:
  - installation instructions
  - A quick demo of how to use your project

Here is an example of a bad readme:

![](/blog/vcs/glass-portfolio.png)

Here is a better one:

![](/blog/vcs/ahd.png)

Which would you be willing to rely on? There are other fancy things you can add if you want like a logo, a live demo etc. But the above considerations should be on every repo you want other people to use.

### Docs

Documentation is what makes projects usable. If no one knows how to run your code, no one will. A readme is great, but for more complicated projects you will want dedicated documentation. There are 2 primary types of documentation:

- API Docs; These are documentation for API projects. Essentially if you expect people to code in order to use your project you should have these. If you do a good job of commenting your application while you write it there are often tools to generate this for you (like [pdoc](https://pdoc3.github.io/pdoc/), or [jsdoc](https://jsdoc.app/)). An example can be found [here](https://kieranwood.ca/ezcv/)
- User docs; This is documentation that is designed to be more readable. Typically this is fully handwritten. You can use it to document API's (like the [azure monitor libraries](https://learn.microsoft.com/en-us/python/api/overview/azure/monitor?view=azure-python)), or you can use it to document using some sort of interface (like [wordpress](https://wordpress.org/documentation/) or [ezcv](https://ezcv.readthedocs.io/en/latest/)). There are tons of tools for this, if you know markdown then [mkdocs](https://www.mkdocs.org/) is great, or if you want a dedicated app and frontend [docusaurus](https://docusaurus.io/) or [codex docs](https://docs.codex.so/codex-docs) works well!

Regardless of which type of documentation you pick (or both), always have quick starts for each. People are lazy, and showing them something they can use quickly is very handy!

On top of that here are some tools to help you make better documentation with visualizations:

- [Mermaid JS](https://mermaid.js.org/); MermaidJS takes plain text, and can create various types of graphs and diagrams with their custom formats. It can be embedded as a javascript snippet, or generate an image. We use it all the time on schulichignite, and is great for easy-to-modify diagrams (also is supported in github readme files!)
- [Excalidraw](https://excalidraw.com/); This is a more free-form system that allows you to create simple reference images quickly

### Testing

Adding tests to your repositories can be very handy. Not every development job is being an application developer. A QA developer is someone who takes people's code and tries to break it. From this they can write automated tests to try to break the code and run every release against it to make sure the code is high quality. 

For python I recommend looking into [pytest](https://docs.pytest.org/en/7.4.x/) and [unittest](https://docs.python.org/3/library/unittest.html), for javascript [mocha](https://mochajs.org/) or [jest](https://jestjs.io/) work. 

For any language if you are doing web development, selenium ([JS version](https://www.npmjs.com/package/selenium-webdriver), [py version](https://pypi.org/project/selenium/)) can be great for testing. It gives you a programmable chrome window you can use to navigate an website and test it. 

### CI/CD

CI/CD is a fancy name used often for automation. If this is something you're interested in you can check out a presentation I did [here](https://kieranwood.ca/ci-cd-basics/#slide=1) on the topic. At it's basics though you can configure github repos using [github actions](https://docs.github.com/en/actions) so that it will run code on various conditions. This can be used to trigger running your tests on every push to the repository, or generating new API documentation every time you release a new version etc.

This is a much more advanced feature, but is becomming more common in jobs all the time. I personally **love** CI/CD, and I initially hated it. So give it a whirl, and don't feel bad if you're confused at first. It takes time to get used to, but is incredibly powerful once you are used to it!

## Conclusion

Hopefully at this point you've learned some things about github, and found something in here useful. The open source comunity is great to get into, and will help you throughout your career/hobby. Just go out and build things, not matter how dumb they seem at the time!
