---
title: "The Fables of Fable"
subtitle: "How does the most dangerous model yet stack up"
description: "Testing Fable on several projects as an AI skeptic"
pubDate: 2026-07-07T00:00:00-06:00
heroImage: /tech/blog/fables-of-fable/hero.png
tags:
  - theory
  - vcs
  - project-management
  - open-source
  - ai
---

I am ambivalent on AI. This may be shocking to people who have read previous posts and spoken to me in person, but I have shifted from overwhelming negativity, to just normal negativity. The passion of raging against the machine has dulled, and it's clear AI is to stay, largely for worse. But, you can't fistfight a tsunami, the reality is that this is a force in my industry whether I like it or not. As such I have moved on to the pragmatic interest of trying to see what these tools are actually useful for, and what use I can get out of them. As such this post is:

1. A review of Fable 5 + Opus
2. My general thoughts on how vibe coding will fit into my current and future projects

## The Marketing

*Before getting into my experience with the model it's worth setting the stage if you're reading this down the road from when it was authored. If you're just here for the AI itself move on to the [What I wanted](#what-i-wanted) section.*

The marketting hype around Fable 5 and how "dangerous" it is was a huge part of its release[^4]. The model was marketted as if anthropic was releasing nuclear secrets in their tone. The irony of the attempted regulatory capture (in my opinion) posture[^3] backfiring into a temporary export control ban will never not be funny[^1][^5]. 

Before the ban I had heard from several people that the capabilities of this model were impressive. Frankly, every model that's been the next "programmer killer" has been wildly underwhelming. The promise of the citizen developer[^2] has been one that persisted through various low-code tools, and gui database systems for a long time, so I'm no stranger to claims that a technology allows "anyone to be a dev". Unfortunately I'm not imune to marketting, and by the time it was banned I already wanted to try it out. So, when the model was relaunched[^6], I endevoured to give it a real effort.

## What I wanted

There were 3 initial tests I wanted to try out Fable for:

1. A workout tracker PWA with an offline-first approach and a sync system to backup your data
2. Review a prior feature I wrote in a codebase that was a bit flakey
3. Generate some content for a teaching project I had in mind

Essentially these can be categorized into greenfield development, legacy maintenance/review and bulk content generation. I paid my $20 for a pro plan, and got to work writing a plan for the first project. 

To spoil a bit of the ending, I ended up maxing my usage of two pro accounts and $10 of usage credits to better get in the mindset

![slopmaxxed](/tech/blog/fables-of-fable/minmax.png)

We'll come to those credits later, but rest assured. I got my money's worth. 

## What I got

Due to the extension of time that Fable 5 was available on normal usage (to July 12th) I ended up using it for a ton of projects. I used it for 2 weeks worth of pro tier included credits on 2 accounts. Which my full usage allocation on both Fable, and my overall weekly usage limits. I will have a separate post going through the highlights, and details of each project, because it will be quite long. The final list was:

1. A workout tracking app that works fully offline in browser, with the option to sync to a dedicated backend
2. A project scaffolding system to build offline-first apps with a sync option to a dedicated backend
3. A SQLite interactive offline-first static site LMS/course
4. A reading/note taking app that is also offline-first
5. A framework for building offline-first courses
6. A PoC for a multi-language script management system (already in progress, it just implmented the rest of `v0.1`)
7. A PoC for an interactive `contenteditable`-based static site builder (already in progress, just did the rest of `v0.1`)
8. Validation for a release on an existing project

Now I should be clear, many of these projects are "done" in the sense that they're usable, but **none of them** are what I would consider "done" for me (even after 2 weeks of solid work). They work, but are riddled with weird UI quirks, stiffness in how they operate, poor validation, etc. Even the ones I am currently using, when I tried to onboard someone else into trying it out, the cracks immediately began to show. That being said, I am pleasantly surprised at the experience. 

### Quality

To be blunt, the code the model produces is in my mind **not good enough** to set and forget. If I were doing the code review myself, in many cases I would have said no to the choices. But, in the spirit of maximizing utility, **every** project was in auto mode, with some small manual tweaks in very specific circumstances. 

Overall, it frequenty gives you something that **feels** fine, until you look closer under the surface.

#### Context Polution

When you create features the AI will often include references to those featuers in things like help text and comments. This can make them obscure to parse, or even misleading when requirements have changed since the last time the comments were updated.

For example in a note-taking app I ended up with the helptext `Paste links — one per line. Plain URLs, - bullets, or [Title](url) (what copying a tab into Obsidian gives you). Enter to add, Shift+Enter for a new line.`. This is just clunky, awkward, and arguably is worse than no help text for some users (especially on mobile). Something like `Paste links here. One per line. shift+enter for a new line, enter to auto-submit`. Or even just the first two sentences, and the controls shown under the box would be better.

Or in my note taking app, there are explicit references to my workout app in the comments and more importantly, in the 7th line of the readme:

![bad content](/tech/blog/fables-of-fable/readerr-workoutt.png)

Anyone reading the readme for my note taking app would have no idea what any of that means, and it came out of me asking the AI to backport a feature I added to the workout app after I exported the first version of it.

#### Content

Anthropic just cannot get a good content model. Opus and Fable are attrocious at content that isn't squarely aimed at developers, and in particular senior developers. Documentation ends up pithy to the point of vaugeness without the broader project context, instructional content is confusing unless you already have domain knowledge, and it often fails to "build-up" and writes everything at the same difficulty level regardless of context. I've found nearly every other major model (GPT/Gemini) to be much better at content (but often worse at coding). 

As one example, this is the 3rd chapter of an **intro to sqlite** course that it generated. 

![bad content](/tech/blog/fables-of-fable/bad-content.png)

So, the third SQL statement you're ever meant to make is:

```sql
CREATE TABLE answer AS SELECT COUNT(*) AS movie_count FROM movies;
```

Without ever having created a table or explaining **AS**.

This issue compounds with *how you talk to the model*. As any who work with me regularly will know, for technical work, and technical writing I'm quite verbose. My "mode" for writing documentation on the other hand, is very different. The model cannot do this. If it is debugging your code and handling complex situations, the content output will be at the same level of complexity. 

It will mirror any idioms you (or it) uses. At one point in a project instead of the term `packet` it decided on `envelope`, and that odd terminology was used everywhere. The same thing happened in a workout app where it changed my entire system to use the term `rounds` instead of `sets` for no obvious reason, and broke a ton of functionality.

#### Code Tsunami

Because the system doesn't care about how much code is in the project, it often produces **a lot of it**. I've found separate (and competing) systems implemented in the same project multiple times. One of my projects ended up with 3 separate theme management systems, and even in the same file sometimes it will produce 2 separate functions that do the same thing, but a single word is changed. For example a logging system I had it produced the identical log functions, but it had a JSON key to indicate which `system` the log was from. For each system it made a separate function where the only difference was that `system` would be set to `"queue"`, `"cart"` or `"admin"`.

Here's the breakdown of **Files** and **Code + Comments** (excluding blank lines) for each project to get an idea of the kind of scale you can get yourself into over less than 2 weeks:

| Project             | Files |   Code | Comments | Code + Comments |
| ------------------- | ----: | -----: | -------: | --------------: |
| lite-learner        |   203 | 10,375 |    5,788 |      **16,163** |
| workoutt            |    68 | 13,718 |      829 |      **14,547** |
| local-sync-template |    80 | 14,861 |      373 |      **15,234** |
| learn-anywhere      |   102 | 11,165 |    2,247 |      **13,412** |
| readerr             |    82 | 15,653 |      886 |      **16,539** |

| Metric              |      Total |
| ------------------- | ---------: |
| **Files**           |    **535** |
| **Code**            | **65,772** |
| **Comments**        | **10,123** |
| **Code + Comments** | **75,895** |


This amount of code is just not maintainable over the long term.

#### Design

The designs it generates are not awe-inspiring. From what I've seen the model can do better than what I ended up with, but for me I'm not planning on doing any marketting for my sites, so I didn't ask it to do anything crazy. As such, every project looks basically identical, with some small changes:

![Designs](/tech/blog/fables-of-fable/sites.png)

I'm sure if I would have asked it for more of a **wow** factor, it probably could have, but even just basics of using more icons than all text, logos, etc. Just give me **something** more differentiating. One of the side projects I had it work on that had no similarities to this code base ended up looking **exactly the same**.

#### Long AND short Memory

Once it locks in a way of doing things, it **really** wants to stick with them. It feels like walking on thin ice when you're deep into a project where any wrong wording might cause a cascade of thousands of terrible lines of code to be generated for no reason.

### Maintainability

The problem is that many of these issues can be temporarily abaited with *more code*, which is not a good solution. Small tweaks to the overall approach would go a long way, but this cuts against the faustian bargain being made. One of my biggest takeaways and negative aspects of this whole experience is that **once you start a project with AI, you're stuck with it**. I ended up making a few minor tweaks when I hit my usage limits that would normally be quick and easy, but the AI had built so much code around it that everything broke. 

For reference this code was **changing a single URL in a navbar**, which caused cascading errors that broke the entire service worker (offline usage) since it relied on separately entered hard-coded paths. Because this change also only broke offline usage, I didn't notice until later that essentially my whole app was broken from changing a URL. In many cases it's not **impossible** to maintain, but a normal human would just get **burned out** maintaining the code written this way.

The model has the knowledge of a senior engineer, and the wisdom of someone who's never written code before. It has photographic memory, and could tell you every definition of every term possible, but none of the tools to employ it well. Somewhat like an over-enthusiastic person that just learns to code, and starts doing stuff with no regard for how they intend to maintain it going forward. This bargain **can work**, until the credits run out...

## Usage Limits

*TL;DR: For me the pricing is not unreasonable, but I won't be using it once anthropic moves to usage credits only[^7]. Per week I can get ~20-30 Fable prompts with the included number of credits as of writing, this ends July 12th after which I'll use my remaining credits on Opus and cancel my subscriptions.* 

The usage limits, while understandable, are incredibly oppressive for Fable. If you need fast progress, this model is a bit of a wash. It can scaffold your entire app, and get basic routes up and running with a custom theme in 25 mins, but then you cannot use it (or any others included in your subscription) for another 5 hours. This then compounds into weekly limits that make you feel the cost of each mistake quite heavily. For those that don't know anthropic has 3 relevant limits on your plan:

1. A 5 hour limit: From the first prompt you make for the next 5 hours you have a set number of credits you can use until that period elapses
2. Weekly limit: This is a hard limit on the number of tokens you can use in a week
3. Model Limit (specifically Fable): You have a set weekly limit on how much you can send to Fable 5 specifically

As part of my testing I bought the $20/month plan, and used it until I hit my Fable limit (about 3, 5 hour session limits a day for ~3-4 days on medium/high). For reference I was hitting my session limits after 1-3 prompts while on high. Once you hit these limits you can begin to use *usage credits*, which are credits you buy in bundles. For me I bought a $10 bundle to see how far these usage credits got me. In the middle of my workout app I built I had an offline sync system. I also already had an onboarding flow for new users, I wanted to make thse two play nicer, so I gave the prompt:

> 1. In the developer settings add an option to also clear your current data. Have the developer options now have a flag where the user has to type in the phrase "I understand I can lose and corrupt my data by using these settings" into a dialogue modal and submit it before they can access the settings. Persist this as a inDeveloperMode flag for THIS session, requiring users to re-do this across sessions
> 2. Add more descriptive errors to the sync sections of the settings where if it's a 4xx say you cannot reach the server and to check the URL. Making sure to console log the issue, if it's a 5xx say the server is erroring and to contact an administrator and provide them with the details. Then give the status code and description (e.g. Server experiencing errors, please contact your administrator with the following details: 502 service currently unavailable) while also console logging the issue
> 3. Add the option to specify a server to the onboarding, with the ability to test your connection to it. Employ similar error UI to point 2. Design wise, make it a toggle button with details starting it initially in the offline only position, which has helptext saying while in this mode data is stored ONLY in the browser. Due to differences between browsers please do regular backups of your data via the export options in the settings page Then the other toggle switch option is sync mode which states This mode will synchronize data between your device and a server. See our documentation for details on server setup. (Please note you can still lose data if your information is synced offline according to the data retention policies of your browser) 
> 4. Have the onboarding not allow you to access any other pages of the site until you complete it. If there is partially completed state from before that the user failed to clear (e.g. they previously had an install, and manually deleted a table or column), then give them the option to start the onboarding with a best effort to recover their last settings.

This resulted in 300 lines of code, and $15 of usage. If the app is architected correctly this is a single component re-used in 2 places, and a guard clause on the homepage. Minimum wage where I am is ~$15.50, so this means that this process was roughly equivalent to 1 hour of work for someone with no qualifications, more likely <30 mins of someone you would hire from a firm. For many developers I don't think this is unreasonable pricing. For me, if I had done the code myself, and had my own structure it's not unreasonable for it to take ~30 mins to go from idea to finished, commited and cleaned up. How you view this pricing will scale to your own opinions, but for me, this helps anchor the model quite nicely. 

This section is **entirely napkin math**, and shouldn't be taken too seriously, but it's my opinion based on what I've seen. Based on the usage I did for this 1 project, my guess is that the cost would have been ~$400-800. Exact numbers are pretty hard to gauge (which is not reliable for a business), and without the 5 hour limit I think my usage would change a lot. Essentially I used my entire weekly allocation of Fable + 3 Opus 4.8 prompts and a bit of manual coding. If I were to have done the project myself, I probably could have done it slightly faster since I only really got 1-4 prompts a day with how the limit timings ended up. That being said, not an unreasonable price for the work being done, but it is unreasonable for the quality. If I had done it myself the design choices would have been different, and I likely could have done it in much less code. If I had a cheaper model to help me with the grunt work (e.g. here's my schema generate 40 test workouts), I definitely could have done it faster and to a higher quality than the model. But, I probably wouldn't have...

## Personal Software

This is where Fable is useful. No, it's not here to replace engineers for serious systems over a long period of time. The code it makes is too unmaintainable and fragile. Works well for iteration, and `v1`, but by `v20` your project is dead in the water. This doesn't matter in the startup side of things, but enterprise, where every choice is cemented for 5 years across a 3 month change cycle with 15 stakeholders, legal and financial consequences, plus compliance, it's not maintainable. The thing is, `v1-20` describes a lot of software I want.

My backlog of projects I want to work on is incredibly long. There are tons of little tools and utilities that would make everything I do easier, but I just don't care enough to build them. This is where Fable shines. Tools that I don't care about, that are using techniques I don't really care to learn, but are useful. This is where Fable shines. I want a workout tracker because **FOR THE THIRD TIME** I download an app that loses my data, or wants to charge me to keep using it. Now I can just generate it quickly. Want something more ergonomic that handles syncing better than an obsidian vault + git for taking notes on articles you read? Generate it.

On top of that I only implement what I want, how I want it. I don't need accessibility, so I don't add it. I don't need integration into 10 other platforms, so I don't add it. The entire application is **what I need**, nothing else. All this, and since I'm the only one running my apps, I don't bother with updates unless they're security updates. Or even better, since I don't write the code, just write the functions in plain JS that targets the latest browsers and nothing else. Smaller attack surface, same convenience for me.

I've heard people call this personal software, and I think this is where AI really shines, but it's not without it's consequences.

### Learning

It's easier to do nothing than something, and in that same vein not coding a project is much easier than coding one, even if you enjoy coding. Many useful lessons are learned through the painful experience of mistakes, and their corrections, a process that doesn't really exist in this sort of vibe-coding. I gained **no real technical knowledge** in all the applications I built. If I wanted to lie to myself I could say I'm learning more project management, or communication skills, but that's really a lie. If you let every one of your personal projects become vibe coded **you will stagnate** as a developer. There's no getting around this fact. 

That being said, most of the tools I built are ones that **I wasn't actually building**, and if I'm being honest, **wouldn't have**. Even the ones I use daily, I just didn't care about the domains enough. All of the projects I did in this 2 weeks have been in my notes app as TODO for at least 1 year, some longer than that. Additionally I think there is an opportunity to get some useful learning out of LLM's, but that's in using them to scaffold things you don't care about. There are dozens of datastructures I want to learn. I would also like some visualizations of how they work for my [knowledge base site](https://kieranwood.ca/compsci). I **only** care about the datastructures, not the visuals. So, I'll write the datastructures (probably in go), then ask a model to take them, and build a bespoke animation for them to explain the process, and intermix my code in the presentation to help make it nice to look at. 

I'm still doing the learning and the implementation, but the AI does the part that I don't care about these days, which is learning an animation framework to make it look appealing to other people.

But, there was one more thing I was curious about. Was there a way to make these systems more reliable. I found in the past (and Fable is not immune) that you can end up with 1 really good solution, and re-run with a similar prompt and end up with a hacky mess. Was there a way to make a probablistic LLM more deterministic with constraints?

## A code gen for code gen

Many of these applications I built follow a similar pattern. They're all offline-first, some of them allow for an additional sync system, and they're all designed to be installable. I tried to think of a way to abstract how I might go automating building these similar apps if I were to do it, and came up with an interesting solution.


### The instance to generator pipeline

What if I built out an example application, then used the AI to build a code-gen tool that follows the same architectural decisions? I don't need to re-invent the wheel on every app, and if I make it configurable enough, it can be a great starting point to guarentee a reliable foundation to build from. I ended up doing this in 2 different layers, here were the order of events:

1. Create an [offline-first workout app](https://kieranwood.ca/workoutt/), with the option for a sync backend
2. Take that app and build [a project to generate similar apps](https://kieranwood.ca/local-sync-template/)
3. Use that project as the basis for another project that does not have the backend code, and is just offline first, then backport the patterns
    - This ended up being a [sqlite learning app](https://kieranwood.ca/lite-learner/)
4. Abstract the [sqlite learning app](https://kieranwood.ca/lite-learner/) into a template for a [generic offline-first course site](https://kieranwood.ca/learn-anywhere/)
5. Use [the template](https://kieranwood.ca/learn-anywhere/) to build [a weekly reading management app](http://kieranwood.ca/readerr)
6. (in progress) Create a frontend UI to allow you to build and export [the template](https://kieranwood.ca/learn-anywhere/) with your own content

![instance to generator diagram](/tech/blog/fables-of-fable/process.png)

[The builder (local sync template)](https://kieranwood.ca/local-sync-template/) allows you to specify your schema, and you can generate a frontend, or frontend + backend with everything you need to get up and running. Here is a video walkthrough of the builder using the included experimental schema to get an idea of it:

<video  controls>
<source src="/tech/blog/fables-of-fable/local-sync-template.mp4" type="video/mp4">
Your browser does not support the video tag
</video>

What this means for me is, when I lose Fable access (or access to any AI's), I have the ability to build similar apps much faster, and I can build what I want. On top of that, because the initial codebase is AI generated (but not as complex as later apps), me or the AI can write the rest of the code.

## Is it worth it

Fable is not worth it's usage credit cost. Once it's off general availability for me, it's dead in the water. Outside of the initial buildout of the first app, for much of my work I actually didn't realize if I was using Fable or Opus since I switched back and forth between them, and the various effort levels as I went. Once you have a good foundation, most of the models are pretty good for iterative changes. Major overhauls, yeah Fable is better at those for sure. I have yet to decide if $20/month is worth it with the better resource limits on non-fable models, but I definitely won't keep 2 subscriptions. 

Overall, the latest anthropic models are finally in a place where I feel like they're worth using for me. For things I really care about (like my music management app), I will still do them by hand to **make sure** they're solid and simple (data loss when you're getting to 100s of GB and single copies of data is serious), but the personal software angle is very interesting. Quick simple little apps, and demonstrations are pretty reliable, and once you've done it successfully once, you can re-use the code and improve it.

[^1]: https://www.msn.com/en-us/money/other/us-lifts-export-restrictions-on-anthropic-s-Fable-5-ai-model/ar-AA26Vm2n
[^2]: https://www.servicenow.com/workflows/creator-workflows/what-is-a-citizen-developer.html
[^3]: https://darioamodei.com/post/policy-on-the-ai-exponential#:~:text=The%20government%20should,or%20arbitrary%20decisions.
[^4]: https://www.anthropic.com/news/claude-Fable-5-mythos-5
[^5]: https://www.anthropic.com/news/Fable-mythos-access
[^6]: https://www.anthropic.com/news/redeploying-Fable-5
[^7]: https://www.anthropic.com/news/redeploying-Fable-5#:~:text=For%20standard%20Enterprise%20seats%2C%20there%20is,longer%20have%20access%20to%20Fable%205.
