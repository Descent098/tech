---
title: A case for tailwind
subtitle: My most hated idea revisited
description: Putting the utility in utility classes
pubDate: 2025-11-25
heroImage: /tech/blog/beyond-scorch.png
tags:
  - web
  - javascript
  - css
  - js
  - html
  - frontend
  - ui-ux
  - design
  - npm
  - node
  - terminology
---

I hate tailwind. The idea of strapping an abstraction layer on top of CSS is an absolute nightmare philosophically. There are tons of problems:

1. Class fatigue; where there are so many classes on an element it becomes unreadable, i.e. `inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700`
2. Compile step; Outside of using the slow js bindings for most frameworks you now need to compile your CSS, similar to systems of the past like [sass](https://sass-lang.com/)
3. Something new; Designers and programmers need to learn yet another tool to understand their applications. I end up looking up "how to do `x css feature` in tailwind" constatly because I can't remember the syntax

After all this time I've always viewed it as a hinderance, and something I need to work around, but finally this week, I had an actual use for it.

## Background

I tend to use [astroJS](https://astro.build/) for most of my frontend work these days (including this site as of writing). Astro takes the [component approach](https://kieranwood.ca/tech/blog/jinja-components/) to rendering. So a card for example might look something like this:

```jsx
<Card title="Hello World"/>
```

So, how do you style it? Well traditionally you would have **scoped styles**, which is a fancy way of saying you have a `<style>` that only affects **the component it's defined within**. This approach is meant to help potential issues associated with CSS where the [cascade]
can cause problems. But what if you want to have a more "global" css? Well, you can define certain CSS as being global, and it will run on everything, except...

Web components. Web components are a standard that lets you create your own custom HTML elements that have custom javscript functionality, and styles. So you have a JS file with something like:

```js
class MyCard extends HTMLElement{
	... // Code in here
}


customElements.define("my-card", MyCard) // Register the component
```

You can then use it in your HTML like this:

```html
<my-card></my-card>
```

While astro tries to scope it's style via it's own internal system, [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) enforce this by essentially creating a new document inside your document ([shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)), and this means the scoped styles are enforced at a **browser level**. So, how do we inject style overrides into a web component? 

### Overrides 

Well, tailwind. Tailwind is essentially a compiler that searches through your code and does everthing it needs to **at build time**, before the final HTML output. Because of this you can actually use tailwind's styling in your web components written in astro. While it  
