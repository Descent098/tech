---
title: "Don't learn Frameworks"
subtitle: "..."
description: "..."
pubDate: 2024-02-05T00:00:00-06:00
modified_date: ""
heroImage: /tech/blog/dont-learn-frameworks/hero.png
tags:
  - web
  - teaching
  - opinion
---

In the web development world there is no shortage of frameworks. Fullstack frameworks like [Django](https://www.djangoproject.com/), [Larvel](https://laravel.com/), [Leptos](https://leptos.dev/) and [Next JS](https://nextjs.org/). Front end frameworks like [React](https://react.dev/), [Svelte](https://svelte.dev/) and [HTMX](https://htmx.org/). Each of them offers to solve various problems for you in different domains and in different ways. If you are getting started with web development you should learn none of them.
## Background knowledge
If you know nothing about web development I will do a quick hyper-fast intro to the stuff you need to know for this article. However you should look into these topics on your own time for more details.

### Webpage Anatomy
When you load a webpage (like `https://schulichignite.com`) you are communicating across a network (via HTTP) with a server, which will then send you back an HTML file. HTML defines the structure of a webpage (the content, and the order the content should show up), HTML can then be made pretty using CSS. Essentially CSS takes your HTML and defines your "theme", or "styles" on how the site looks (colors, animations etc.). Lastly JavaScript is a programming language that can be run while you're on a page. JavaScript isn't necessary for a webpage (neither technically is CSS), but it's used to add dynamic functionality (search results, games etc.). Once HTML has been sent by a server to you there are 2 options, either:
- processing can happen on the server, and your computer has to talk with the server constantly
- it can be processed on your machine (the client). 

### Component model

By default without a framework each of these languages (HTML,CSS, and JS) are **co-located,** which is a fancy word for saying they each have their own responsibility and live in their own files. So once the HTML is loaded it will tell the browser to grab the CSS and the javascript. One thing people realized as they were developing is that they were often using the same HTML/CSS/JS on multiple pages, sometimes even on multiple projects. As such people created a common model called the component model. The component model basically organizes some HTML/CSS/JS that is supposed to go together into components, you can then use these components like bricks to build your site piece by piece. 

An example of a component library (set of pre-built components) is [google material design](https://m3.material.io/components), which has a bunch of components people can use to build websites and apps. These components can be configured and placed so that they will be inserted for you whenever you want. This often makes code super short to read, and easier to understand. From this frameworks (like [react](https://react.dev/), [vue](https://vuejs.org/), and [svelte](https://svelte.dev/)) were created which took this idea to it's extreme. Instead of just being a good practice, many frameworks are built around creating components, and your entire development takes place inside these components. Your HTML pages become a composite of components (which often contain other components) which build up the larger HTML page.

*Pure HTML vs Component (in a framework) approach*

![](/tech/blog/dont-learn-frameworks/components.png)

So in this code `<Card/>` is basically an object that takes in all the data, and results in the same HTML as the left. In this case you can see `<Card/>` in the definition is acting like a class, where it takes in the state it needs. This can make it easier to work with than traditional components since you only need 1 "template" to re-use it all over the place, instead of having to copy-paste everywhere.
## Down memory lane
I teach the web development course [^1] as a volunteer for [Schulich Ignite](https://schulichignite.com/). The course ([scorch](https://schulichignite.com/scorch/)) is focused on covering web development for beginners. There are nearly an infinite number of ways you can start to teach (and learn) about web development. However there are not an infinite number of ways these technologies can work in practice. For our sessions we start by learning to create things from scratch, and then learn tools to make that easier. After learning those tools we start looking at tools to automate more and more of what we're doing, while increasing the complexity. 

Generally the sessions follow a pedagogy of:

- You should know why whatever's being talked about matters
- You should know what your code is doing, and/or know how to figure it out
- You should know how each piece of code interacts with one another (backend-frontend, source-templates etc.)
- You should be able to look at other websites and understand what's going on, and/or know how to figure it out
- You should be able to go off with the resources we provide and learn more

The whole basis for this article came up when someone mentioned potentially wanting to use [react](https://react.dev/) in our sessions. There are tons of compelling reasons to do this:

1. It's very popular, meaning tons of new projects integrate with it
2. There's loads of additional tutorials and resources online
3. High demand in industry means the skills they learn might get them a job
4. Component model is pretty based

Great! So why didn't we teach it?

The main reason is because react in antithetical to learning web development...

## Almost knowledge

In computer science we often talk about abstraction. For this article I will be using it as a way to talk about hiding complexity with systems that feel simple to use. An example would be that when you go through and open a file manager window to modify files. The file manager you're interacting with is doing an incredible amount of complex operations in the background to navigate and update your file system. If you had to do everything it's doing manually you would never be able to do anything with your system. 

In essence your file explorer allows you to skip learning about the fundamentals of how the system operates, and instead work with a simpler representation of what's happening under the hood. The file manager in this case would be an abstraction on top of the underlying procedures of the operating system. In the case of file managers this is basically a necessary abstraction since most people who have to use computers day-to-day really don't need to know about i-nodes, encoding and the intricacies of file systems. This is mostly because there's no reason why most people using a file manager would ever want/need lower-level access.

## Magic is a hell of a drug

Likewise React is an abstraction of web development. This isn't inherently bad, in fact it's why people like react in the first place, however I think the abstraction is too "high level" to be a good teaching tool. In short form a high-level abstraction is just an abstraction that is more "magic"; It handles more things for you. 

Let's say to do something manually would typically take 12 steps you have to do to complete. A low level abstraction might make you take 10, where a higher level abstraction might make you take 4. However most of the time under the hood it's doing the same amount of work (or more) than no abstraction at all. It might only take **you** 4 steps, but react might be making 30 behind the scenes to allow you to only need to make 4 instead of the original 12.

![](/tech/blog/dont-learn-frameworks/abstraction.png)

React as far as I'm concerned is too high level ("magical") of a system to work with, and understand what's happening. This can be "fine" in a practical setting, however like I said earlier I want people to understand what their code does. This is because react does **way more steps** [^2] than what most people need to do. Likewise trying to trace what's happening can be a nightmare. Using the popular tool `create-react-app` a simple hello world app can have over 2,800 dependencies[^4], while this is getting better[^5], and it's better than others [^6] I can't explain code that would take me months to read in a 2 hour session. These additional steps enable some really cool functionality[^7] [^8], but also makes it hard for people to understand the foundational concepts of web development. 

React fundamentally was developed as a product to solve problems at meta (Facebook at the time) [^3] and it solves the problem of creating "reactive" UI's well. A "reactive" UI being a website or webapp that constantly needs to update its data. For example Facebook or Instagram needing to update it's number of likes in real-time, or showing new posts constantly.  However it's not a replacement (or even good choice) for simple web development approaches in many cases. In particular the less interactivity you need on the front-end, the less good of a choice react is. 

As mentioned earlier the [component model](#component-model) is incredibly popular, and react is a framework that helps you use components to build your site. However it does this with [jsx](https://react.dev/learn/writing-markup-with-jsx), which is a language that looks to combine JavaScript, HTML and CSS all in one location. This means ideally that with everything in one spot you **should** be able to debug easier, since you can see everything that makes up your component in one file. Whether this is true or not is up to the individual. Often this can be the case, however before your JavaScript is even run it is transpilled from jsx via babel into it's corresponding JavaScript, and often times it's a huge unreadable (but optimized) mess. These multi-step processes between your source code and the result at the end can make it really hard to understand what parts correspond to your original code.

## What do I recommend
While starting I recommend doing things the old-school way first, and then moving into more "magic" frameworks down the road. For example micro-frameworks like [flask](https://flask.palletsprojects.com/en/3.0.x/), [fastapi](https://fastapi.tiangolo.com/), [expressjs](https://expressjs.com/), [gin](https://gin-gonic.com/) etc. These frameworks let you handle complexity and abstraction at your own pace. By default they will handle some routing for you, but they won't do much else unless you explicitly configure them to. This comes after learning HTML/CSS/JS enough that students understand what each does, and have some exposure writing them themselves. 

This foundation then enables an expansion later into topics like react if they're interested on their own, but without this foundational knowledge people don't know what they're doing. Sure someone might be able to make an app in react, but if they don't actually know javascript or CSS when they do it, then many problems are insurmountable to them. If someone else hasn't solved it, then it's not possible. This kind of thinking is demoralizing and is the opposite of the sort of spirit I want to try to echo in my teaching. I'm not interested in creating another code monkey that can be replaced by chat GPT next week. I want to help people become developers who understand and can problem solve issues they run into, and create new things.

An ever-growing concern that I find myself having is running into developers who only know abstractions. This means those developers are **unable** to develop for the web. Instead they are developing for **the platform** they're using. What I would say is that for any given abstraction you are using you should be able to do what it's doing yourself in some way. For react you should at minimum understand how to have a template language and some state that then renders your results to the necessary files. In scorch we use [jinja](https://jinja.palletsprojects.com/en/3.1.x/) for this. You should understand the configuration settings your making, and what it looks like to transpile one markup language to the next. Again in scorch we use pythons markdown to create some HTML as a string, and write it to files. Understanding that this is what your frameworks do under the hood is important.

## Conclusion
So, like I said in the beginning you shouldn't learn frameworks. Learn what frameworks are doing, and use them to do those things well. If you think components are a good idea, mess around with making your own system at first. If you only know JS, go grab node JS and try making a component framework. If you know another language, do it in that language and try generating webpages as a result. 

Likewise there are times and places for frameworks, in particular for automating nonsense you don't want to do because it's tedious. Generating image styles manually sucks, doing it with [Astro](https://astro.build/) is fine, so long as you know what it's doing. Using react to manage the state of a complex application efficiently makes sense, but you should also **be able** to do it the long way.


[^1]: [Scorch | Schulich Ignite](https://schulichignite.com/scorch/)
[^2]: [Blogged Answers: A (Mostly) Complete Guide to React Rendering Behavior · Mark's Dev Blog (isquaredsoftware.com)](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)
[^3]: [How A Small Team of Developers Created React at Facebook | React.js: The Documentary (youtube.com)](https://www.youtube.com/watch?v=8pDqJVdNa44)
[^4]: [Find How Many Packages We Need to Run a React 'Hello World' App | FrontEnd web (medium.com)](https://medium.com/frontendweb/find-how-many-packages-we-need-to-run-a-react-hello-world-app-695fbb755af7)
[^5]: [JavaScript Growing Pains: From 0 to 13,000 Dependencies | AppSignal Blog](https://blog.appsignal.com/2020/05/14/javascript-growing-pains-from-0-to-13000-dependencies.html)
[^6]: [Ride Down Into JavaScript Dependency Hell | AppSignal Blog](https://blog.appsignal.com/2020/04/09/ride-down-the-javascript-dependency-hell.html)
[^7]: [Conditional Rendering – React](https://react.dev/learn/conditional-rendering)
[^8]: [Render and Commit – React](https://react.dev/learn/render-and-commit)