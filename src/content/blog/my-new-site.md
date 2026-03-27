---
title: My New Site is Half A Gig, and Its Never Been Faster
subtitle: ...
description: ...
pubDate: 2026-03-27
heroImage: /tech/blog/annoying-side-of-astro.png
tags:
  - astro
  - web
  - javascript
  - css
  - js
  - html
  - frontend
  - ui-ux
  - design
---

TODO: UPDATE IMAGE

I have quite a few websites. Some are client sites, but most are personal sites, or documentation sites for open source projects. At the root of my domain is [my personal website](https://kieranwood/ca). As much as I like making content about technology, whether it's courses, or posts like these, I do not like making things about myself. I already have to spend enough time with me, and writing a whole website about myself always felt odd. 

## History of the Current Site

I created my site initially because... well, because. Essentially I knew it was something a lot of people do. I also evidently needed a root website for my github pages so I could spin off sub-pages for my other projects. This meant that beyond being a generic portfolio site, I put little to no effort into planning it.

### How I built my existing site

Initially I was playing around with a template I found online, mostly just messing around with it here and there for a few days, and decided I did not like it. After that I decided because this was low priority I was going to give myself a weekend when I was back from vacation to build out the site, and just upload whatever I had. So, on January 4th 2020 I grabbed a template from [pixelarity](https://pixelarity.com/), spent a few hours familiarizing myself with the code, then started gathering and filling in some content. I finished the content by that day, but decided to wait a few days to see if I wanted to add anything else, and uploaded it on January 7th 2020. The whole site was just static files dumped into the master branch of a repo, and served via [github pages](https://pages.github.com/). So, how well did this work?

This approach served me suprisingly well. I haven't touched my personal website in 6 years, and that's not an exaggeration:

![screenshot of my github repo](/tech/blog/my-new-site/github-screenshot.png)

I really haven't needed anything more from it, and by how irrelevant the current content is, it's clear it hasn't been a priorty. So, what changed?

## Why Rebuild

As much as I don't like making a site about myself, there are tons of benefits to having one. Namely, having a kind of hub to point people to get information about myself, which has come up a lot at events recently. For most people I just tend to send them to github, or linkedin, but as I'm sure is suprising to some, I don't just code. I have other interests, and those have come up in conversations several times with no good way to share them with people. Likewise, these days I don't just have a few projects, I have a lot, and I have no idea which ones people care about. So, I basically needed a site to:

1. Make it easy for potential employers to get a work history about me
2. Act as an aggregator for various educational blogs and wiki-style projects I run
3. Have an easily searchable list of open source projects 
4. Have some way to display information about my projects that aren't code related
5. Provide an easy contact method for people to ask questions after presentations and/or reach out for other networking purposes

Now I knew what I wanted it to do, it was time to refine what I wanted.

## What Matters Technically

Bluntly, this new site is still not very important to me. But, with what I wanted I wasn't going to be able to build it out properly in an afternoon again. Instead I gave myself a one week deadline to build everything. This will come up later since some of the choices I made were in the name of getting things done first and foremost.

In the same vein, I wanted my site to be as **low effort to maintain** and update as possible. The content on my current site was out of date months after I wrote it, so I needed a system that automates a bunch of this, and holds my hand on whatever can't be automated. Ideally whatever schema I decide on should be enforced with proper error messages, and fail-fast. That way I can reliably make changes without worrying I silently broke anything.

To get started there were a few easy choices to make. I don't want a server. I want static files that I can build once and deploy anywhere. I have heard people complain about static site generation and it's limitations. Having built well into the 100s of sites I have yet to actually see their complaints pan out, so static site generation it is. It will be a suprise to no one who has read any of my other work that I went with [Astro](https://astro.build/). [Sveltekit](https://svelte.dev/docs/kit/introduction) with the static adapter was a close second, but Astro is hands-down the best SSG for content-driven sites I've used. 

From there my plan is to build/rebuild it once every week or two via a CI/CD pipeline. This is basically going to be to refresh my planned RSS feed aggregation. Obviously I could do this aggregation client-side, but there's something I find appealing about something **really** being static, and frankly if someone wants a more real-time update than that they can just subscribe to the RSS feeds on each site themselves.

One probably odd choice I made is to **re-use as much of my exsting design** as I can. Ideally at a first glance I don't want it to be obvious I rebuilt the site at all. Part of my reason for doing this is speed, but another is that I tend to work a lot with legacy systems. I like being able to breathe new life into something that exists, and the creative challenge of revitalizing something instead of just throwing it out. As I'm building this site I am also going to try to keep my components more design neutral. This will let me easily shift into a new design if inspiration strikes me for a design I really like down the road and decide to go another direction.

Performance might seem odd to talk about with a static site, but you would be surprised what I've seen. So, to start out with on any site my general principle is that no pages should go over 2MB total payload unless you have a very good reason. In particular **you should almost never be cracking 1MB initial page load** unless you're doing something very media heavy. If your JS bundle is over a few hundred kilobytes you really need to look deeper at what's going on. Likewise, this is a static site, it should not be eating your resources. In general there probably should be little-to-no processing being done at all, which is why even though I love [svelte](https://svelte.dev/), it, or any other UI framework is wholly unnecessary for this project. 

## The Process

So, decisions have been made, and what matters is more clear, let's get to building. I started by firing up a new Astro project, and dumping what existed into it. The design of the old site is a single page with 5 tabs that open a modal-style screen with content on it when you click the nav links:

![screenshot of the site](/tech/blog/my-new-site/existing-site.png)

![mini-walkthrough of the site](/tech/blog/my-new-site/existing-site-nav.gif)

I went through each tab, and decided what I was going to keep or remove:

- Canadian Coding; This is no longer necessary. This was the brand name I used to use to create content under, and would use as a funnel for freelance work. I haven't been actively taking contracts for years now, and haven't been posting enough content to justify it having it's own section.
- Work; I will probably keep this section, but with major changes, right now it's a combination of open-source and professional work, and I want to split the two more cleanly
- About; This section contains no real useful or up-to-date information. Frankly I don't think I need anything like this in the updated site
- Contact; This one's actually pretty good outside of some UI bugs. I think this is the only section that will have essentially no changes
- Resume; I have had no end of troubles with having my resume directly posted on my site, so going forward I have no intention to keep it here

So, basically 2/5 will stick around, and the rest are empty slots to play with. I ended up with keeping the work and contact section, and three new sections:

- Mentorship; A collection of all my education content in it's various capacities
- Projects; A listing of all my open source work
- Other; For non-coding related content and details. Much more of a strictly "personal" section 

Before breaking down the building of each section I wanted to identify my main mistakes and overall architecture plan. So, I popped open the inspector on my current site:

![screenshot of my current site inspect tab](/tech/blog/my-new-site/old-site-inspect.png)

Now I had some numbers. The initial page load is 2.6MB the breakdown of which was:

- ~1MB was split between just 3 images which are the heading images of some of the sections
- The next two most expensive resources were the two fonts being loaded at ~75KB each
- The most expensive scripts were the google analytics script at ~120KB and jquery at ~30KB

Additionally, some of the scripts and assets were taking up to half a second to process. I made a few quick choices based on this data:

1. I hadn't looked at my analytics dashboard in years. It's baked into cloudflare these days to get view stats, so that was removed. 
2. I needed to fix the font situation, it shouldn't take that long to process a font
3. I needed to do better with image optimization. One of my main hobbies is photography and 3d-modeling, so I wanted to show off some of my images on my site. 
4. I needed to see if I really needed JQuery. The template was older when I got it, and many people from that era used it long after [query selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) existed to do functionally the same job

Now I had to decide how I wanted the overall architecture to look. I briefly considered doing view-transitions instead of the hide and show system that currently existed, but a lot of the styling and existing JS relied on that structure and I didn't want to re-tred all that effort. I decided to create a `<SectionTemplate>` component, which I could use to scaffold out the modal (acutally an `<article>` with an ID and class).

## Throwing Some Numbers at You (TODO)


