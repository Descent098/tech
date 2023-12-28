---
title: "Intro to Github"
subtitle: "Taking git repositories online"
description: "Now we know how to use git we can look at the social aspects of coding. Intro to VCS Part 3/4"
pubDate: 2023-10-30T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/vcs/hero.jpg
crosspostURL: https://schulichignite.com/blog/vcs/intro-to-github/
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

In the last article we covered git and using it. We talked a bit about remotes, which are services that allow you to use git over the internet. Github is one of these git provider platforms that can act as a remote. This means you can upload your repositories to Github. This makes it much easier to:

- Share your repositories with others
- Have 1 "source of truth" for people on a team to work off
- Download other people's projects
- Have a frontend in order to visually see git changes

Additionally we will talk about the social aspect of coding, and a bit of the legality behind creating and using software!

## Why github

Github isn't the only social git provider. There are several others including [gitlab](https://about.gitlab.com/) and [bitbucket](https://bitbucket.org/). The reason we cover github specifically in this article is because:

1. It's the most popular; While this doesn't mean it's the best it does mean it's the most likely for people to discover your projects, and most likely to have the projects you use hosted on it. It also integrates the best with many services because of it's popularity.
2. It has a ton of features; Outside of just hosting your repositories github has a ton of features that help you with your development. We will cover [a few later](#additional-github-features) in the article
3. It is the one I am most familiar with

## Using Github

To use github you will need an account, you can create one [here](https://github.com/signup). Once you have an account we will now walk through creating a repository, and downloading it locally:

1. Once we have created an account we can initialize a repository directly on github by hitting the plus (+) in the top corner and hitting *New Repository*
 
![](/tech/blog/vcs/remote-init.png)

2. We now just have to fill out some fields to finish creating the repository
 
![](/tech/blog/vcs/remote-init-2.png)

3. To get our code locally we can use `git clone <URL>`, so in my case I can use `git clone https://descent098/ezcv`

You're now all setup with a git repo that is tied to github. This means every time you push your code it will show up in the repository online! 

### Github desktop

If you do not like the command line you can also visually manage your git repositories using [github desktop](https://desktop.github.com/). This is a handy tool for managing your git repos, and comes with extra features on github. 

![](/tech/blog/vcs/github-desktop.png)

### Additional github features

On top of allowing you an easy way to visualize your git repo and versions, there are also several other features such as:

- Seeing analytics for your code (lines added, lines removed etc.) 

![](/tech/blog/vcs/node-contribs.png)

- Run [CI/CD](https://www.cisco.com/c/en/us/solutions/data-center/data-center-networking/what-is-ci-cd.html) and automations (through [github actions](https://docs.github.com/en/actions))

![](/tech/blog/vcs/actions.png)


- [code analysis](https://github.blog/2020-09-30-code-scanning-is-now-available/) and [quick-jumping](https://github.blog/2023-05-08-github-code-search-is-generally-available/)
- [github pages](https://pages.github.com/)
- [Web based code editor](https://github.blog/2023-02-22-a-beginners-guide-to-learning-to-code-with-github-codespaces/)
- [Management](https://github.blog/2023-05-09-push-protection-is-generally-available-and-free-for-all-public-repositories/) and [planning](https://github.blog/2022-11-15-the-journey-of-your-work-has-never-been-clearer/) tools for multi-person projects
- [Template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) (repos designed to be copied like [this one](https://github.com/canadian-coding/python-package-template))
- etc.


You can also unlock additional features if you are a student with [github education](https://education.github.com/). While all these features are great I would recommend also checking out those other providers just to you familiarize yourself with several systems!

### Working on other people's projects

When working on a remote like Github we tend to use a different process when working on **other** people's projects. Forking on GitHub is a fundamental collaborative feature that allows users to create their own copy, or "fork," of an existing repository hosted on GitHub. 

This process is commonly used in open-source projects and collaborative software development. When you fork a repository, you essentially create a separate, independent copy of it in your GitHub account. This copy is under your control, and you can make changes, improvements, or modifications to the code without affecting the original repository. Forking serves as a starting point for contributing to a project or experimenting with code changes.

To fork a repository on GitHub, follow these steps:

1. Log in to your GitHub account and navigate to the repository you want to fork.
2. In the top-right corner of the repository's page, click the "Fork" button. This action will create a duplicate of the repository under your account.

![](/tech/blog/vcs/forking-1.png)

3. Once the forking process is complete, you'll be redirected to your forked repository's page. You can now clone the forked repository to your local machine using Git, make changes, and commit them.
4. After making your changes, you can create a pull request from your forked repository to the original repository. This allows you to propose your changes to the original project's maintainers for review and potential inclusion.

![](/tech/blog/vcs/pr.png)

**Here is a visualization of the steps:**

![](/tech/blog/vcs/fork-process.png)

Once your changes have been forked you can open pull requests to have your changes from your branch "upstreamed" to the main/master branch of the original project. Once accepted you can then pull the changes into **your** main/master branch in your fork!

You can feel free to practice this on [this repo](https://github.com/Descent098/session-7-demo), create a readme file, and try opening a PR after forking.

## What is open source?

Open source is an interesting movement that came out of early software development. It essentially holds up the principle that people are entitled to certain freedoms from their software, and in their software usage. These liberties vary, but generally are tied to the principles that you should have transparrency in your devices. You should be able to look up the source code to understand how any program running on your machine works, the same way that cars are required to have schematics for their internals so people can service them. Likewise you should be able to modify software you own to your hearts content.

Counterintuitively this approach is incredibly popular, especially with buisnesess. There are lots of benefits with this approach. One of the primary benefits is the ability to have a group of people of **different specializations**, across **different regions** come together and work on a project. Open source has enabled a ton of projects that run a huge portion of the software you use every day ([linux](https://github.com/torvalds/linux), [python](https://github.com/python/), [nodejs](https://nodejs.org/en), [electron](https://www.electronjs.org/) etc.). Essentially every one of your game consoles, phones, your TV's, websites and other services you interact with daily are built on either entirely open source software stacks, or have components that are open source.

For example this website is built with [hugo](https://gohugo.io/), which is fully open source and it's code is available on [github](https://github.com/gohugoio/hugo). Keep in mind that **not everything that is open source is free**. People often use the phrase "free software" to describe open source. This is ["free as in freedom, not price"](https://ell.stackexchange.com/questions/2516/free-as-in-free-speech-not-as-in-free-beer#:~:text=When%20we%20call%20software%20%E2%80%9Cfree%2C%E2%80%9D%20we%20mean%20that%20it%20respects%20the%20users%27%20essential%20freedoms%3A%20the%20freedom%20to%20run%20it%2C%20to%20study%20and%20change%20it%2C%20and%20to%20redistribute%20copies%20with%20or%20without%20changes.%20This%20is%20a%20matter%20of%20freedom%2C%20not%20price%2C%20so%20think%20of%20%E2%80%9Cfree%20speech%2C%E2%80%9D%20not%20%E2%80%9Cfree%20beer.%E2%80%9D). 


## Licenses

While it would be nice to say all of this was built out of pure kindness, a large reason for why this works is due to the way some projects manage their license. A **license** determines what you are and are not allowed to do with something. When you buy a subscription to a streaming service you are buying a license to use their product so long as you follow their terms of service. 

Likewise software, and more specifically source code uses licenses, and open source employs special types of licenses to ensure a free and open ecosystem.Lots of existing projects use **copyleft** (as opposed to copyright), which is a specific approach to open source licensing designed to ensure that open source software remains free and open. When a software project is licensed under a copyleft license, anyone who modifies or extends the software must also release their changes under the same copyleft license, preserving the open source nature of the project.

Now that the culture of open source is more solidified in developers people are using more permissive licenses which are open source by default, but will allow you to make completely proprietary software with them.

### Common open source licenses

None of this is legal advice, however there are many common licenses you will run into. I have chosen 3 to talk about here, but you can also check out [https://choosealicense.com/](https://choosealicense.com/) for even more in-depth looks at the licenses. If you are making a commercial project however I would speak to a lawyer **before** picking a license:

1. MIT License; The [**MIT License**](https://choosealicense.com/licenses/mit/) is one of the most permissive open source licenses. It allows users to use, modify, and distribute the software for both commercial and non-commercial purposes. Users are only required to include a copy of the original MIT License and a copyright notice when they redistribute the software. This license is often chosen for projects that want to maximize flexibility and encourage adoption.
2. GPL (GNU General Public License); The **GPL** is a strong copyleft license developed by the [Free Software Foundation (FSF)](https://www.fsf.org/). Under the GPL, anyone who distributes software covered by the license must also make the source code available, ensuring that modifications and improvements are shared with the community. This license is intended to protect the principles of free software and prevent proprietary derivatives. There are several versions of the GPL, with the most recent being [GPLv3](https://choosealicense.com/licenses/gpl-3.0/).
3. Apache License; The [**Apache License**](https://choosealicense.com/licenses/apache-2.0/), developed by the [Apache Software Foundation](https://apache.org/), is a permissive open source license that allows users to modify, distribute, and use the software for any purpose, including commercial use. Unlike the MIT License, the Apache License includes a patent grant, which helps protect users from potential patent-related legal issues. This license is commonly used for projects with a strong focus on collaboration and community development.

So generally speaking where you can I would recommend using MIT or apache licenses to avoid any potential issues, but GPL software is still great to use, just make sure you don't accidentally violate the terms by making your changes private.

In summary, open source licenses are essential for governing the use and distribution of open source software. They can range from permissive licenses like the MIT License to strong copyleft licenses like the GPL, each offering different levels of freedom and protection for both developers and users. The choice of license depends on the goals and values of the software project and its community.

### I don't want to use a license

Even if you don't want to use a license I would highly recommend putting one on any public github projects. The main reason for this is that all these licenses **specify there's no warranty**. Without this some countries **may** allow you to be held liable for any damages caused by bugs in your software. When in doubt the MIT license is [the most popular](https://github.blog/2015-03-09-open-source-license-usage-on-github-com/) choice, and it's the one I personally use the most. It's best if you don't care what people do with your code, but also keeps you safe from most legal issues!

### Contributing to open source projects

If you're interested in getting involved in some open source projects you can check out the resources below for help starting your journey:

- [Hacktober](https://github.com/topics/hacktoberfest)
- [How to make a pull request (walkthrough)](https://medium.com/@kevinjin/contributing-to-open-source-walkthrough-part-0-b3dc43e6b720)
- [Finding good first issues on github ](https://github.blog/2020-01-22-browse-good-first-issues-to-start-contributing-to-open-source/#:~:text=There%20are%20several%20ways%20to%20find%20more%20information,personalized%20recommendations%20for%20projects%20you%20might%20like.%20)

## Conclusion

The world of software development is vast, and has a ton of great projects. Git and version control more broadly are one of the tools that help make the process of building projects easier. They provide the backbone of services like github which allow us to have the community of developers, and the masses of open source code we currently have!
