---
title: "Build-a-long: Sedit"
subtitle: Building a static, static site generator frontend
description: How I built sedit, and the ideas along the way!
pubDate: 2025-06-12
modified_date: 2025-06-12T00:00:00-06:00
heroImage: /tech/blog/languages-dont-matter.jpg
tags:
  - javascript
  - web
  - frontend
  - ui
---

Building websites can be hard, particularly if you're building tooling to help people who know nothing about webdev. You can just grab an off the shelf CMS ([WordPress](https://wordpress.com/), [Drupal](https://new.drupal.org/home), [Wagtail](https://wagtail.org/), [ghost](https://ghost.org/), etc.), but now you're doing security updates forevermore. Most people just need a simple interface to build a static website for their needs. Over the years I've worked with a lot of static site generators ([gatsby](https://www.gatsbyjs.com/)(RIP), [hugo](https://gohugo.io/),[jekyll](https://jekyllrb.com/), [astro](https://astro.build/), etc.), for anyone who doesn't know a static site generator is a system that takes in data and spits out a static website:

![](/tech/blog/building-sedit/ssg-explainer.png)

\**This image is taken from [this slideshow](https://kieranwood.ca/static-site-generators/) I did about the topic in 2022*

These systems are great, I even [built one](https://github.com/Descent098/ezcv) when I was teaching to help people get into webdev. Unfortunately, they only work great with people who want to get their hands dirty. For some people even just having to edit a markdown file on their computer, and upload it is too much. There are some others that have tried to solve this problem ([forestry/tina](https://tina.io/forestry), [Netlify](https://www.netlify.com/platform/create/), etc.), but I was curious about looking for another way.

## What is Sedit?

I have tried several interfaces and UI's to make it easier to work with generating static sites. In general I would like a system where:

1. **The site itself is static**: This avoids storing any user data, and the complications with that
2. **The site contents can be re-used**: Have some method during export that exports the data so people can edit easily again
3. **Is intuitive**: Requires very little intervention to figure out how to use the system

I have made [many](https://kieranwood.ca/profilicity/), [many](https://kieranwood.ca/CoderPlusPlus/), [many](https://github.com/Descent098/markdown-writer) attempts at something similar, and they all had something in common they used a separate editing interface. When making content online there are often 2 common approaches:

- **WYSIWYG**: A what you see is what you get editor is something that people will be more familiar with in products like [microsoft word](https://en.wikipedia.org/wiki/Microsoft_Word), [libre Office](https://en.wikipedia.org/wiki/LibreOffice) or [google docs](https://en.wikipedia.org/wiki/Google_Docs) (packages like [quill](https://quilljs.com/), [shadcn-editor](https://shadcn-editor.vercel.app/) implement this style), it's essentially an editor to create documents. This works great for content like blogs, but it's not very free-form, and tends to limit what types of content you can add
- **Block-based**: Block-based editing is much more free-form, content is split up into blocks which allow you to build your page out peice by peice. This was popularized by [wordpress](https://wordpress.org/) ([guttenberg](https://wordpress.org/gutenberg/)) and [squarespace](https://www.squarespace.com/). I have used this approach many times via packages like [editorJS](https://editorjs.io/), [BlockNote](https://www.blocknotejs.org/). It also works great, but people often miss the indicator for adding content.

There is a third type that I didn't mention which is VIDEs (Visual Integrated Development Environments) such as [bootstrap studio](https://bootstrapstudio.io/), [webflow](https://webflow.com/), and the reason I didn't is because this is more cleanly what Sedit fits into. Essentially a V-IDE combines the idea of block-based editing with interfaces built into the browser. This means you visually can see what your site will look like while editing, making it more intuitive than a WYSIWYG or Block-based editor, but there's also usually a "settings pannel" for more complex interactions (images, csv data, etc.). 

This V-IDE approach gives us the best of both worlds interface wise, but we do sacrifice something compared to the traditional static site generator model, which is [taxonomical data](https://kieranwood.ca/tech/blog/taxonomical-ordering/). If we want to group a bunch of content together we typically use something like a tag or category system, this gets tricky with V-IDE systems because to offer flexibility we often consider each page it's own "blank-slate". For now we're going to ignore this problem, Sedit is meant to just be the frontend that the user interacts with **per-page** since most of the people for my use case will only have 1 page. We'll takle the larger site orchestration with another tool down the road. 

## First Steps

So, now we've landed on building a V-IDE, let's begin the experimentation the same way I did, with a simple idea. I wanted to use very simple javascript and CSS to add [`contenteditable`](https://kieranwood.ca/tech/blog/taking-your-html-elements-further/#content-editable) to elements. This makes them editable **directly in the browser**. This seems to me to be the most intuitive interaction to start with. This leaves us with a few issues, namely that contenteditable lets you modify the **text** inside an element, but it provides no nice ways of doing formatting. So, we'll deal with that later. Functionally my idea was to have 2 css classes: 

- `editable`: Add to the "block" and would help indicate the section is editable
- `field`: Add to an individual text field that is modifiable

Then when we start up the page we loop over all the `field`'s and add `contenteditable` to them. 

### Scaffolding

So, to get started let's just put together a few styles:

```css
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

:root{
  /*Earthy Theme*/
  --background-color: #002500;
  --primary-color: #929982;
  --secondary-color: #EDCBB1;
  --tertiary-color: #b77024;
  --accent-color: #B7245C;
}

html{
  background-color: var(--background-color);
  color: var(--primary-color)
}
```

For now we'll just create a [hero](https://blog.logrocket.com/ux-design/what-is-website-hero-section/) block.

```html
<style>
.hero{
    color: var(--primary-color);
    background:var(--secondary-color);
    height:70vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}
.hero h1{
    font-size:3rem;
    font-weight:bolder;
}
.hero h3{
    font-size:2rem;
    font-weight:bold;
}
.hero p{
    font-size:1.4rem;
    font-weight:light;
}
</style>

<div class="hero">
  <h1>Title</h1>
  <h3>Subtitle</h3>
  <p>content</p>
</div>
```

Which gives us something that looks like this:


<div class="body-demo">
  <div class="hero">
    <h1>Title</h1>
    <h3>Subtitle</h3>
    <p>content</p>
  </div>
</div>


Not the prettiest thing in the world, but we can work with it. 

### Making it editable

Now we have a block, let's sort out the contents into `editable` and `field` classes. In our case the `hero` itself is the container, and the elements inside are the content, so we get something like:

```html
<div class="hero editable">
    <h1 class="field">Title</h1>
    <h3 class="field">Subtitle</h3>
    <p class="field">content</p>
</div>
```

Great, now let's add our styles to make it clearer to the user when they hover over it, that something is editable:

```css
.editable, .field{
    /* Need some space to be able to
    edit if there's no content */
    min-width:2px;
    padding:0.25rem;
}
.editable:hover{
    border: 5px dashed #7c50ff;
}
.field:hover{
    border: 5px dashed #e750ff;
}
```

Which gives us:

<div class="body-demo">
  <div class="hero editable">
    <h1 class="field">Title</h1>
    <h3 class="field">Subtitle</h3>
    <p class="field">content</p>
  </div>
</div>

Now let's actually make it editable by iterating over the `field`s and adding the contenteditable attribute. So the resulting HTML we want would look like this:

```html
<div class="hero editable">
    <h1 class="field" contenteditable>Title</h1>
    <h3 class="field" contenteditable>Subtitle</h3>
    <p class="field" contenteditable>content</p>
</div>
```

To do this we can select all the `field` element's and add the `contentEditable` attribute:

```js
Array.from(document.querySelectorAll(".field")).forEach((el) =>{
  el.contentEditable = true
})
```

Which leaves us with:

<div class="body-demo">
  <div class="hero editable">
      <h1 class="demo-editable-fields">Title</h1>
      <h3 class="demo-editable-fields">Subtitle</h3>
      <p class="demo-editable-fields">content</p>
  </div>
</div>

We can now edit our content, we have built in undo (<kbd>ctrl</kbd>+<kbd>z</kbd>) and we can add as many of them as we want!

### Non-text Fields

Great we can edit text, we're good to go, right? No, what about non-text fields like images, or settings like if you want to include a link on a button, or include a button at all? How do we handle these? I considered a bunch of options, and after 10 minutes of hard-thought consideration I decided on having a `<details>` dropdown with a `<form>` inside it. Something like this:

```html
<details class="settings">
  <summary>⚙️</summary>
  <form>
    <!-- Block Specific settings start here -->
    <fieldset>
      <label for="includeContent">Include Content?</label>
      <input type="checkbox" name="includeContent" id="includeContent">
    </fieldset>
    <!-- Block Specific settings end here -->
  </form>
</details>
```


We can then add some styling to make it pretty:

```css
.settings {
  position: absolute;
  text-align: right;
  top: 0.3rem;
  right: 0.3rem;
  width: fit-content;
  font-size: 2rem;
  background: white;
  border-radius: 0.4rem;
  padding: 0.3rem;
  z-index: 1000;
}

.settings summary {
  cursor: pointer;
  display: inline;
  list-style: none;
}

.settings[open]::before {
  content: "Block Settings";
  text-decoration: underline;
  font-weight: bold;
  font-size: 1rem;
  display: inline;
  margin-bottom: 0.5rem;
}

.settings summary::-webkit-details-marker,
.settings summary::marker {
  display: none;
}

.settings form {
  padding: 1rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
}

.settings form fieldset{
    border-radius:.5rem;
    box-shadow: 1px 1px 1px black;
}

.settings form fieldset label {
  margin-bottom: 0.5rem;
}
```

We can now put this inside our hero block to see it in action:

```html
<div class="hero editable">
    <details class="settings">
      <summary>⚙️</summary>
      <form>
        <!-- Block Specific settings start here -->
        <fieldset>
          <label for="includeContent">Include Content?</label>
          <input type="checkbox" name="includeContent" id="includeContent">
        </fieldset>
        <!-- Block Specific settings end here -->
      </form>
    </details>
    <h1 class="field">Title</h1>
    <h3 class="field">Subtitle</h3>
    <p class="field">content</p>
</div>
```

Which gives us:

<div class="body-demo">
  <div class="hero editable">
      <details class="settings">
        <summary>⚙️</summary>
        <form>
          <!-- Block Specific settings start here -->
          <fieldset>
            <label for="includeContent">Include Content?</label>
            <input type="checkbox" name="includeContent" id="includeContent">
          </fieldset>
          <!-- Block Specific settings end here -->
        </form>
      </details>
      <h1 class="demo-editable-fields">Title</h1>
      <h3 class="demo-editable-fields">Subtitle</h3>
      <p class="demo-editable-fields">content</p>
  </div>
</div>

We could also add `.editable:hover` before each of these classes if we wanted it to only show up when hovering. I haven't decided which I prefer yet, so I'll leave it how it is for now. Now we have this settings box, on page load we could add it to our elements with `editable` by doing:

```js
// Add Settings icon to edtiable blocks
Array.from(document.querySelectorAll(".editable")).forEach((el) =>{
    settingsHTML = `
    <details class="settings">
      <summary>⚙️</summary>
      <form>
        <!-- Block Specific settings start here -->
        <fieldset>
          <label for="includeContent">Include Content?</label>
          <input type="checkbox" name="includeContent" id="includeContent">
        </fieldset>
        <!-- Block Specific settings end here -->
      </form>
    </details>`

    el.innerHTML = settingsHTML + el.innerHTML
})
```

This works, but it was at this point I started running up into some problems. How was I going to handle different block settings? Were people going to have to add a bunch of HTML up front to get things to work? Is there a better way to organize this. 

### Components

I am not a fan of a lot of modern web development, I think it's gotten far too complex, but there is one thing I have to admit, components are nice. For those that don't know components are a method similar to the "blocks" idea we talked about earlier. A component is a bundle of HTML/CSS/JS that you can logically group, and then re-use in your application. 

![](/tech/blog/jinja-components/component-architecture.png)

There are tons of frameworks to build these types of components with, from traditional systems like [jinja](https://kieranwood.ca/tech/blog/jinja-components/), to component-first ones like [astro](https://astro.build/). These are great systems, but I wanted something without people needing to install or setup a backend. So, instead I went with WebComponents.

[WebComponents](https://www.webcomponents.org/) are a browser standard way of doing components. You register your custom components with the browser, and then you can use them like regular HTML. So instead of using our settings panel HTML we had, and inserting it like this:

```js
// Add Settings icon to edtiable blocks
Array.from(document.querySelectorAll(".editable")).forEach((el) =>{
    settingsHTML = `
    <details class="settings">
      <summary>⚙️</summary>
      <form>
        <!-- Block Specific settings start here -->
        <fieldset>
          <label for="includeContent">Include Content?</label>
          <input type="checkbox" name="includeContent" id="includeContent">
        </fieldset>
        <!-- Block Specific settings end here -->
      </form>
    </details>`

    el.innerHTML = settingsHTML + el.innerHTML
})
```

We could do something like this:

```js
// Add Settings icon to edtiable blocks
Array.from(document.querySelectorAll(".editable")).forEach((el) =>{
    el.innerHTML = "<settings-panel></settings-panel>" + el.innerHTML
})
```

As a solution it makes a lot of sense for our system because webcomponents also help isolate functionality. So for example if our hero block ends up having a bunch of extra CSS that might interfere with other blocks, it instead is scoped to just our hero block. So our HTML would go from something like this:

```html
<div class="hero editable">
    <details class="settings">
      <summary>⚙️</summary>
      <form>
        <!-- Block Specific settings start here -->
        <fieldset>
          <label for="includeContent">Include Content?</label>
          <input type="checkbox" name="includeContent" id="includeContent">
        </fieldset>
        <!-- Block Specific settings end here -->
      </form>
    </details>
    <h1 class="field">Title</h1>
    <h3 class="field">Subtitle</h3>
    <p class="field">content</p>
</div>
```

To something like this:

```html
<hero-cta>
  <settings-panel>
</hero-cta>
```

Doing this is much nicer for the developer **working with** the components, but I would be lying if I didn't mention there's a fair bit of complexity being hidden behind this implementation. The basics to create components are:

1. Create a class that extends `HTMLElement`
2. Create a [shadow dom](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) (A custom DOM for the element, think something like an [iframe](https://www.w3schools.com/tags/tag_iframe.ASP)) 
3. Insert your HTML/CSS/JS into the shadow dom

So, for our hero it would be something like:

```js
class Hero extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = "" // Content removed to save space
  }
}

customElements.define('hero-cta', Hero);
```


<!-- Demo code -->
<script>
Array.from(document.querySelectorAll(".demo-editable-fields")).forEach((el) =>{
  el.contentEditable = true
})
</script>


<style>
.body-demo *{
  margin:0;
  padding:0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  
}
.body-demo{
  /*Earthy Theme*/
  --background-color: #002500;
  --primary-color: #929982;
  --secondary-color: #EDCBB1;
  --tertiary-color: #b77024;
  --accent-color: #B7245C;
  background-color: var(--background-color);
  color: var(--primary-color);
  height:80vh;
  width:100%; 
}
.body-demo .hero{
    color: var(--background-color);
    background:var(--secondary-color);
    height:40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}
.body-demo .hero h1{
    color: var(--background-color);
    font-size:3rem;
    font-weight:bolder;
}
.body-demo .hero h3{
  color: var(--background-color);
  font-size:2rem;
  font-weight:bold;
}
.body-demo .hero p{
  color: var(--background-color);
  font-size:1.4rem;
  font-weight:light;
}
.body-demo .editable, 
.body-demo .field,
.demo-editable-fields{
    position: relative;
    min-width:2px;
    padding:0.25rem;
}
.body-demo .editable:hover{
    border: 5px dashed #7c50ff;
}
.body-demo .field:hover,
.demo-editable-fields:hover{
    border: 5px dashed #e750ff;
}

.body-demo .settings {
  position: absolute;
  text-align: right;
  top: 0.3rem;
  right: 0.3rem;
  width: fit-content;
  font-size: 2rem;
  background: white;
  border-radius: 0.4rem;
  padding: 0.3rem;
  z-index: 1000;
}

.body-demo .settings summary {
  cursor: pointer;
  display: inline;
  list-style: none;
}

.body-demo .settings[open]::before {
  content: "Block Settings";
  text-decoration: underline;
  font-weight: bold;
  font-size: 1rem;
  display: inline;
  margin-bottom: 0.5rem;
}

.body-demo .settings summary::-webkit-details-marker,
.body-demo .settings summary::marker {
  display: none;
}

.body-demo .settings form {
  padding: 1rem;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
}

.body-demo .settings form fieldset{
    border-radius:.5rem;
    box-shadow: 1px 1px 1px black;
}

.body-demo .settings form fieldset label {
  margin-bottom: 0.5rem;
}


</style>
