---
title: "Revisiting: Ezcv"
subtitle: A new coat of paint on an old project
description: How I built ezcv v0.4.0 after years away
pubDate: 2025-09-12
modified_date: 2025-08-21T00:00:00-06:00
heroImage: /tech/blog/revisiting-ezcv/featured.png
tags:
  - javascript
  - web
  - frontend
  - ui
  - python
  - open source
---

It's never easy to go back to old work, espcially after a long time. Likewise in open source it's often more fun to just keep building new things, and throw old ones away. I never liked this approach, and always thought more work should go towards iterating on existing work instead of just throwing it away. As I'm wrapping up my degree I've decided to go back and clean up some old projects and improve them, starting with one of the largest projects I put together, ezcv. While technically my last commit was 2 years ago, in reality the last actual code that wasn't just a quick fix was added over 3 years ago at this point. So, this post will go through what I updated and why, as well as any tips I can impart as I go.

## What is Ezcv?

Many moons ago I decided to teach a course. For this course I decided to teach web development. I was working with a student group and I had already helped build out a beginner and intermediate course in python, and found myself wanting to branch out. I had done a lot of work in web development, and critically across different domains. I had spent plenty of time in dev ops, frontend, backend, and every end between. As part of this course I wanted to teach about static site generation, and serendipitously at the same time I was looking to build a SSG as a potential solution for a work issue. So [ezcv](https://ezcv.readthedocs.io/en/latest/) was born in December 2020. The intention was to build a static site generator that focused on making it easy for **individual people** to create a personal website, and to write it in a way that was easy enough to understand for my students. It launched with 10 themes on January 10th 2020, since then there's been 10 releases and we're at 16 included themes. 

## What I want to do differently

Initially I was just going to complete the old todo list I had for the next version of ezcv, and call it a day, after a bit of time I decided I didn't want to do that. In the time since I started this project a few things have changed:

1. I am no longer teaching; this means I don't need to use the code as an explainer for topics
2. Real people use ezcv; As of most recent stats there's [over 31k downloads](https://pepy.tech/projects/ezcv?timeRange=threeMonths&category=version&includeCIDownloads=true&granularity=daily&viewType=line&versions=0.3.5%2C0.3.4%2C0.3.3), so I need to put a bit more thought into things
3. I have more skills now; Back when I started, things like creating my own themes from scratch felt way too daunting, but I think this is a good chance to overhaul a lot of things and use better approaches than what I started with


## Themes

One of the biggest sellers for static site generators, or really any framework that's front-end focused is themes. It's the primary (and in many cases only) way that people use your system, so they need to be good. Most of the themes that exist in ezcv are from some sort of open source theme site. This was done because honestly I was just bad at frontend, and didn't care to get better. However, this has caused some issues that I'm not left with to fix:

1. Dependencies; Many of the dependencies of the themes are very old at this point. While this doesn't matter in a lot of cases, it would be nice to find some way to tackle this for integrations like [mathjax](https://www.mathjax.org/), [google analytics](https://marketingplatform.google.com/home), [mermaid](https://mermaid.js.org/) and other dynamic content systems.
2. Bloated themes; The last half decade on the web has been a wild ride. In particular lots of features that used to have to be hacked around have been integrated natively. As such writing themes should take way less code overall to do than it used to
3. Clusterf&$k Code; Because of just the sheer volume of themes I made a lot of the code is quite jank, and not very modular. It would be good to break things into peices, and practice more of the good practices I preach.

All 3 can be addressed via two mechanisms I talked about in my [jinja components](https://kieranwood.ca/tech/blog/jinja-components/) post. Currently evey template has a copy-pasted version of the same JS/CSS dependencies, where for google analytics as an example, I copied in the UA JS code into each theme manually. The same is true for [mermaid](https://mermaid.js.org/) and [mathjax](https://www.mathjax.org/). If I instead extract everything that is "universal" into a set of components, I can just include those components in the themes, and I only have to update them once for every theme instead of 16+ times. My way of doing this will be similar to how I handle the `resume.jinja` file. 

Themes currently live in [this repo](https://github.com/QU-UP/ezcv-themes), which houses all the code, but also has a [pipeline](https://github.com/QU-UP/ezcv-themes/blob/472e61a284e35e39b254bc255d947db69ca80bd1/.github/workflows/release.yml) that goes through each theme, copies the same `resume.jinja` file to it, and then zips the theme contents, and adds them to the release. This is where ezcv actually downloads "included" themes from if you don't have them locally, and avoids having to include 16 themes worth of content when installing. We can take the same principle, but include a folder called `components/general` and then inject any of those components as need. Annoyingly because of how I've setup ezcv I still have to manually update the `dimension` theme, since it's embedded in the [source repo](https://github.com/Descent098/ezcv/tree/master/ezcv/themes/dimension), but 2 updates is better than 16+. You can see this commit [here](https://github.com/QU-UP/ezcv-themes/commit/4def056b964e9d7024c9b950bf3c5321ecce3d9a).

### New Themes

I decided to create 3 new themes from scratch. With this new component architecture to hopefully make it more modular. The themes themselves ended up being relatively simple to create, but I had forgotten how hard it is to design something that can be used by **any** valid content.

#### Altair

The first was altair, a retro console/computer inspired theme. I recently switched to [omarchy](https://omarchy.org/), and fell in love with [gruvbox](https://github.com/morhetz/gruvbox) themes, which are similar to [commodore 64](https://en.wikipedia.org/wiki/Commodore_64)/[atari 2600](https://en.wikipedia.org/wiki/Atari_2600) colour schemes, so I implemented a theme with something similar. Most of this theme is centered around the usage of [clip-paths](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path) to generate an interesting shape. This is used to give some visual flair (you can draw them yourself for use [here](https://www.cssportal.com/css-clip-path-generator/)), though I will warn you they are very finicky to work with because the percentages are relative to the **current size** of the container you're in. Here was how the theme ended up:

![](/tech/blog/revisiting-ezcv/altair.png)


#### Carte

Carte was a theme idea I have had for a while, essentially a buisness-card style design. There are lots of these sorts of these already in ezcv, but I wanted to make one myself with two tones and a bunch of colours. The theme itself is quite simple, it's a SPA (single page application) style design where the content is dynamically swapped out based on [hash-links](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event). So all the content is stored in a javascript variable for the two pages, and when `#about` or `#information` the content is swapped dynamically. Here is what the theme looks like by default:

![](/tech/blog/revisiting-ezcv/carte.png)


I decided to make it possible to specify different color schemes for the theme in the config. Something I've wanted to do for a while, but never bothered to try out. It's just using simple CSS variables with an if statement, so it's quite simple in the template:

```html
<style>
    :root {
        {% if config["colorTheme"] == "rosy" %}
        /* Rosy Theme */
        --content-bg: #FFC07F;
        --primary-dark: #721121;
        --accent: #F15156;
        --primary: #A5402D;
        --secondary: #FFCF99;
        
        {% elif config["colorTheme"] == "oceanic" %}
        /* Oceanic */
        --content-bg: #F0f0f0;
        --primary-dark: #425eea;
        --accent: #e87c1e;
        --primary: #23327c;
        --secondary: #5edbdd;

        {% elif config["colorTheme"] == "straightLace" %}
        /* Straight-Lace */
        --content-bg: #F0f0f0;
        --primary-dark: #3f3f3f;
        --accent: #242424;
        --primary: #141414;
        --secondary: #c1c1c1;

        {% else %}
        /* Earthy */
        --content-bg: #FEFAE0;
        --primary-dark: #283618;
        --accent: #BC6C25;
        --primary: #606C38;
        --secondary: #DDA15E;
        {% endif %}
    }
</style>
```

The themes (besides earthy, the default you saw before) are:

**Rosy**

![](/tech/blog/revisiting-ezcv/carte-rosy.png)

**Oceanic**

![](/tech/blog/revisiting-ezcv/carte-oceanic.png)

**Straight Lace**

![](/tech/blog/revisiting-ezcv/carte-straightLace.png)

#### Xtra (TODO)

...