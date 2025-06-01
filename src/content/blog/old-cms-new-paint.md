---
title: "Old CMS, New Paint"
subtitle: Speeding up the slow parts of legacy systems
description: "A method to incrementally improve performance"
pubDate: 2025-05-26T00:00:00-06:00
modified_date: 2025-05-26T00:00:00-06:00
heroImage: /tech/blog/python-plus-go/diagram.excalidraw.png
language: [python, go, php]
tags:
  - python
  - go
  - PHP
  - web
  - theory
---

> There are 2 hard problems in computer science: cache invalidation, naming things, and off-by-1 errors.
> -- [Leon Bambrick](https://x.com/secretGeek/status/7269997868)

The web is built on legacy systems. Decades old CRM's, CMS's and various other C-related accronyms. These systems tend to be slow, complex, and hard to reason about. But is that actually true? From my experience there's actually only certain **parts** of these systems that need to be optimized, and in general some of these optimizations can be done quite quickly. As an example I want to walk through an approach I'm taking to speed up 2 CMS systems that have begun to show there age as time is going on.

## Background

As a bit of background these services are a multi-tenant systems that are designed to help make various websites easier. Think something like a [squarespace](https://www.squarespace.com) or [wix](https://www.wix.com), but for a particular large organization. This is handled by a few different off-the-shelf CMS systems for different use cases, think [WordPress](https://wordpress.com/), [ghost](https://ghost.org/), [drupal](https://new.drupal.org/home), [wagtail](https://wagtail.org/) etc. This means that on the user input side there is tons of complexity in authentication, authorization, and authoring. Built into these platforms are tons of complex systems for managing bulk updates of content, and files, separate systems for managing menus, different content types, etc. Basically, there's a lot of **stuff** happening at any given time, enough that a full rewrite would be a nightmare.

Due to all the **stuff** happening we're running into a litany of issues, these issues have been exasterbated due to bot scraping. Almost all of these CMS systems rely heavily on [caching](https://kieranwood.ca/compsci/Programming/Caching), ususally this is fine, and it's why you don't see issues on small sites since the actual backend code is rarely running. Most of the time our outer proxies and caches are returning the HTML. At worst the CMS is just fetching from the caches in memory, and re-loading every so often. Unfortunately, with bots constantly scraping you essentially always run into cold-caches/cache-misses. This means that nearly every page load is having to execute the rendering pipeline to get the HTML. This slows down sites that are larger than your caches **massively**. Likewise if your sites are hosted in shared infrastructure, this extra processing and resource cost slows **everything** down.

## The bots

The bot problem itself is tricky. There are various solutions with various degrees of success. You can try rolling your own specialized ones to deal with specific issues. For example if you're having people constantly attacking you maliciously you can try [fail2ban](https://github.com/fail2ban/fail2ban), unfortunately for us most of it is content scraping. Since the pages are public this becomes a trickier issue. We could use something like [anubis](https://anubis.techaro.lol/), but this will block a ton of legitimate traffic, and will lower our SEO (something we do not want to do). Likewise, the other good solutions to this problem are elusory due to various historical reasons in my situation, so, let's put a pin in trying to fully stop the bots, and look at improving our worst-case performance.

## Bettering our worst case

Currently the CMS's we use have a few things in common:

1. **They're in PHP**; PHP as a language is very slow. Certain frameworks like [laravel](https://laravel.com/) have [fancy mechanisms](https://laravel.com/docs/12.x/octane) to address this issue, unfortunately, this does not exist for our systems
2. **They're in single threaded PHP**; Double yikes, there are some thread-safe versions of our packages, but fundamentally this would require a rewrite from scratch to implement
3. **They have distinct public/private interfaces**; Due to them being CMS's they have a clear distinction of public/private routes. For example `/admin/*` is for admin tasks and requires auth, `/system/*` is also private and requires auth, whereas `/blog/*` is public
4. **The static assets are hosted externally**; All static assets are served from a type of CDN system, but still flow-through from the CMS system
5. **The databases are discrete**; Each environment has a separation of it's database from the other environments. Meaning they can be migrated one-by-one
6. **Traffic density is pareto distributed**; Essentially %20 of our environments serve %80 of our traffic, meaning we can migrate "lower-visibility" sites easily, which makes theory testing simpler and lower-risk
7. **Consistency is not key**; None of our content is "realtime" so we can trade consistency for uptime

So with all that out of the way, what is a solution that suits our needs? Well, our main **public-facing** issue is outages, particularly due to database issues, so let's start there. When looking at the CMS's they fell victim to a common problem, developer experience. In particular they both have nicely wrapped [ORM systems](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) that make working with databases "simple". Being able to take a PHP object and serialize it into a database with a single call looks nice, but upon further inspection this was creating a nightmare in the backend. 

Due to the way fields were represented a single field in a form could have up to 5 **tables** associated with it, not to mention wrapper tables for pages on top of that. This meant in practice some of our environments had upwards of ~900 tables once cache layers were added into the mix. Unfortunately, due to how they were constructed these tables couldn't just easily be removed either, so what can we do? Well, after some digging I realized the database was massively [over-normalized](https://stackoverflow.com/questions/292797/overnormalization), to the point that I ran an experiment on my local machine where I skipped all caches, auth, and anything not involved with rendering, and found that only ~5-10 tables were strictly necessary, and they could be de-normalized into a single table quite simply.



