---
title: The acquisition race
subtitle: When ownership becomes the new vouge
description: What recent acquisitions look like, and what it might mean for the future
pubDate: 2026-06-09
heroImage: /tech/blog/floodr/hero.png
tags:
  - open-source
  - rust
  - personal
  - floodr
---

In the last year there have been many high-profile open source acquisitions from major software vendors. Anthropic [aquired bun](https://bun.com/blog/bun-joins-anthropic), OpenAI acquired [Astral](https://openai.com/index/openai-to-acquire-astral/) (makers of python tools such as [uv](https://docs.astral.sh/uv/)), cloudflare acquired [astro](https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-astro-to-accelerate-the-future-of-high-performance-web-development/) and [VoidZero](https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-voidzero-to-build-the-future-of-the-ai-native-web/) (makers of [vite](https://vite.dev/)), and probably many more. A large company acquiring smaller companies is not exactly a headline, but the specifics are what make this interesting. Every one of the examples I just mentioned is a vendor that builds open source software. Not in a "we happen to open source some work" kind of way, their **primary** value is tied in with their open source offerings. So why buy something that you don't technically own?

There are many potential answers to this question; commuity support, name recognition, and plenty of other options. However many of these options don't seem to be advantages over just **using** and **contributing** to the software, so, again, why bother? Outside of all the normal open source perks there seem to be 2 main advantages.

## Many moons ago...

Once upon a time servers were slow, so people used caches. Evidently the servers are still slow, but the caches made it less noticeable. A key component of this improvement was for many projects Redis. Redis is an in-memory key-value store, and was designed for speed. The project worked really well, too well. Companies realized the benefit of having Redis, and with it being open source, they began building businesses around it. For example, Amazon, who offered a cloud-hosted version of Redis ([ElastiCache](https://aws.amazon.com/elasticache/)) for companies to use. This also happened to [Elastic Search](https://www.elastic.co/elasticsearch) who ended up [changing their license](https://www.elastic.co/blog/why-license-change-aws), to a [custom license](https://www.elastic.co/blog/elastic-license-v2). You probably wouldn't be shocked to find out that Redis [also did this](https://redis.io/blog/redis-adopts-dual-source-available-licensing/) (though later [changed it's mind](https://www.opensourcestartups.com/blog/redis-relicense-timeline)). The same is true for MongoDB, who used [SSPL](https://www.mongodb.com/legal/licensing/server-side-public-license?msockid=33328f4bb5ab636004b8997bb46c6252), and have their reasons laid out [here](https://www.mongodb.com/legal/licensing/server-side-public-license/faq?msockid=33328f4bb5ab636004b8997bb46c6252).


