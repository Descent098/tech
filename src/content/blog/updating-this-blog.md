---
title: Rebuilding this site
subtitle: ...
description: ...
pubDate: 2026-04-10
heroImage: /tech/blog/mobile-is-desktop.png
tags:
  - astro
  - web
  - javascript
  - css
  - html
  - frontend
  - ui-ux
  - design
  - performance
---
TODO (UPDATE IMAGE, TAGS AND DESCRIPTION)

After the success of [updating my personal site](https://kieranwood.ca/tech/blog/my-new-site/) I decided to start rebuilding some of my other sites, including this blog. Unlike my other site, I decided to do the work in peices. Updating little bits at a time, spread out over time. 

## Taking inventory (TODO)

Unlike my other rebuilds I decided to take a less structured approach. I am actually writing this sentence on April 5th 2026, and as it stands I have some vauge plans, but nothing concrete on what needs to be done. My intention is to start by cleaning up the structure and the content. The first thing will be a need to lock down my schemas more effectively. No more string fields unless necessary, everything needed to have set types. I just decided to enforce an enum on a bunch of mye schemas instead of allowing strings, and updated all my content to match the new schema ([this commit](https://github.com/Descent098/tech/commit/afe6244cb98939fd9ce7086b1aa71efdc1f1b98b)). This ended up being a lot of total line changes, but with find-replace the whole process took ~15 mins I've just been too lazy to do it for a year or so. This is also laying the groundwork for a new set of features that I'm considering down the road including filters by languages, and frameworks/libraries on top of just normal tags. I will need to re-vamp all the content in various passes over the next little while like doing image optimization (which will be the biggest), and swapping over to `.mdx` for a bunch of files so I can use other components for my demos. 

Structure-wise, the site looks lovely, but I hate the code. Because it's been through so many versions there's just a lot of cruft, and things are done in ways I don't like. This aspect will probably be a full-rebuild. I know I no longer need a lot of it, and I really don't like using tailwind for styling these days. Eventually, I'll probably tear the styling to studs and re-do the whole structure. On top of this I will be making heavy use of RSS, both to import posts from other sites, and make the feed of posts from this site available more easily. I will probably re-use a lot of the tooling I have from my personal site to set all this up, or look into better ways of doing it on-client to avoid the scraping issues I've been seeing recently. Lastly, [mermaid](https://mermaid.js.org/), fucking mermaid. I love the library so much, but it's an utter nightmare on Astro sometimes. I haven't bothered to do a full proper deep dive into fixing it, so ~1/8 requests will fail to render the diagram properly. I will conquer this issue on this rebuild if it kills me.

As of writing, that's the gist of my plans, everything else will come as it comes.

## What I did (TODO)

This whole process actually more or less started over a year ago. I spent a bit of time updating dependencies, and fixing little things I forgot to change from the original template (like [this commit](https://github.com/Descent098/tech/commit/91f2e3c15212307bf1326e9166959f3c5cb8d916)). The [initial version](https://github.com/Descent098/tech/commit/dfef24b0be1a44315c080a37a6539e016da78b46) started on version 3, so there's been a fair bit of effort to move it from there to version 6 (the current one) over the years. In particular, I'm much more familiar with the mothods Astro has for handling your content than it did when I started. For example I started noticing I had to do a ton of little annoying spelling changes in tags (like this [commit](https://github.com/Descent098/tech/commit/2d037e4a9bf75aac51d3885415283943bafec0d2)). Likewise my dates were having issues, and just a bunch of small things. So, I decided to lock down my schemas. 

At the end of last year I added better support for cross-linking posts from other sites (this [commit](https://github.com/Descent098/tech/commit/f09125ac9382516d47daf303c3774eda7fe1dfb3)). I made a few improvements with this over time, but when I was recreating my main site I realized I needed an easier way to import posts from my other sites. With everything I have being more interconnected it massively reduced the burden of updating and shifting content around. This meant for this blog I needed a way to export that data easily. The natural choice for this is an RSS feed, which I added a while ago for my site, and have been steadily improving. 
