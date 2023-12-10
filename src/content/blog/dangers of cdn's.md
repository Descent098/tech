---
title: The Dangers of CDN's
subtitle: When to use them, and how to avoid issues
description: "How to avoid the most common vulnerabilities with CDN's"
pubDate: 2023-01-30T00:00:00-06:00
modified_date: 2023-01-30T00:00:00-06:00
heroImage: /astro-redesign/blog/nasa-1lfi7wkgwz4-unsplash.jpg
video: XfEYE-J2vcE
crosspostURL: https://schulichignite.com/blog/dangers-of-cdns/
tags:
  - scorch
  - web
  - html
  - js
  - networking
  - security
---

CDN's are used a lot in web development to make things faster, and easier. But with everything there are pros and cons. We're going to look at CDN's and some of the risks associated with them!

## What is a CDN?

A CDN (content delivery network) is a server that allows you to serve resources over the internet quickly. Unlike regular servers with applications that actually process information CDN's are there to make sending **static** (stuff that doesn't change) content as quick as possible. This is because they don't have to do any calculations, so there's no slowdown from other things running, and because everything is static they can aggressively [cache content](https://aws.amazon.com/caching/).

They are used for many things including:

- Improving the load speed of files

- Allowing distribution of files internationally

- Optimizing files (minifying images, HTML, CSS, JS etc.)

One of their main uses is to distribute code for websites.

## Using CDN's for Javascript

Javascript (JS) has many packages available. There are several ways to load these packages, and if you are interested in more details be sure to check out our [scorch sessions](/scorch). The important one for this article is that you can include a HTTP based "source". Essentially a javascript file is loaded from a CDN on the user's browser. 

There are several advantages to this approach including:

- The package is already built and ready to use. You literally just put the URL in a script tag

- CDN's are often much faster to load than your own servers

- CDN's will often automate the job of making your file smaller

So, then what's the problem?

## Show me your ID

Fundamentally you are loading a file from the internet, or specifically a URL. Let's say for example our file is hosted on https://ignite-cdn.com/file.js and the website we're going to is https://schulichignite.com

Then the HTML from https://schulichignite.com might have something like this:

```html
<script src="https://ignite-cdn.com/file.js"></script>
```

Well, if we put on our hacking black fedora's and trench-coats there is a clear way for someone malicious to inject code into this. All they have to do is convince your computer (or any of the computers your computer connects to), that whatever malicious code they want to run is at the URL. 

There are more involved methods of doing this like stealing peoples passwords and uploading malicious code, or hacking into a server etc. The method isn't important, the point is that when we ask https://ignite-cdn.com/file.js for the file we have **no way to make sure we are getting what we want**.

These attacks are often called [CDN-poisioning or cache-poisioning](https://developers.cloudflare.com/cache/best-practices/avoid-web-poisoning/). It feeds off a problem of authority. I can't trust ignite-cdn.com and the only validation I can get that the code is correct is from ignite-cdn.com. Sort of like asking a theif if they took something, and just hoping they tell the truth. So the question as developers is how do we provide something to authenticate the file that works in HTML?

## A solution

This problem has come up before, especially on the early days of the internet. We need a way to essentially ask something to authenticate the content without having to run it. Since our files are just plain text we essentially need something that checks if the text is correct.

But if we were to do that by just comparing the text to a lookup, then there's a few problems:

1. Why even use a CDN if the HTML already includes the content
2. For long files we have to compare letter-by-letter which is slow

So how did people solve this problem? They began using hashes to quickly allow people to verify the data they got is correct. 

### What is hashing?

A hash is basically a string of numbers and characters. Essentially what happens is you take some sort of input (like the text of a file), put it through a hashing algorithm (a function that creates hashes like sha-1) and then you get a hash (string of numbers & characters) as an output. These hash systems are incredibly fast, and allow you to compare files much faster than character by character. In the HTML spec this comparison to a hash on a javascript file is called an integrity hash (or [subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) if you want to be fancy).

<pre class="mermaid">
graph TD
    A[fa:fa-user User] -->|1. Request file| B(https://ignite-cdn.com/file.js)
    B --> C[fa:fa-user User]
    C -->|2. Browser takes the TEXT, but doesn't RUN the code| D{hashing algorithm}
    D -->|Output hash matches integrity| E[fa:fa-user User: runs code]
    D -->|Output hash doesn't match| F[fa:fa-user User: retry or throw error]
</pre>

### Example

So if I have a file called `file.js`  on the server at the beginning this file has the code:

```js
console.log("Hello World")
```

If I take that code and I run it through a [SHA-1](https://www.geeksforgeeks.org/sha-1-hash-in-java/) algorithm (online version [here](https://codebeautify.org/sha1-hash-generator)) I get:

`865cd55417af5a27ab17ae1fff7510c7acc4f250` (40 bytes)

Now on the HTML from https://schulichignite.com I can do:

```html
<script src="https://ignite-cdn.com/file.js" integrity="sha1-865cd55417af5a27ab17ae1fff7510c7acc4f250" crossorigin="anonymous"></script>
```

The [cross origin attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) is part of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), which is not important for now. The part that matters is the integrity attribute we added, which has our hashing algorithm, and our hash. Now when our user loads the page the browser knows to take the text, run it through SHA-1 and **only run the code** if it matches. Otherwise retry downloading the file, or throw an error.

So if our fedora and trenchcoat wearing hacker wanted to send:

```js
let password = prompt("shulichignite.com want's your password:")
console.log(password) // This would be replaced with sending your password somewhere else
```

Which has a hash of `e8d9a577049257f59e6fdb0ed42a147c0eb334ac`, the browser would see it doesn't match the integrity hash `865cd55417af5a27ab17ae1fff7510c7acc4f250` and refuse to run it.

There are some additional features that help secure against other problems of authenticity like:

- [ssl](https://www.ssl.com/faqs/faq-what-is-ssl/); Encrypts your data being transferred so it can't be tampered with, and ensures only the person with the correct "key" can read it. What allows you to use https instead of http in URL's

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS); Only allows data from allowed "origins" [domains/urls]

## Other problems

There are a few other issues with the solution suggested, and CDN's in general:

- I used SHA-1 for my example, I would highly recommend a stronger hash algorithm that avoids [collisions](https://privacycanada.net/hash-functions/hash-collision-attack/), something like SHA-384

- Versions are tied to specific URL's, so the code has to update to update versions and all the hashes

- If the CDN ever goes down your app stops working

- If the URL changes your app stops working

- If the file creator pulls it from the CDN your app stops working

- If the user loses connection when the resource loads it doesn't work

Essentially you have no control over a CDN. You have basically introduced a potential for bugs with no easy way to fix them quickly. This is **usually** fine because most people are already relying on servers from other companies (sometimes the same one's as their CDN's), but if you need guarentee's you might want to look into other solutions.

## When to use CDN's for JS

There are however a ton of good times to use CDN's:

- If you're building a quick/throwaway project where security isn't super important

- If you know your user will always have a connection

- If you're using it for files that don't have important information in them (i.e. public photos)

- If your site is hosted with a CDN provider. For example if your site is hosted with cloudflare, then there's 1 point of network failure anyways.

- If you're willing to use integrity hashes and other checks to ensure users are getting the right files

- If you need the performance they bring, and are willing to take the correct precautions (Like [Netflix's crazy CDN's](https://www.theverge.com/22787426/netflix-cdn-open-connect))

## Conclusion

If you are going to use CDN's, make sure you're using them safely. Include integrity hashes where you can. Failing to do so means that people can inject whatever malicious code into your site they want, and your users pay the price. Generally CDN's like [unpkg](https://unpkg.com/), [cloudflare](https://cdnjs.cloudflare.com/), and many more will actually generate the hashes for you, so there's no reason not to!
