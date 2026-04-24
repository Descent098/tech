---
title: Local Compute Crisis
subtitle: ...
description: ...
pubDate: 2026-04-25
heroImage: /tech/blog/annoying-side-of-astro.png
tags:
  - hardware
  - open-source
  - performance
  - opinion
  - cloud
---

I've been building computers since 2013. They've come a long way, so long that I don't know if owning a high-end computer will continue at this point, at least not in the forms it has for a few decades. The glory days of rocking up to a store and buying the top-end hardware to spec out a mini datacenter to run in your house might be behind us. Laptop or desktop it's been the case that many of the systems people own are far more powerful than they can (or actually do) use. Most of the perceptual "slowness" of machines is driven by other factors such as UEM/[tattleware](https://en.wiktionary.org/wiki/tattleware#:~:text=%5Bedit%5D-,tattleware,-(uncountable)) software, malware/adware, poorly written software, etc. Most "slow" machines get a %20-60 by just reinstalling the OS fresh and doing driver updates. By my rough estimate, probably around 2018 was when the **hardware** side of things got good enough that most users would never need more. In general I would say that if I had to freeze my hardware choices to what I currently have for the rest of my life, I could probably get along just fine (assuming software support). I have more demands than the average person, and the hardware probably topped out for me around 2020 ish. For reference, the Ryzen 9 5900x from 2020 was a 3.7-4.8GHz processor with 12 cores, 24 threads, and a 105w tdp with 64MB of L3 Cache. At 6 years old as of writing, it's still more than enough.

This article is here to argue the premise that having a massive home desktop machine, or single high performance laptop that can handle the most demanding workloads such as AAA gaming, and AI is probably dying. Some of this is being driven on a profit basis by various forces coallescing, some of this is much more pedestrian and pragmatic. To get it out of the way, I don't like the idea of not owning your hardware. But, I think it's worth taking a sobering look at reality and see where the argument that people can (not should) just be essentially using [thin-clients](https://en.wikipedia.org/wiki/Thin_client). 

*This post has sections that are much more conspiratorial than my typical ones, and is moreso a sharing of my options, but I think it's a conversation worth having, so here we are.*

## Phones

I [wrote recently](./mobile-is-desktop) about how powerful mobile-class computing is. It has exceeded what was expected of even desktop-class systems years ago, muddying the waters on what these definitions mean. When I got my first SSD I went from a 4 minute boot time to 20 seconds. These days my BIOS checks take longer than the OS loading. Phones as a consequence have become little pocketable desktops. People probably haven't noticed a **real** difference in their phones (if they upgrade every year) for ~5 years. This alone would be an indication that if something were to happen that caused a [tightening of the belt](https://www.theidioms.com/tighten-belt/), as a manufacturer you could effectively downgrade many device SKU's with little notice from consumers. In an ideal world this would mean people holding on to their devices for longer, and not just being on a perpetual upgrade cycle, but that's not happening anytime soon. We are already seeing the beginnings of this in the stagnation of many devices. 

As an annecdote (best kind of evidence) I recently bought a used S24 ultra, which is 2 generations behind the "flagship" option. This phone does everything, I used DeX to do development work, I've emulated switch games, hell I even setup gamenative and played Subnautica on it. Having seen and used the S26 ultra (briefly to be fair) in real life, there's almost no difference. The hardware, in particular the cameras over the years, have gotten worse, and been compensated for by software. It's been a few years now since Samsung [dropped the 10x sensor](https://www.androidauthority.com/galaxy-s23-ultra-vivo-x200-pro-10x-camera-shootout-3524563/), and people didn't care enough not to buy the phones then either. The hardware even here has gone beyond "good enough". 

Some things are logistically not possible on phones. Everything that is seriously computationally expensive (like AI processing) on phones is already [done remotely](https://eu.community.samsung.com/t5/samsung-lounge/galaxy-ai-on-device-vs-on-the-cloud-features/td-p/14022719#:~:text=Cloud%2DDependent%20AI%20Functions), even on the high end devices. This leads to the question of why these top end devices are offered. Most people don't even do 1/3 of what I do, and I consider myself not a very serious user (I spend 1.5-3hrs a day on high usage days). The s26 ultra with 512GB is currently $2179.99 pre-tax, and it performs essentially identically to my S24 Ultra which cost me ~$650 from Best Buy. If Samsung and Apple tomorrow decided they would just re-release their phones from last year, with no changes, people would still flock to them. If they downgraded them %10, they would still flock to them. If they downgraded them %5/year for the next 5 years, people would still flock to them. So long as the software experience is basically the same, most people just go with an upgrade at the end of their term, and never look back.

People have already demonstrated they don't care about ownership. Most people tend to get their phones on a contract. A contract **is** already not owning your phone. It's **very** rare you get to keep the phone at the end, so people are already just renting their phone. With more and more "off-device" features manufacturers are learning people are already willing to pay for more subscriptions. So, what if they just re-released an old phone, charged the equivalent of $700 for it, but added a $100/year subscription service to stream games, store images, rent movies, and some AI tokens for fun. As a manufacturer this looks **very tempting**. SAAS products **print money**, and if you can take a small upfront loss, you can gouge people later. Now you can make money regardless of the annoying complexities associated with hardware manufacturing. You can optimize the same device manufacturing processes over years and years instead of single runs, and most people will just put up with it. This is especially benefitial when you consider the **real** market differentiator these days, server hardware...

## Efficiency (TODO)

Server hardware has gotten much more efficient, and powerful. Cloudflare recently was talking about their [gen 13 servers](https://blog.cloudflare.com/gen13-config). 1300w PSU for 192 cores and 768GB of RAM. 1300w might sound like a lot, and it is, but consider that consumer grade gaming systems often use that same hardware for a single device being used by a single person. Consider [this build guide with 6 million views](https://www.youtube.com/watch?v=s1fxZ-VWs2U) that recommends a 1000w PSU. I have a 16 core 32 thread server with 64GB of RAM at home (nearly 10 years old at this point), and it powers image management, video playback, [CGM readings](https://www.diabetes.ca/DiabetesCanadaWebsite/media/Managing-My-Diabetes/Tools%20and%20Resources/Continuous_Glucose_Monitoring_Advocacy_Pkg_4.pdf?ext=.pdf) ([nightscout](https://nightscout.github.io/)), ephemeral VM's, and about 10 other things. A server like the gen 13 could easily serve thousands of people, if not tens of thousands per-node depending on it's use case. At the cost of data/processing sovereignty, but people don't care much about that anyways these days. If we consider how low most people's usage tends to be of the most computationally expensive features a company like samsung might 1-2 of these per city, with a fallback dozen racks or so elsewhere. Limit people to a few images a day, rate limit during your busiest times, and you're good to go. 

I'm being a bit glib with how simple I'm making it sound, but the economics of scale are undeniable. Centralizing compute massively saves on cost. It also makes revenue more predictable since if people want to keep using, they need to keep paying. For anyone who hasn't done anything like this, here's an incredibly simple example. I have had upwards of 30 websites over the last 10 years, and I have paid ~$30 (+ a few domains cost) for them (forgot to cancel heroku when they no longer had a free tier). The compute is essentially irrelevent, so irrelevant that it's free. If I were to instead make those each individual apps that need to be updated, pay developer license fees to apple + google + microsoft (windows store), and even then some old phones with powerful enough hardware just crap out randomly. The web allows me to abstract away all those issues to just making sure the user has a browser. The same is the case for most services. If me and 23 other people only use ~1hr of compute a day, that can (theoretically) be done by a single machine. Not to mention, server hosts are often as underutilized as people's individual devices. Having my own server running 24/7 is a waste. I get a few thousand visitors a day, total compute time is probably less than an hour, and even then it's probably only a few % of a single core. Wasting energy on maintaining a host is just a waste of resources compared to centralizing it all under a provider. This efficiency is a seriously hard problem to contend with if you think people should all have their own machines running their own instances of apps. 


## Mobile is Desktop (TODO)

- Minisforum and laptops becoming desktops
- Macbook neo
- Samsung dex

### Gaming

- handheld consoles
    - Switch 2
- Game streaming services
    - Shutting down
        - Stadia
        - Luma
            - https://www.youtube.com/watch?v=ELmChif1VNw
- 

## AI (TODO)

- If you have local LLMS you won't pay for cloud usage
    - More conspiratorial to accept
- STRIX/unified memory
- Mini PC capability
    - NPUs
### A good chance to lie (TODO)

As a side note it's useful to know that the "memory crisis" is largely manufactured by the manufacturers. Lots of the deals never went through, and like they have in the past [^NEED CITATION HERE] they are likely just lying about their capaci

