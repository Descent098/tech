---
title: "Reluctant Self-Hoster"
subtitle: "I'm a self-host hostage, not an acolyte"
description: "I self-host many services, I wish I didn't have to, but here we are..."
pubDate: 2026-01-06T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/reluctant-self-hoster/hero.png
tags:
  - theory
  - vcs
  - project-management
  - open-source
  - computer-science
  - terminology
  - software-engineering
---

I hate self-hosting. I used to enjoy it when I started (10 years ago when I was in high school). It was lots of fun, and I learned a ton that was useful in my career. If you're just starting out, it's worth hosting a service or two (especially ones **you've written** if you're a developer). That being said, bluntly, the experience sucks. Every little issue is yours to solve, and organizing, and re-organizing for whatever the new hotness is gets draining. 

In the last month I've had to submit 2 patches for major react CVE's [^13] [^14] on projects I'm involved with, update mongoDB transitive dependencies because of [mongobleed](https://www.mongodb.com/company/blog/news/mongodb-server-security-update-december-2025). As I'm writing I just had to update a dozen or so apps and their configs ([pangolin](https://pangolin.net/) being the biggest pain in the ass because it has 4 subservices across 3 devices), and do a bunch of hardware troubleshooting. All of this just to **restore access** to services, not even do something new or cool. I spent the winter break on a ski trip, and if I wasn't still paying my google subscription I wouldn't have been able to share any images that I took with my family because my reverse proxy tunnel ([pangolin](https://pangolin.net/)) died intermittently due to mismatched versions on a dependency, so I couldn't access immich. 

So, if it sucks, why do I have a ton of self-hosted services? Why am I writing more I intend to use? and why am I buying more hardware to expand my own self-hosting capabilities?

## Many moons past

In the not-so-distant past I used to make fun of my buddy who self-hosted everything. I would throw up a docker container here and there, but I wouldn't actually run my own services for anything I relied on. I knew my limits, and the finicky nature of software without having touched a line of source code yet. Just being a "devops" guy was enough. But times have significantly changed since then, and unreliability has crept into so much of the software I use. 

For the first time ever I'm making plans to permenantly move to linux. I used to bully my friend (also the self-hoster) about using linux, because it was genuinely attrocious when I started. Basic things like a trackpad would leave you 20 commands deep in some 1995-looking forum somewhere. Even then I preferred the linux philosophies, but that wasn't worth the tradeoff of the endless nonsense you would have to put up with. Windows **was the pragmatic choice** to just get on with what I wanted to do. Sure, I would dual-boot my desktop, spend maybe %20 of my time in linux and the rest of my "real work" in windows. A few semesters at university I ran linux full time on my laptop, with the warmth of my windows machine back home to fall back on. Even as things got worse I still defended windows because it **was better**. Even with all the telemetry, the annoying one-drive garbage[^1] [^2] [^3], app reinstallations[^4] [^5] and other nusiances, **it was reliable**.

But in 2026, Windows has **daily** major system crashes in the file explorer, and other system-critical parts. I did not pay $200 **per-device** to ocasionally have things work. [Everything](https://www.voidtools.com/) is plainly better than windows search, and has been for the entirety of windows 10's lifecycle. For god's sake [file pilot](https://filepilot.tech/) is more reliable than file explorer, and it's literally in beta. I've watched my operating system atrophy in real-time over the last 3 years and regress back to a similar experience I had in 2015 with linux ([possibly related](https://www.cnbc.com/2025/04/29/satya-nadella-says-as-much-as-30percent-of-microsoft-code-is-written-by-ai.html), [and maybe this](https://www.reuters.com/business/world-at-work/microsoft-lay-off-many-9000-employees-seattle-times-reports-2025-07-02/)). Not only that but I **have** to login with an account for the priveledge[^6] [^7] to be milked for every bit of usage data while running what feels like beta release candidates. Every old reason I had for not running to the alternatives has dried up, and linux **is the pragmatic choice**.

## Case Studies

Linux is a microcosm of the same sorts of problems that have lead me to self-host lots of what I need. Quite frankly I just want to throw a bit of money at someone to solve my problems, but these days that's not enough. The term [enshittification](https://www.merriam-webster.com/slang/enshittification) is a term I used to hate because lots of the complaints people used to make were geniunely not a big deal. But now, core functionality being broken while increasing cost, and having some secondary or tertiary money stream selling data to some shady data broker, or for AI training is just par for the course. Even worse more recently I think a fair number of the breakages I suspect aren't even happening due to enshittification, but instead just genuine incompetance. So, what does this look like?


### Music

I listen to a lot of music, and have for many years. I started on itunes when I was still in elementary, burning CD's with a bootleg version of a walkman that would let you extract songs. It was pretty simple, essentially you would:

1. Add your music, or buy songs/albums
2. plug in your device (apple only), and "upload" the files
3. listen to them whenever you wanted

It was simple, elegant, and worked pretty well. Then, around high school I used google play music (before google killed it). It came with 2 major advantages over itunes:

1.  **You could store music in their cloud**; meaning you didn't have to have everything saved locally on device (since storage space was smaller back then). You buy songs/albums, or upload them, and they're available on any PC/phone/tablet you want to download whenever you want
2. **You could use whatever device you want**; No need to be locked into "the ecosystem", just use whatever device you **actually want**, not just what's compatible

While not stated as a reason officially, I'm sure people massively abused that storage, me being one of them. They had a cap of 50,000 songs for each user, which is a little ridiculous. I used to listen to **tons** of mixtapes from various sites, and random nonsense from youtube. My library peaked at this time around 20,000-30,000 songs between purchases and uploads. When google play music went down I literally didn't have the space to backup that old library, so tons of that content is just completely lost media (at least to me). Then, before high school was even over came the streaming era.

Spotify was a game changer, every song (ish) I could want for $7/month. The value proposition was obvious, and after the hassle of managing my own library before, letting someone else do it for me was perfect. But this time the proposition was more mixed than a straightforward improvement. With heaps of content, and good social/sharing integration came several issues:

1. You can't "upload" your own music. You can instead do a weird dance of using a device as a pseudo server while downloading on another device (though now there seems to be a "local files" viewer that seems promising for **some** use cases)
2. A lot of my music was missing from their library, so I would need to do the dance from point 1 quite often
3. Downloaded songs must be "re-synced" every 30 days, which is an issue if you're doing long wilderness trips without data
4. I didn't know it yet, but DRM (digital rights management) meant that songs who's license lapsed would be removed from your library, and playlists

I got over the first 3 issues pretty quick. I just started to listen to other music, and got a better data plan. I was a bit less angsty, so even though it was a lot of my library, I just let go of the old mixtapes and resigned myself to just listening to people on spotify. There's enough content on there that I figured I wouldn't notice after a while, and **the hassle to use another system wasn't worth it**. Additionally mobile data got significantly cheaper in my area, so I just upgraded my phone plan. I lost my local downloads once, but other than that I didn't worry too much about trips, since most of mine were 1-3 weeks, and usually with some sort of wifi at some point anyways.

Spoiler, number 4 ruined all that. For those unaware DRM or digital rights management is the name given to software that limits actions you can take with media. Games for example often have DRM as an anti-piracy measure. I'm not interested in litigating arguments around the benefits and disadvantages of DRM, but for the first time in many years I encountered it as a legitimate, persistant problem. I was trying out a fork of chrome called [helium](https://helium.computer/) the other day, and hit this wall due to the DRM:

![DRM blocking access to spotify](/tech/blog/reluctant-self-hoster/drm.webp)

Funnily enough based on some cursory digging it likely is actually DRM for the auto-playing videos on spotify (a feature I already hate), not the songs themselves causing the blocks. Likewise, because of various licensing fiasco's a bunch of my music was silently removed from my library. Some I understand, but this started including large artists like sinead O'Connor (900,000,000+ streams, nearly 450,000 daily[^8]	) who's [I'll tell me mah](https://www.youtube.com/watch?v=Bu5gqwIOQJs) rendition was removed AND removed from my playlists 😡. In the last year I've had nearly 3 dozen songs pulled in the same way, not to mention some of my old playlists looking like graveyards

![DRM blocking access to spotify](/tech/blog/reluctant-self-hoster/missing-songs.png)

I also found the recent addition of messaging[^9] concerning. Usually when apps start adding tons of random features it shows there's little to no user growth, so they need to start squeezing customers. Likewise the AI songs[^10] [^11] (though they seem to be [getting better](https://newsroom.spotify.com/2025-09-25/spotify-strengthens-ai-protections/)), plus DJ[^12], and fact that [anna's archive just scraped them](https://annas-archive.li/blog/backing-up-spotify.html). Makes me feel like something dark is brewing over the horizon.

I found no solutions I liked to this problem, so [I'm working on one](https://myuuze.github.io/), but it will be a little while. Even with my solution in progress, there are some things that are just infeasible to do like:

- The social aspects of spotify; Sharing, jams, casting, etc. Everything that lets you make your experience shareable
- Discoverability of new songs; Spotify is just good at finding similar artists and recommending them to you
- Clients for every device; There's a spotify build for every platform

### Code

I joined [github](https://github.com/) on October 10th 2016. Meaning I've had my account nearly 10 years at this point. I love the platform, or at least what it was. Github still to this day appeals to me because it's 1 place where I can put everything I want to have available. Stars, gists, repositories, organizations, and even hosting services all wrapped up in one easy platform. With that being said I've had a few ongoing issues with github for a while now, and some new ones including:

- LFS storage; I've wanted to store copies of videos associated with courses, can't do it in any reasonable way, likewise even small binary files like PDF's crawl updates and pushes to a halt
- Pro Changes; I had github pro for a while with my university, and it was great. It let me have private repos, hosting built in, and tons of useful features. Now pro has just become a pain to tell what you get. I had [my first outage](https://kieranwood.ca/up/incident/1) on my company website ever a little while ago because I didn't read the fine print that re-upping my pro subscription would mean I lost access to hosting github pages sites on private repos within organizations, but hey at least I get some more copilot slop credits now.
- Lack of social improvements; Looking for new projects, and interesting developments is done entirely off platform. Github could easily make it more accessible to find cool projects, they have the data to do it. Instead I have to hear about projects from redit or daily.dev or some other aggregator. Github has a [blog](https://github.blog/) already, yet it's basically just used to talk about their own events and AI nonsense (one in the same these days). Give me an option to subscribe to posts in my feed for things relevant to me instead of an AI prompt, please. Some of these features already exist with the [community exchange](https://docs.github.com/en/education/about-github-education/github-education-for-students/about-github-community-exchange) system, they're just so hard to find for no reason
- Over Complication; There have been a bunch of pushes to make github more "serious" and with it comes annoying nonsense
  - Access; You can no longer simply log into github with your username and password via git clone. This choice means that I at minimum need to have my phone on and connected in order to access my projects, not to mention how much of a pain in the ass it is to use on linux
  - UI Repetition; Because of how many features they've added it's hard to keep straight what does what. For example hitting `/` brings up a search, but so does `ctrl+k`, and each of them is different. One of them is useful because it searches **your repositories** first, but can't search other organizations, whereas the other is a generic github search, but also can index your organizations
  - Complicating existing features; I used to use the old projects system to spin up a simple kanban board. This took 2 clicks in the past. I would go to a repo and go to project, then add a project. That's it I now had a kanban board I could add items to, and plan with. This made it easy to setup boards to plan project versions. Now I have to use a full JIRA clone, with 6 separate steps, and endless configuration to do something that used to take 2 seconds and no thought (don't even get me started on permissions).
  - AI everywhere; The UI has gotten worse, and desperately tries to push AI features, the homepage is the most egrigious example where it takes up 1/4 of the screen on your homepage and **cannot be removed** even if you don't have an AI compatible plan (see image below)

![github's AI ui](/tech/blog/reluctant-self-hoster/github-ui.png)

Between all this, and the fact that culturally more people are moving to codeberg, gitlab, or some other git provider, so I can't keep everything in one place anymore, i've started looking at alternatives. Currently [forgejo](https://forgejo.org/) seems like the best solution, and I've begun to mirror my repos with it, but it's a very manual process for someone with 200+ repos like me. A few things in the works are:

1. Turning projects will larger files into actual git repos instead of just having them on my PC like I currently do
2. Looking at hosting. I just finished configuring the [actions](https://forgejo.org/docs/next/user/actions/reference/) system, but will need to figure out what else I need to do in order to get a [github-pages](https://pages.github.com)-like experience. [git-pages](https://codeberg.org/git-pages/) is my most likely candidate right now
3. Finding a universal link list sharing service to allow me to "star" things like I have in github, and organize them into separate lists, but in a way that works with all the different providers

I'm sure there will be more posts to come about how I do all this!

### Books

I hate digital books, and have for a while. But, for technical reference manuals, textbooks, and academic papers I really wanted something to help me organize everything. I couldn't even find a proprietary option that met 1/3 of my needs, I spent a few hours looking at kindle and some other options, but they're all just so bad. This is a rare case where I just went straight to self-hosting with one of my favourite open source projects I've ever found, [booklore](https://booklore.org/).

Booklore just does everything well, and empowers you to **organize your own files**. So for the first time in years, all my random books I have from [humble bundles](https://www.humblebundle.com/books), [gutenberg](https://www.gutenberg.org/), textbooks I was forced to buy, and *cough* "other locations" are nicely organized. Not to mention it even works well for academic papers, whitepapers, and pamphlet/how-to guides from various places. My favourite part of the app is [the Bookdrop](https://booklore.org/docs/bookdrop), basically dump your files in it, and organize as you go. It works so well, and has helped me organize several hundred documents that have been left in various folders over the last 10 years. It is a large inspiration for my work on my music management solution. 

### Games

I play a lot of games, and because of that I end up with a lot of game storefronts and launchers I am getting a bit sick of having to have the epic launcher for fornite, gamepass/XBOX for other games, BattleNet for starcraft, ubisoft launcher, origin, etc. That being said, I primarily use steam these days.

I love steam, and as a platform it's been great. I have had very minimal complaints. The main one being that controllers work great for steam games, but when I'm using other software the steam controller system gets in the way, so I have to close it while I play something else (like an emulator, or something on another platform). However, over my winter break I ran into my first real issue with steam, offline access. I wanted to play some games in the car, but because I hadn't open steam and authenticated **before I left**, I couldn't play my games. This did leave me to try out what is quickly becomming my favourite new platform, [GOG](https://www.gog.com/en/). It's whole philosophy is great, it has good prices, and tons of cool [initiatives](https://www.gog.com/about_gog). Even with this annoyance, I still like steam and intend to use it, though I will be trying to pick up more games on GOG in the future. So, where does the self-hosting come in.

Well, not everything is on steam, or even GOG. Some games are console exclusives that I need to emulate, or just one-off indie games that exist only on platforms like [itch.io](https://itch.io/) or the developers own website/github. Likewise what's the point of DRM free games if you don't have backups of them. So, I needed a platform to store all these various games. In comes [Romm](https://romm.app/), a platform for hosting roms and game files. Not to mention [emulatorJS](https://emulatorjs.org/) support for older consoles like GBA so you can play them right in the browser, and store save states to your account. Much like [booklore](https://booklore.org/), Romm encourages you to organize your game files (though to a lesser degree with just a simple folder structure). The real power of the platform comes when you use it with a universal launcher like [playnite](https://playnite.link/).

With [playnite](https://playnite.link/) on my system I can have a single, unified launcher for all the games I have across the various storefronts, and it has a Romm integration that allows me to automate downloading, configuring, and running my games with whatever emulator I need. This has also made doing game streaming with something like [moonlight](https://moonlight-stream.org/) a breeze. I just bought a bunch of [8BitDo Adapters](https://www.8bitdo.com/wireless-usb-adapter/), hooked them up with my raspberry pi, and now I can stream PC games, handhelds, gamecube, wii, playstation 1-4, etc. and play with my friends and family on whatever controller they want. A much better value proposition than something like a Nintendo Switch (IMO), and I can always emulate those games if I want to anyways.

That being said the biggest problem with doing a game-hosting service is storage space. Now that companies have less imposed hard size limits there's very little incentive to optimize size. The latest Call of Duty games are upwards of 200GB for a game that fundamentally feels the same, or worse than Modern Warefare 2 (the first one) did in 2009. So if you go this route be prepared to shell out for many Terabytes of storage if you primarily want to play AAA games newer than 2017. Not that you can in many cases because lots of them are **online-only**, which means self-hosting can't save you there (unless there's a private server mod you can find like I did for old call of duty games).

### Images

This section is one of the most annoying ones to me. Images matter a lot. Capturing moments that are once in a lifetime is a regular occurance for most people. The scenery of their once in a lifetime trip. The video or photo to celebrate a performance or graduation. Their childrens first words, first steps. All of these things are incredibly important, and disasterously fragile. Most people have 1 copy of their photos, on their phone. If their phone dies, they're hooped, especially the apple side of things. I briefly used Icloud before moving over to google photos, and my main complaint is just the lack of space, at the time it was 15GB, which is less than most of my flash drives. I didn't use it enough to have the details for the sorts of complaints I have on google photos because it was functionally useless to me to begin with.

Google photos on the other hand is pretty great. Easy access to your photos, good sharing options, and a nice UI. The biggest problem with it is the price, and lock-in. Currently to use google photos you have to have [google one](https://one.google.com/about/) (as far as I know), which for 2TB of storage between images, email attachments, and documents is ~$170 as of writing (without tax). Additionally while google denies using your photos to train AI[^15] this is the same company playing with intentionally making search worse[^16] [^17] just because it can, so I'm not holding my breath. The lock-in issue is a bit more complicated.

Google will allow you to export your photos through [takeout](https://takeout.google.com/), for me this took 2 days to process, and I got ~30-50 zip files or so to trudge through between my accounts. The output formats are not terrible, except for 3 things:

1. You can't "share" your space as best as I can tell, so you and a few buddies can't chip in to get more total storage between you
2. The metadata is in this weird JSON format
3. The images themselves are just the original data, no option to compress/convert to a [better format](https://www.youtube.com/watch?v=uDydCrCXHyU)

So, after my parents ended up with the dreaded "out of space" message on their ICloud, I decided to finally consolodate all my random accounts, folders, and backups into one place, [immich](https://immich.app/). So far (besides pangolin issues) it's been great. It's a snappy, easy-to-use system that I have setup, and don't have to think about it **too much**. If I want to export my photos, they're available to export easily, no waiting. I get all the same features as google photos, but also with API endpoints I can hit to programatically use my data how I want. I know what's happening with my data, and I can audit the code myself whenever I want. 

The only thing immich doesn't solve for is my storage problem. Arguably it makes it a bit worse since thunbnails and databases are stored against my hardware directly. But, considering a new 28TB drive is currently only $460 these days[^18] that's 14x the storage density for 2.5 years subscription. If you buy a refurbished desktop to use as a NAS, and buy two drives, it's ~$1200 for 28TB in RAID 1, or 14x the data density for ~7.5 years of a subscription. I've been using Google photos for at least 10 years now, and in the last 5 the costs have doubled for me, twice. Buying this hardware up front means no one can take it from you, plus being able to run any of the other apps you want.

### Files & Documents

Document storage is a mess for me. I only really use documents (powerpoint, word, pdf) when I have to. This means I don't have a lot of them anymore. That being said, I do have some issues with the standard document and file storage cloud solutions. Google drive suffers the same cost problem as I laid out in my images since it's literally the same subscription. On top of that it's a pain to use how I want. I want to just be able to have a cloud somewhere act like an external hard drive. I don't want additional apps, and other nonsense I need to install to use everything. Cloud file servers should be nearly transparrent to the user, and act like the normal filesystem does. Unfortunately google drive is not that experience. It's clunky at best on basically every platform I've used. The only one that does okay at the user experience is one drive.

I ragged on microsoft pretty hard earlier, but when you have the ability to cheat and integrate at an OS level I will say it works well. But that working well is only when it's online. The syncing on every cloud platform is terrible. I just want something like a SMB share. A remote folder to do what I want with. I ended up with 2 solutions for this. The first is just making a remote share through true-nas; It's simple, and does what I want:

![network shares & local drives](/tech/blog/reluctant-self-hoster/drives.png)

The second is [copyparty](https://github.com/9001/copyparty). I just run it, get access to it from my browser, and I'm good to go. It's handy in cases where SMB shares are harder to do, or where I want to expose several top-level folders from a system easily. There are other solutions for people who need more, like [nextcloud](https://nextcloud.com/), [owncloud](https://owncloud.com/) or even a more productivity focused system in general like [huly](https://huly.io/). But that's not me.

#### A Quick Aside on Binary formats

The other day to make an argument [I wrote a package that does reading difficulty analysis](https://github.com/Descent098/readn). Later out of curiosity I wanted to see what level some of my old high shcool essays were at compared to my university assignments and blog posts. My university assignments and blog posts are easy, they're all markdown and on github, the high school ones though...

First of all, as far as I know all of them are on a google drive account, one that I do not know the email, or password to anymore. Likewise, even if I remembered the credentials, the likelihood the data still exists is basically 0, and if it did exist, I would need to pick which of the binary formats it ships in would annoy me the least (PDF, docx, etc.). That hurdle alone is enough that I just don't care. The microsoftization and googletization of education is just annoying, but there's a reason everyone uses them, it's easier for them, and locks you in. Both of these are not good reasons as a user to choose something, therefore document and binary data storage, and platforms built around it sucks. If you don't care about these things, and are not worried about price increases then honestly, something like google one, or microsoft 365 is probably worth it to avoid the headache around running your own instances.

### Diabetes

I am type 1 diabetic. This means I need insulin constantly, and to do so I have an insulin pump. The theory of diabetes management is pretty simple. As your blood sugar goes up you need to give insulin to lower it (normal human range is 4-7 mmol/L or 80-125 mg/dL). Here's an example of what a day might look like:

![Diabetes example](/tech/blog/reluctant-self-hoster/blood-sugar-graph.png)

Too low and you end up with [hypoglycemia](https://www.mayoclinic.org/diseases-conditions/diabetic-hypoglycemia/symptoms-causes/syc-20371525), or possibly insulin shock (which can kill you). Insulin basically allows your body to absorb glucose and turn it into fuel, if your body has a ton of glucose floating around it can cause problems like [DKA (diabetic Ketoacidosis)](https://www.mayoclinic.org/diseases-conditions/diabetic-ketoacidosis/symptoms-causes/syc-20371551) (which can kill you) or if it happens all the time you get issues with capilaries (small blood vessels) that get clogged up, and you start losing your vision and have problems with extremities (fingers, toes, and more private areas). Your blood sugar goes up with any sources of glucose. You have 2 main sources that increase your blood sugar:

1. Glycogen (stored in the liver) is what keeps you energized when you're not eating. Since we don't have insulin to absorb the glucose produced need to coutneract it with background insulin (basal insulin).
2. Food (stored in the frige \[usually\]) is where we get our glucose from. When we eat we usually preemptively give insulin to offset the inevitable blood sugar spike (bolus insulin)

Up until this year I basically just dosed myself on a set schedule in the background (basal insulin), and then had to inject whenever I ate (bolus insulin). I have been doing this for close to 10 years as well at this point. But, I was informed of newer technologies. In particular there is a community of open source developers (called [#WeAreNotWaiting](https://openaps.org/)) that have made it easier to take more control over your diabetes management ([this video with Lane Desborough a good introduction](https://www.youtube.com/watch?v=GLgUnkxb6xc)). The typical wisdom once you have your dosages dialed in is that you generally test throughout the day to see your blood sugar (stab your finger and use a glucose monitor), and especially you test before meals, and 2 hours after meals. Before meals if you're high you add that to your bolus, and if your on the lower side, you cut back on your bolus. After 2 hours insulin in theory should be mostly processed, so you want to make sure your blood sugar is not crazy high (because it will go outside the normal range often right after eating). But we have technology now, let's use it.

In particular I have a CGM (dexcom 7) and a pump (omnipod dash). A CGM constantly checks my blood sugar levels by checking the interstitial fluid in my arm. It, and my pump are mounted on me at all times, so why not let them talk to each other. After all, I'm essentially describing a calculus problem, the only thing I need are the readings. In particular the field this is in is called [control engineering](https://en.wikipedia.org/wiki/Control_engineering), and the approach taken typically for these systems is a [PID controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller). A good and simple explanation can be found [here](https://youtu.be/GLgUnkxb6xc?si=L-i6GtMy-sJPJb0A&t=489)

So, I have [Android APS](https://github.com/nightscout/AndroidAPS), a system that does just that. There's a few algorithms that exist [^19] [^20] [^21], and [this video explains the one I use](https://www.youtube.com/watch?v=oL49FhOts3c). But, all of this backends off a server called [nightscout](https://nightscout.github.io/), which is a self-hosted server that my phone connects to, which then reads my CGM via [xdrip](https://github.com/NightscoutFoundation/xDrip). Here's what that looks like

![nightscout dashboard](/tech/blog/reluctant-self-hoster/nightscout.png)

This system also lets my endocrinologist (specialist for diabetes) read everything, dosages, blood sugar readings, and system notes (i.e. pump out of insulin, or registering activity, etc.). Here's a diagram of the setup:

![Diabetes system](/tech/blog/reluctant-self-hoster/diabetes.png)

## Wrapping up

Hopefully by this point you have a sober view of self-hosting. I do not like it, it is a necessary evil, but it is an evil that has genuinely improved my life in a lot of ways. I wish I could just give people a bit of money and not have to worry about any of these things, but as I've hopefully shown, this just isn't an option often. From removing features, to limiting access, so many options are just worse than self-hosting. There are still good reasons to use cloud-based systems, reliability (sometimes), sharing, cost-benefit analysis, but where it makes sense you should try out self-hosting.


[^1]: https://support.microsoft.com/en-us/office/turn-off-disable-or-uninstall-onedrive-f32a17ce-3336-40fe-9c38-6efb09f944b0 click on the `Hide OneDrive in Windows 10/11` dropdown and it will tell you it cannot be uninstalled
[^2]: https://support.microsoft.com/en-us/office/files-save-to-onedrive-by-default-in-windows-33da0077-770c-4bda-b61e-8c8e8ca70ac7
[^3]: https://learn.microsoft.com/en-us/answers/questions/4055734/why-windows-search-opens-local-files-in-onedrive-f
[^4]: https://learn.microsoft.com/en-us/answers/questions/2723207/candy-crush-saga-keeps-reinstalling
[^5]: https://arstechnica.com/gaming/2015/05/humanity-weeps-as-candy-crush-saga-comes-pre-installed-with-windows-10/
[^6]: https://learn.microsoft.com/en-us/answers/questions/5587337/ms-account-mandatory-for-setting-up-windows-11-hom
[^7]: https://learn.microsoft.com/en-us/answers/questions/5587337/ms-account-mandatory-for-setting-up-windows-11-hom
[^8]: https://kworb.net/spotify/artist/4sD9znwiVFx9cgRPZ42aQ1_songs.html
[^9]: https://support.spotify.com/vc/article/messages/
[^10]: https://www.npr.org/2025/08/08/nx-s1-5492314/ai-music-streaming-services-spotify
[^11]: https://www.theguardian.com/technology/2025/jul/14/an-ai-generated-band-got-1m-plays-on-spotify-now-music-insiders-say-listeners-should-be-warned
[^12]: https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/
[^13]: https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components
[^14]: https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components
[^15]: https://www.forbes.com/sites/zakdoffman/2025/12/27/new-google-photos-warning-issued-for-all-15-billion-users/
[^16]: https://www.texasattorneygeneral.gov/sites/default/files/images/press/Google%20Search%20Engine%20Monopoly%20Ruling.pdf page 48
[^17]: https://arstechnica.com/tech-policy/2024/08/google-loses-dojs-big-monopoly-trial-over-search-business/?utm_source=chatgpt.com#:~:text=In%202020%2C%20Google,of%20losing%20consumers
[^18]: https://www.amazon.ca/Seagate-Expansion-28TB-External-Drive/dp/B0DW92YSB6?th=1
[^19]: https://draft-openaps-reorg.readthedocs.io/en/latest/docs/Customize-Iterate/oref1.html
[^20]: https://diyps.org/2017/04/30/introducing-oref1-and-super-microboluses-smb-and-what-it-means-compared-to-oref0-the-original-openaps-algorithm/
[^21]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8087942/

