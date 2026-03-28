---
title: My New Site is Nearly A Gig, and Its Never Been Faster
subtitle: ...
description: ...
pubDate: 2026-03-27
heroImage: /tech/blog/my-new-site/hero.png
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
  - performance
---

I have quite a few websites. Some are client sites, but most are personal sites, or documentation sites for open source projects. At the root of my domain is [my personal website](https://kieranwood/ca). As much as I like making content about technology, whether it's courses, or posts like these, I do not like making things about myself. I already have to spend enough time with me, and writing a whole website about myself always felt odd. 

*This article is quite long, largely because of big screenshots, but if you're just interested in a short TL;DR of the results skip to [this section](#throwing-some-numbers-at-you)*

## History of the Current Site

I created my site initially because... well, because. Essentially I knew it was something a lot of people do. I also serendipitously needed a root website for my github pages so I could spin off sub-pages for my other projects. This meant that beyond being a generic portfolio site, I put little to no effort into planning it.

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

Bluntly, this new site is still not very important to me. But, with what I wanted I wasn't going to be able to build it out properly in an afternoon again. Instead I gave myself a one week deadline to build everything (which I ended up sick for 3 days of). This will come up later since some of the choices I made were in the name of getting things done first and foremost.

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

Before breaking down the building of each section I wanted to identify my main mistakes from my current site, and build an overall architecture plan. So, I popped open the inspector on my current site:

![screenshot of my current site inspect tab](/tech/blog/my-new-site/old-site-inspect.png)

Now I had some numbers. The initial page load is 2.6MB the breakdown of which was:

- ~1.2MB was split between just 3 images which are the heading images of some of the sections in total there are 11 images
- The next two most expensive resources were the two fonts being loaded at ~75KB each
- The most expensive scripts were the google analytics script at ~120KB and jquery at ~30KB

Additionally, some of the scripts and assets were taking up to half a second to process. I made a few quick choices based on this data:

1. I hadn't looked at my analytics dashboard in years. It's baked into cloudflare these days to get view stats, so that was removed. 
2. I needed to fix the font situation, it shouldn't take that long to process a font
3. I needed to do better with image optimization. One of my main hobbies is photography and 3d-modeling, so I wanted to show off some of my images on my site. 
4. I needed to see if I really needed JQuery. The template was older when I got it, and many people from that era used it long after [query selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) existed to do functionally the same job. After digging, no I did not need JQuery anymore.

So, before even touching any content, just removing JQuery, analytics and the three heading images I didn't want to use took us from 2.6MB down to a bit over 1.5MB. I completely forgot about the font issue until the end of the site build, which luckily right as I started this project [version 6 of Astro](https://astro.build/blog/astro-6/) was recently released, and I tried out their new [font API](https://docs.astro.build/en/guides/fonts/), which fixed everything. I also removed [font-awesome](https://fontawesome.com/) entirely and swapped over to [bootstrap icons](https://icons.getbootstrap.com/) + [svgrepo](https://www.svgrepo.com/) for all my icons. I left the `main.css` file fully intact other than the changes to remove and update the fonts. Lastly I moved the remaining JS files into imports on the page, which means they will be processed by [vite](https://vite.dev/) and properly minified + [treeshook](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Astro takes this a step further actually, any file that is importable without a [script directive](https://docs.astro.build/en/reference/directives-reference/#script--style-directives) will be compiled away at build time. 

Now, after this optimization pass I had to decide how I wanted the overall architecture to look. I briefly considered doing view-transitions instead of the hide and show system that currently existed, but a lot of the styling and existing JS relied on that structure and I didn't want to re-tred all that effort. I decided to create a `<SectionTemplate>` component, which I could use to scaffold out the modal (acutally an `<article>` with an ID and class). I can then create individual components for each section, and any necessary sub-components inside those. So, the layout was essentially:

- `public/`; A folder that contains assets that should not be pre-processed (certain images, css, favicon, etc.)
- `src/`; The folder where all the actual code will live
  - `components/`; Where any sub-components are defined for the various sections
  - `data/`; A folder to hold content for various collections (more on this later)
  - `layouts/Layout.astro`; The base template that the `index.astro` page inherits from. Contains things like the `<head>`
  - `pages/index.astro`; The definition of the homepage structure
  - `section/`; The files for each individual section (i.e. `work.astro`, `projects.astro`, etc.)
  - `styles/main.css`; The old `main.css` file that contains a bunch of global css declarations
  - `utils/`; Folder that contains the old JS files from the initial project, and a `ts` file for handling RSS feed parsing (more on this later)
  - `content.config.ts`; The configuration for [content collections](https://docs.astro.build/en/guides/content-collections/) essentially defines all the content schema

Now it was time to start building.

### Contact

This section was the easiest to rebuild. I just had to change some wording, and fix a weird height bug with one of the input fields for the contact form. All of the form submission is handled by [formspree](https://formspree.io/) and has been for a long time with no issues. I fired a quick test email to make sure we were all good. The only other thing I needed to do were the icons. For this I chose a less than optimal aproach. I added an enumerator of all the various platforms to my `content.config.ts` file:

```ts
import { z } from 'astro/zod';

const platforms = z.enum([
    "github","linkedin","youtube","instagram","email","unsplash","docs","artstation","generic"
])

export type SocialPlatforms = z.infer<typeof platforms>
```

I then setup a somewhat janky `<Icon>` element. As far as I know you can't use switch statements in astro, so instead I included separate conditional rendering statements for each icon:

`src/components/icon.astro`
```astro
---
import {type SocialPlatforms} from "@/content.config"

interface Props {
  URL: string;
  platform: SocialPlatforms;
  label?:string // Only applicable when using generic as a platform
}

const {URL, platform, label} = Astro.props
---

<a href={URL} class="icon" target="_blank">
    {platform==="github"
    && <>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
              {/* rest ommitted for brevity */}
            </svg>
            <span class="label">GitHub</span>
        </>
    }
    {platform==="linkedin" 
    && <>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
              {/* rest ommitted for brevity */}
            </svg>
            <span class="label">LinkedIn</span>
        </>
    }
    {/* rest ommitted for brevity */}
</a>
<style>
    /*Styles ommitted for brevity*/
</style>
```

A typehinted easy-to-use component. I've handled this in other ways in the past that were a bit fancier, but for ~10 total options this works fine. That was it for this section.

### Work

I've always found it hard to write about my work. Wherever I work I tend to do quite a large number of random projects, and start a fair number of initiatives. My job often ends up creeping outside the initial job description very quickly as I tackle whatever is most useful at the time. Likewise, I've had a lot of experience in various different areas, some hardware based, some software, and some client/business focused. I've learned that no one wants to read all that. So, instead I need to create a display that helps collapse a lot of that data down to a few bullet points. The traditional thing to reach for is an accordion in this case. I wanted something a bit nicer than just a bunch of accordions, so instead I made a timeline of accordions in reverse-chronological order:

![work section](/tech/blog/my-new-site/work-section.png)

This then collapses down to a bunch of boring accordions on mobile, but the point stands that I think this looks nicer. Content-wise I limited myself to 3 bullet points per section of experience. I will probably go back and tweak some of these as I think of better things to put there, but for now I'm happy with how this section turned out. It's a good balance of brevity, while still surfacing the information most people will care about. I did intentionally forego some of the traditional things people would put in a section like this, largely because I don't know that they're very valuable. I didn't put a progress bar of all my skills, or come up with an arbitrary ranking system for all my languages, I kept it nice and simple, with the option for people to reach out if they want more specific details. 

For those wondering the reason I don't have a resume readily available on this site is because not even a week after I put a resume up last time I got endless spam calls. I've also found I have enough things to put on a resume that it's better for me to craft my resume to what the employer is looking for, and not just a firehose of all the random things I've done. Some people will disagree I'm sure, but I've personally never gotten a job offer from the resume I had on my old site. Typically, I have people who reach out to inquire after using one of my projects, or meeting me in person, but everyone's experiences and opinions on this will vary I'm sure. Feel free to reach out via [the contact form](https://kieranwood.ca/#contact) on the new site to express your opinion 🙂.

### Projects

This section is the first one that ended up being large enough to warrant a proper collection schema, and separate files to define each project. There are a number of helpful features baked into Astro that I wanted to take advantage of. In this case it was being able to defne enums as part of the schema definitions for the file metadata. That was a bit of a mouthful, so let's work through it. In my `content.config.ts` file I can define a few enums:


```ts
import { z } from 'astro/zod';

export const projectTags = z.enum([
    "cli",
    "presentation",
    "education",
    "template",
    "web",
    "library",
    "script",
    "security"
])

export const languages = z.enum([
    "python",
    "astro",
    "go",
    "js",
    "rust",
    "java",
    "php"
])
```

I can then add these enums (and the `platforms` one for the `<Icon>` component we defined earlier) as part of the schema definition:

```ts
import { z } from 'astro/zod';

z.object({
    title:z.string(),
    description:z.string(),
    links: z.array(z.object({platform:platforms, url:z.url()})).optional(),
    tags:z.array(projectTags).optional(),
    heroImage:z.string().optional(),
    languages:z.array(languages),
})
```

This means if we improperly spell a platform, language, or tag for a project we will get a **build time error** telling us which field is invalid. This is a great start, but we can also do the same for the image to make sure it's available at build time. [I have a whole post] about images I wrote that helps explain some of how Astro handles images, but for now consider it magic. I will just show off the full definition below, and hopefully it will be more obvious:


```ts
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection(
  {
    loader: glob({pattern:"**/*.(md|mdx)", base:"src/data/projects"}),
    schema: ({ image }) => z.object({
              title:z.string(),
              description:z.string(),
              links: z.array(z.object({platform:platforms, url:z.url()})).optional(),
              tags:z.array(projectTags).optional(),
              heroImage:image().optional(),
              languages:z.array(languages),
            }
          )
  }
)

export const collections = {projects}
```

So, for example a project will look something like this:

`src/data/projects/ahd.md`

```md
---
title: "ahd"
description: "A cli to create namespaced macros in your terminal"
links: [{"platform":"github", "url": "https://github.com/descent098/ahd"}, {"platform":"docs","url":"https://ahd.readthedocs.io"}]
heroImage: "./../../images/projects/ahd.png"
languages: ["python"]
tags: [cli, script]
---
```

Every field in the frontmatter will fail-fast at build time if it's not valid now. Then when we go to build with the collection it gets pretty easy, we just do something like:

`some-file.astro`
```astro
---
import {Image} from "astro:assets"
import { getCollection } from "astro:content";
const projects = await getCollection("projects");
---

{projects.map((project)=><>
  <Image src={project.data.heroImage!} alt={project.data.title} height={140} width={140} loading="lazy">
  <h2>{project.data.title}</h2>
  <p>{project.data.description}</p>
  {project.data.links && <ul>
    {project.data.links.map((link)=><li><Icon platform={link.platform} URL={link.url}/></li>)}
  </ul>
  }
</>
)}
```

With the data layer put in place I decided to make 2 components, a featured project gallery that showed an image and highlighted certain projects, and a projects data table with filtering and nice-to-haves for sorting the bulk of the info:

![project section](/tech/blog/my-new-site/project-section.png)

Down the road I plan to add an RSS feed of these projects so my other sites can import it, and I can just have one source of truth for everything going forward. I tried **so many** designs for ths section, and I'm still not massively happy with it. In particular the datatable on mobile is not ideal, but I spent a lot of time on this, and decided to cut my losses on this version. It works well, but it's something I'll definitely be itterating on in the future. 


### Mentorship

After building the projects section I decided to try something different. I didn't use the markdown part of the markdown collection for projects at all, so for this section I wanted to try using a JSON file. Essentially this section is just an overview of a few of my sites, with a notice to check out the projects page for more resources. The main "feature" of this section is the RSS aggregation. Essentially I wanted the ability to manually specify some highlighted posts, then import a feed of the latest ones automatically on build. To do this it would just grab the RSS feed from a URL provided, parse it, and dump the info as a link with the post title. The schema for this section was pretty simple:

`content.config.ts`
```ts
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const blogs = defineCollection({
    loader: file("src/data/blogsites.json"),
    schema: z.object({
            title:z.string(),
            highlightedPosts: z.array(z.object({title:z.string(), description:z.string(), url:z.url()})),
            description: z.string(),
            feed:z.url().optional(),
            url:z.url(),
        })
})
```

Then the file would look something like this:

`src/data/blogsites.json`
```json
[
    {
        "title":"CompsciKB" ,
        "description": "A knowledge base for all things computer science",
        "url":"https://kieranwood.ca/compsci/",
        "slug":"CompsciKBs",
        "highlightedPosts": [
            {    
                "title": "Caching",
                "description": "A page explaining the basics of caching, and common use cases",
                "url": "https://kieranwood.ca/compsci/Programming/concepts/Caching"
            },
            {    
                "title": "Encodings",
                "description": "A simple breakdown of encodings, encoding systems, sanitization, and use cases",
                "url": "https://kieranwood.ca/compsci/Programming/concepts/Encodings"
            },
            {    
                "title": "Concurrency & Parallelism",
                "description": "A breakdown of concurrency and parallelism with classic examples and solutions to common problems",
                "url": "https://kieranwood.ca/compsci/Programming/concepts/Concurrency--and--Parallelism"
            }
        ]
    },
    {
        "title":"Tech" ,
        "description": "A blog for everything hardware, software & in between",
        "url":"https://kieranwood.ca/tech/",
        "slug":"tech",
        "feed":"https://kieranwood.ca/tech/rss.xml",
        "highlightedPosts": [
            {    
                "title": "Power Of Paths",
                "description": "A laymen's oriented exploration of encoding",
                "url": "https://kieranwood.ca/tech/blog/the-power-of-paths/"
            },
            {    
                "title": "Making Categories Simpler",
                "description": "Creating and using hierarchies in software",
                "url": "https://kieranwood.ca/tech/blog/taxonomical-ordering/"
            },
            {    
                "title": "Making Things Small",
                "description": "Compression, what is it and how do we do it",
                "url": "https://kieranwood.ca/tech/blog/making-things-small/"
            },
            {    
                "title": "It's Caches All the Way Down",
                "description": "A look at simple caching techniques and where they're used in software",
                "url": "https://kieranwood.ca/tech/blog/its-caches-all-the-way-down/"
            },
            {    
                "title": "How to verify quickly",
                "description": "The importance of hashing, and how it's used in systems",
                "url": "https://kieranwood.ca/tech/blog/verifying-quickly/"
            }
        ]
    }
]
```

Once this was done I threw everything into a nice 2-column layout (1 column on mobile) and we had everything we needed:

![mentorship section](/tech/blog/my-new-site/mentorship-section.png)

### Other

This was the section I was dreading. I ended up reusing the same component from the mentorship section to pull in some details about a few fun websites I wrote, but after that it was on to the hardest part, the gallery. To give some context I wanted to include some of my photographs from my camera, and some of my 3D art. For both I wanted the traditional "optimized" verisons on the page, and the ability to view the originals. Problem is, I have 87 images for the gallery. No matter how you cut it, I needed to find a way to load 87 high-ish quality images as quickly, and easily as possible. Because this article is long, and it deserves a deep-dive, I [wrote another article about this](https://kieranwood.ca/components/blog/nearly-a-thousand-images/) you can read for details. But with the images all loading I decided to make a controversial choice. You see back when I taught web development I learned about the multipart syntax you can use for `border-radius`. This allows you to make some interesting shapes with the borders of your elements. I've always wanted to use this, so I did in the gallery. This screenshot does very little justice, so I would recommend [checking it out yourself](https://kieranwood.ca/#other):

![other section](/tech/blog/my-new-site/other-section.jpg)

The design has had mixed reviews, but I don't care. I like it, and it's staying there. Yes, I tried a few others. I considered doing more of a lightbox style with a single image  that you could flip through, but that's way less fun to optimze than dumping 87 images on a single page 🙂. Unfortunately this did take me over my 2MB total I was aiming for, but I think it was worth it. If I was willing to compromise on quality, I could hit that metric, but I would rather go over that budget and keep the quality than doi things the other way around.

## Throwing Some Numbers at You

Overall, while it may not seem like it at first, this was quite a bit of work. If I had the full week it probably would have been fine, but getting sick really made it more of a crunch than I was hoping for. Most of the hard stuff was content-related, but the PR at the end was also very satisfying:

![PR screenshot](/tech/blog/my-new-site/final-pr.png)

3 thousand lines removed. That in and of itself is nice, but what about the actual performance, well the site itself went from 2.6MB on load to ~600KB, and time to load dopped from 2.5s to 297ms. When you scroll the whole gallery the site ends up being ~2.9MB. This means compared to the old site, for an extra 300KB I added a filtering data table with 40+ projects, and an extra ~80 images. Not bad.

Not everything is sunshine and rainbows though. There are two concerning metrics:

1. Build time; The pipelines take about 5-6 mins to build since they need to generate the images. Subsequent builds are faster now (~2 mins), but this is much worse than the 25 second deploys I had with my static site before. That being said, I'm not paying for compute, and even if I was I could just build that locally on my PC in < 15 seconds if I need to
2. Total bundle size; Because the originals and optimized versions are served, the total bundle size went from 2.6MB to ~805MB 😣. This luckily doesn't matter too much with github pages since the artifacts are deployed straight from the pipeline, but that might be rougher if I have to swap to a platform where I need to upload the bundle down the road

But, overall this means a site with a **~310x size increase loads in less than %12 of the time**. There's still more work to be done in the future, particularly on the mobile design side of things, but for now I'm pretty happy with how it ended up. Especially considering my 1 week challenge quickly became 3-4 days after getting sick. 

There are a few other left over items I'll look into:

- Images are still loading versions that are larger than they need to be, so I will need to play around with that more as I go. I also need to clean up some of the settings cloudflare is using to cache my images because [google lighthouse](https://developer.chrome.com/docs/lighthouse/overview) mentioned the cache time is really short, so I'll dig in later
- The live version of the site will have no `Recent Posts` for each site. This is because I added cloudflares bot-blocking, which is blocking the RSS feed, and it's **VERY** aggressive. It also broke my old uptime monitor, so I'll need to play with it a bit. I've been considering moving off github pages anyway, so I may run my pipelines on a [foregjo](https://forgejo.org/) instance down the road which I can just give access to the RSS files directly from my other sites
- Some of the code is using deprecated API calls, so I'll need to cleanup some of the JS

## Takeaways

There's quite a bit that goes into building even a somewhat-decent staticaly generated site. In particular how much goes into producing that much disperate content. This whole build also made me re-examine some of my sites, while I love astro I started during [version 2.0](https://astro.build/blog/astro-2/), 8 months later [3.0 was released](https://astro.build/blog/astro-3/), 2 months later [4.0](https://astro.build/blog/astro-4/), then a year for [5.0](https://astro.build/blog/astro-5/), and 15 months later [version 6](https://astro.build/blog/astro-6/). Each with it's own breaking changes that made upgrading a drag. All this to say, astro is **much more stable** than when I started using it, so investing in relearning best practices has become well worth it. This site is a great example of the sort of site I built long before the image pipelines or content collections existed in astro, and is long overdue for a rebuild (I also want to axe [tailwind](https://tailwindcss.com/) from this site). 

The main things for me going forward are going to be:

- Well defined schemas for content; I never realized how nice type errors are for debugging when you accidentally deleted a character in markdown frontmatter
- Let Astro and vite handle more optimization
  - All images live in `/src` and will use `<Picture>` or `<Image>`. No more hand optimizing images on each blog post
  - Fonts can have more of an impact than you think on a site, and I will use the new API's going forward to manage them
- Just use CSS; Now that I've done it all different ways I think pure CSS (no tailwind or other utility systems) is the way to build. I feel much more comfortable with designing when I'm using plain CSS, and much more willing to experiment
- You can do so much without JS; Reaching for javascript is usually unnecessary. A lot of what you want to do can usually be done with some clever CSS, or a handful of lines of JS
