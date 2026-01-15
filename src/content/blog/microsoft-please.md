---
title: "Microsoft Please"
subtitle: "I just want to develop"
description: "The rapid and steady decline of microsoft products since 2020"
pubDate: 2026-01-16T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/microsoft-please/hero.png
tags:
  - project-management
  - open-source
  - ai
---

A little while ago I wrote a post about why I [self-host projects even though I hate it](../reluctant-self-hoster). It's not even been a month since I wrote that article, and a clear example of my exact complaints about microsoft has become very clear. As people could probably guess, I code a lot. Typically I code at home. Typically this is on a system with 64GB of RAM and a current gen Ryzen 7 chip. Essentially I have a lot of resources at my fingertips. 

Recently however I have been unfortunate enough to find myself having to go outside. Because of this I have been programming a lot on my laptop. My laptop (A Samsung Book 3 360) is quite powerful, it has 16GB of RAM and an `i7-1355U` (13th Gen Intel) which is [~25% faster than the CPU I started 3D modeling on](https://www.cpubenchmark.net/compare/5317vs2275/Intel-i7-1355U-vs-Intel-i7-4790K), and a 2TB nvme SSD. I consistently use this laptop to play games like [divinity 2](https://en.wikipedia.org/wiki/Divinity:_Original_Sin_II), [Batman Arkham Knight](https://en.wikipedia.org/wiki/Batman:_Arkham_Knight), [XCOM 2](https://en.wikipedia.org/wiki/XCOM_2), and emulate switch games like [Metroid Dread](https://en.wikipedia.org/wiki/Metroid_Dread) when on the train. I also frequently use it to do photo (raw and raster) and video editing, and 3D sculpting with ZBrush. It's no slouch.

So far today I have had 37 crashes. Not blue screens, but just full system freezes where I'm stuck waiting until my computer revives itself. This is not the only problem on my laptop on windows. Just in the last 2 days I've had:

- My file explorer without any other processes running takes up to 30 seconds to start on initial load
- My network driver dies occasionally. Happened 4 times today while stationary, and many more on the train which I'll give a free pass to since it's a hotspot. Sometimes it also fully turns itself off while connected and I have to turn it back on (no there isn't a key to do that automatically I checked)
- Task manager takes ages to open sometimes (I haven't timed it because I'm usually already annoyed when I have to open it)
- It takes up to 30 seconds to recognize external media (external SSD for example)

**It is not hardware**, this does not happen on linux. Even "experimental" distros like [omarchy](https://omarchy.org/) "just work". Usually with weird stuff like this I assume there's a badly behaving app. Out of curiosity I checked the memory usage:

![Memory Pressure](/tech/blog/microsoft-please/task-manager-1.png)

This graph is insane. I will explain why [a bit later on](#the-pressure-valve), but in short form my applications are using less than 4GB of RAM (closer to 3GB tbh)total. This means that windows is consuming (being generous) 9GB of RAM!

Not only that but I'm just complaining about my laptop issues. Yesterday on my **main PC**:

- Loading a font to install it locked the system up for 8 minutes
- Edge crashes every 10 tabs or so, and I have to go to another running process of it and jiggle the window to fix the problem
- Windows also disconnects my hard-wired ethernet once every ~7 hours or so
- It doesn't try to force crash badly behaving apps. I had an app hit an infinite loop and windows just let it run until it exhausted resources and then died

I want to be very clear here, I am not happy to be writing this article. I am not one of these people praying on the downfall of large companies. I like the old microsoft arrangement. Pay for a license, get good (or at least reliable) software, pay for an update. I can live with that. The main reason I stuck with windows for so long was reliability, but that ship is long since sailed, and based on recent microslop behaviour[^1] I don't think it's coming back to harbor anytime soon.

## Let Me Explore

Windows explorer is the name given to the environment that runs most of what you see. It is also tied to the system that lets you see files (called file explorer). Both of these are absolute garbage these days. 

It takes ages to open File Explorer, especially initially. This has been the case for a while, particularly after microsoft started integrating one-drive with the OS, but it's gotten dramatically worse in the last year. I genuinely do not know how they have made it this slow. I have been using [File Pilot](https://filepilot.tech/) recently, which is in beta, and is significantly faster and more efficient.

Some of you might say something like, "yes it's fast because it has less features". Okay, then lets take something simple, search. One of the core aspects of an OS is to search for files, windows is useless for this. Searching on the windows search will bring up web results (or one drive if you have it), but not my local files. So, what about File explorer? For fun I decided to search from my Desktop to see if it could find an image in this article. I left it for 11 minutes and it still didn't finish. I originally planned to shill [everything](https://www.voidtools.com/) here because I like it, but for fun I tried File Pilot expecting similar results:

![File pilot search](/tech/blog/microsoft-please/fp-search.png)

1.86 seconds. 

I cannot express how mad I am about this. File Explorer at idle consumes ~150MB, File Pilot is ~5MB. There is no competition, this is pathetic.

## The Pressure Valve

I mentioned memory issues earlier. The cynical amongst you are probably wondering what the details of that situation were, so I grabbed them as well:

![Memory Pressure](/tech/blog/microsoft-please/task-manager-2.png)

I don't know where 45 edge tabs, or 33 VS code tabs are, but certainly not on my system. I have 2 instances of VS Code with 2 files open in one, and 3 in the other. I have 10 edge tabs and 8 extensions installed, so not sure where the other 27 processes are living. Both of these two peices of software are **also microsoft developed**.

Even if we ignore that issue and look at the total ram usage, every process in that list totals to <3.5GB, so where is the rest? Well, windows. In my experience windows consumes about 7-10GB of RAM at idle (even on fresh windows installs). In this case it's closer to the 9GB mark. To confirm this was windows doing this I ran [Microsofts PC Manager](https://pcmanager.microsoft.com/en-us), which goes through and cleans up a ton of things, namely in this case microsoft stuff. Running it purged 2GB of memory (temporarily). There's an old addage in operating systems that unused memory is useless memory, this addage is idiotic for multiple reasons: 

1. **It assumes useful things are being cached**: I do not know what is being cached considering how slow all the system apps are. The settings panel alone takes up to 20 seconds to launch, file explorer takes even longer sometimes, everything is just slow
2. **It doesn't account for re-allocation cost**: When memory being used needs to be re-allocated it costs, **a lot**. CPU's are so fast these days that the majority of the time spent in many operations is in I/O overhead to system memory or the disk. Leaving users with less than ~%30 overhead (unless they have insane amounts of RAM) means there will be re-allocations constantly due to the unpredictable nature of usage sometimes
3. **Power Draw**; Memory in general doesn't occupy a ton of the power budget of a machine. Likewise as far as I know filled vs empty ram has no effect on power draw. But, if you add in whatever nonsense processing is happening in the background to cache and maintain all this (seemingly useless) data, it certainly will waste power on your battery

## Tic Tok

I have stuck with microsoft for reliability. My argument in the past was that microsoft products both work, and have the tools you need baked in. But on top of the operating system going to shit the system apps are following. I have a watch with a timer on it, but it only lets me do 1 timer. I didn't want to use my phone because I'm in public and didn't want it to ring. Instead I decided to use the built in clock app.

The clock app will ring and popup a notification, but on mute the notification is the only thing that shows up. So, I quickly popped open the clock app:

![Clock Updates](/tech/blog/microsoft-please/clock-update.png)

10 Minutes.

Set an alarm for 10 minutes and sit doing nothing until it rings. It took 10 minutes to update a clock app. 10 minutes that I could not use the app while it downloaded for, and it ran the update automatically. Looking online apparently some people have had issues with it erroring out mid-update and being left without a working app. 

Keep in mind again that we're talking about a glorified timer, alarm system, stop-watch, and clock display. That's everything it has in the app. It seems like the update was actually from a while ago when microsoft decided to integrate "focus-sessions" into the app

![Focus Sessions](/tech/blog/microsoft-please/focus-session.png)

Well at least it seems useful. You can basically schedule a do not disturb session, which is quite handy. It was surprising to me you couldn't already do this...

![Do not disturb mode](/tech/blog/microsoft-please/dnd.png)

Oh, you could already set it to run automatically. I see. 

Also shout out to microsoft for deciding to put my email on my settings page so I don't forget. Really handy if I'm screen casting and open my settings that anyone can see it, and that you've barred (or tried to) new local accounts[^2][^3] so having an associated email is a requirement now.

## Conclusion

Microsoft needs to re-evaluate their whole development approach to windows. Not only have they stagnated, but they are going backwards, and no number of products all called copilot can save them. This is not good. Even if you hate microsoft you need to understand that the downstream effects will harm you. Airports, restaurants, enterprise, logistics, medicine, all of these industries rely heavily on windows, and they are all beginning to atrophy with it. Even if they wanted to change to alternatives it would take decades at this point, and the whole time the users will suffer. Do better microsoft.

[^1]: https://www.cnbc.com/2025/04/29/satya-nadella-says-as-much-as-30percent-of-microsoft-code-is-written-by-ai.html
[^2]: https://learn.microsoft.com/en-us/answers/questions/5595775/since-windows-11-is-phasing-out-local-accounts-how
[^3]: https://www.reddit.com/r/pcmasterrace/comments/1o00spu/microsoft_is_plugging_more_holes_that_let_you_use/
