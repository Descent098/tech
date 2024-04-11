---
title: Beyond Scorch
subtitle: So, you've completed scorch, now what?
description: How you can take the skills you learned and build upon them further
pubDate: 2024-04-11
heroImage: /tech/blog/beyond-scorch.png
crosspostURL: https://schulichignite.com/blog/beyond-scorch/
tags:
  - scorch
  - web
  - security
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
So, you've completed scorch, now what? Well throughout the sessions we covered a ton of content from frontend and design, to security, to networking. Lots of things were covered, and so I have broken up this post into sections so you can find the section most relevant to your favorite part of the sessions for the time being.

## Design and Frontend
We covered a ton of topics when it came to design and frontend development. This is essentially everything a user see's and interacts with. This covers UI, UX, as well as HTML, CSS, Component Libraries etc.

### Design
For the design oriented section I don't have a ton of specific topics to recommend, but broadly just a few resources you can look into if you want to continue down the design route, some of these are websites, some are youtubers. Some specific to web design, some more jack-of-all-trades designers:
- Youtube
	- [Malewicz](https://www.youtube.com/@MalewiczHype)
	- [Mizko](https://www.youtube.com/@Mizko)
	- [The Futur](https://www.youtube.com/@thefutur)
	- [DesignCode](https://www.youtube.com/@DesignCodeTeam)
	- [Flux Academy](https://www.youtube.com/@FluxAcademy/featured)
	- [DesignCourse](https://www.youtube.com/@DesignCourse)
	- [Jesse Showalter](https://www.youtube.com/@JesseShowalter)
	- [Juxtopposed](https://www.youtube.com/@juxtopposed)
- Inspiration websites
	- [Dribbble - Discover the World’s Top Designers & Creative Professionals](https://dribbble.com/)
	- [CodePen: Online Code Editor and Front End Web Developer Community](https://codepen.io/)
	- [Behance](https://www.behance.net/galleries/ui-ux)
	- [Designspiration - Design Inspiration | Inspirational Art, Photography & Typography Images](https://www.designspiration.com/)
	- [The FWA - Awards](https://thefwa.com/)
	- [Awwwards - Website Awards - Best Web Design Trends](https://www.awwwards.com/)

### Front end
On the development side there's a ton of directions you can go in. Generally more experience with CSS is a good idea, and from there dipping your toes into frameworks is probably a good idea.
#### Node JS
[Node JS](https://nodejs.org/en) is a popular runtime for JavaScript. This basically means you can run JavaScript on your PC without needing a browser. This means we can use JavaScript for anything we would use a normal programming language for. Node JS also has a package management system called NPM, which has [thousands of packages](https://www.npmjs.com/). If you want to use JavaScript for more advanced use cases, node JS is the way to go.

**Resources**
- [JavaScript in 100 Seconds - YouTube](https://www.youtube.com/watch?v=DHjqpvDnNGE)
- [Intro To Node.js | Schulich Ignite](https://schulichignite.com/blog/intro-to-node/intro2node/)
- [The Node Package Manager (NPM) and package.json File | Schulich Ignite](https://schulichignite.com/blog/intro-to-node/npm-intro/)
- [Node.js Crash Course Tutorial #1 - Introduction & Setup (youtube.com)](https://www.youtube.com/watch?v=zb3Qk8SG5Ms&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU)
- Tools
	- [Bundlephobia | Size of npm dependencies](https://bundlephobia.com/)
#### Typescript
In the course we used JavaScript. With JavaScript we can do a ton of great things, but there are issues. If I were to give you the variable `a` in javasript, you wouldn't be able to tell me necessarily what `type` it is. You might think "oh, I'll just do this":

```javascript
function checkType(value, expectedType){
	if (typeof(value) == expectedType){
		return true
	} else {
		return false
	}
}

checkType("a", 'string')
```
Great, so we can do our checks and we're good to go! Well, consider this:

```javascript
a = "a"
typeof(a) // 'String'

a = 1
typeof(a) // Number

a = 1.5
typeof(a) // Number <-- No difference for int or float

a = true
typeof(a) // Boolean

a = NaN // Not a number
typeof(a) // Number <-- Why

a = [1,2,3,4]
typeof(a) // Object

a = {"name":"kieran", "age":25}
typeof(a) // Object <-- Arrays and JSON are both 'object'

class Dog {
  constructor(breed, name) {
    this.breed = breed;
    this.name = name;
  }
}

a = new Dog("Doberman", "Lucky")
typeof(a) // Object <-- Any and all class instances are objects

```

So... Not a Number (NaN) is a number and arrays, JSON or classes are all considered just objects. How do we actually make sure the information we're receiving is the correct type when we're working on things. This has been a well known issue in javascript, and so a language was created called typescript, typescript basically is javascript, except you define types for your variables, and then you compile your code to javascript so it can run in the browser with all the type safety you developed (though there are still issues with typescript[^1]).

Here is an example in typescript:

```typescript
let a:String = "a"

a = 14 // Error: Type 'number' is not assignable to type 'String'.
```
Great, but what about our ambiguous cases from earlier:
```typescript
// Integers vs floats aren't built in, but you can give people a hint what you're looking for

type integer = number
type float = number

let a:integer = 1
let a:float = 1.5

let a:number[] = [1,2,3,4]

class Dog {
    breed:String;
    name:String;

  constructor(breed:String, name:String) {
    this.breed = breed;
    this.name = name;
  }
}

let a:Dog = new Dog("Doberman", "Lucky")

// You can then use this to define arguments to functions, which will error at compile time if it's not respected
function pet(a:Dog): String{
	return `Who's a good dog ${a.name}`
}

let a:Dog = new Dog("Doberman", "Lucky")
pet(a)

let b:integer = 1
pet(b) // Error: Argument of type 'number' is not assignable to parameter of type 'Dog'.
```
Libraries like [zod](https://zod.dev/) can take this even further

**Resources**:
- About
	- [TypeScript: JavaScript With Syntax For Types. (typescriptlang.org)](https://www.typescriptlang.org/)
	- [TypeScript in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
- Getting Started
	- [TypeScript - The Basics (youtube.com)](https://www.youtube.com/watch?v=ahCwqrYpIuM)
- Helpful tools & Challenges
	- https://www.typescriptlang.org/play
	- [type-challenges/type-challenges: Collection of TypeScript type challenges with online judge (github.com)](https://github.com/type-challenges/type-challenges)
	- [TypeHero](https://typehero.dev/)

#### Meta Frameworks
Meta frameworks are systems that are designed to make building sites easier. They help bundle a bunch of functionality together to make it easier to do more complicated things. There's a few categories I created to discuss these. The ones in this section are based on JavaScript, and mix frontend and backend code. Later in the backend section I will talk about "full-stack/backend" frameworks that separate these concerns more strictly. Some of the UI frameworks we will talk about can be used with these. I would recommend for most people to start with Astro, then down the road integrate a few react components into an Astro site and go from there.
##### Astro
[Astro](https://astro.build/) is a framework designed to make building mostly static sites easy. It's a mix of a static site generator, a meta-framework, and a framework. It's designed to work best for things like blogs, e-commerce, and portfolios. Anything where the content is the most important part, and the content itself is not changing daily. Astro is designed to let you create components, and then use those components to build out pages, then at the end use all of this to build a static site (though it can be configured to be a server with a backend as well). 

Astro is very beginner friendly, and has a ton of pre-built [themes](https://astro.build/themes/) you can start from. It's meta-framework-ness will also allow you to mix and match some of the other UI frameworks we will talk about later, but you don't **have to**. For example you can have an Astro project that has react, or svelte, or view components inside it!

**Resources**:
*Keep in mind Astro is relatively new, they've gone through multiple versions quickly, so lots of resources use old versions of Astro*
- About
	- [Astro in 100 Seconds](https://www.youtube.com/watch?v=dsTXcSeAZq8)
	- [Astro](https://astro.build/)
- Getting started
	- [Getting Started | Docs (astro.build)](https://docs.astro.build/en/getting-started/)
	- [Everything You Need To Know About Astro (youtube.com)](https://www.youtube.com/watch?v=rRxuVOutmFQ)
	- [Astro in 100 Seconds part 2](https://www.youtube.com/watch?v=gxBkghlglTg)
	- [Astro Crash Course in 60 Minutes (youtube.com)](https://www.youtube.com/watch?v=NniT0vKyn-E)
	- [Astro Crash Course (youtube.com)](https://www.youtube.com/watch?v=Oi9z5gfIHJs)
##### NextJS
NextJS is a react-based meta framework designed to make building apps with react easier. It's used by a ton of newer companies, and has a ton of functionality integrated and or available in plugins. Unlike Astro next is tied to react, so if you want to use it I would recommend reading the react section first, then coming back to this section.
**Resources**
- About
	- [Next.js by Vercel - The React Framework (nextjs.org)](https://nextjs.org/)
	- [Next.js in 100 Seconds // Plus Full Beginner's Tutorial (youtube.com)](https://www.youtube.com/watch?v=Sklc_fQBmcs)
		- This came out a few months later: [Next.js 13… this changes everything - YouTube](https://www.youtube.com/watch?v=_w0Ikk4JY7U)
- Getting Started
	- [Docs | Next.js (nextjs.org)](https://nextjs.org/docs)
	- [Create T3 App](https://create.t3.gg/)

#### UI Frameworks
A while back companies realized as their UI was getting more complicated that they wanted to store more content client-side, while still providing a good experience. Originally people played around with AJAX ([video about AJAX](https://www.youtube.com/watch?v=tNKD0kfel6o&list=PL0eyrZgxdwhyeIDc3EA4XGsI9HoWLc6nF&index=1), [longer video about jax](https://www.youtube.com/watch?v=82hnvUYY6QA)). Ajax is basically just normal JavaScript, except it will occasionally update it's content. This worked well for chat apps, and other apps, but as social media got more complicated people started creating UI frameworks to keep up with demands of users. I would recommend learning AJAX as a lot of the time it will serve your needs better than a full on UI framework. While most of these libraries are popular you should keep in mind that [React](https://react.dev/) as a UI framework is the most popular, and therefore best option job-wise (for now, but that's changed in the past). 
#### React
React is a UI framework that is incredibly popular. Fundamentally it allows you to create components using JSX, a language built for react. This means you can include your JavaScript, CSS and HTML all in one file, and use/re-use components as much as you need. It works very well when your UI is *reactive*, meaning it has a lot of changes to it's state. 

Want to have an online map with realtime scrolling? How about realtime video calls? Maybe a massive social media site with realtime likes and comments? All of these are good use cases for react. Just keep in mind that all UI libraries have to use resources on the client browser, so you can easily get slow performance if you're not careful.

**Resources**:
- About
	- [React in 100 Seconds - YouTube](https://www.youtube.com/watch?v=Tn6-PIqc4UM)
- Getting Started
	- [React Tutorial for Beginners (youtube.com)](https://www.youtube.com/watch?v=SqcY0GlETPk)
	- [7 better ways to create a React app (youtube.com)](https://www.youtube.com/watch?v=2OTq15A5s0Y)
- Technical details
	- [React.js Basics – The DOM, Components, and Declarative Views Explained (freecodecamp.org)](https://www.freecodecamp.org/news/reactjs-basics-dom-components-declarative-views/)
	- [What is the virtual DOM in React? - LogRocket Blog](https://blog.logrocket.com/virtual-dom-react/)
	- [React: The Virtual DOM | Codecademy](https://www.codecademy.com/article/react-virtual-dom)
	- [Understanding Virtual DOM in React | refine](https://refine.dev/blog/react-virtual-dom/)
- Other UI Frameworks
	- [Preact | Preact: Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM. (preactjs.com)](https://preactjs.com/)
	- [Svelte](https://svelte.dev/)
		- [Svelte in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=rv3Yq-B8qp4)
		- [React Vs Svelte...10 Examples](https://www.youtube.com/watch?v=MnpuK0MK4yo)
		- [SvelteKit in 100 seconds (youtube.com)](https://www.youtube.com/watch?v=H1eEFfAkIik)
	- [Vue](https://vuejs.org/)
		- [Vue.js Explained in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=nhBVL41-_Cw)
			- [Nuxt in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=dCxSsr5xuL8)
	- [Angular](https://angular.io/)
		- [Angular in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=Ata9cSC2WpM)
		- [Angular is back with a vengeance (youtube.com)](https://www.youtube.com/watch?v=nQ2A30cD3Q8)
		- [The Angular Comeback (youtube.com)](https://www.youtube.com/watch?v=8dwATgntRqc)
		- [Angular for Beginners - Let's build a Tic-Tac-Toe PWA (youtube.com)](https://www.youtube.com/watch?v=G0bBLvWXBvc)
	- [Solid](https://www.solidjs.com/)
		- [Solid in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=hw3Bx5vxKl0)
		- [Svelte, Solid or Qwik? Who Won? (youtube.com)](https://www.youtube.com/watch?v=EL8rnt2C2o8)
#### Component Libraries
We spoke during the sessions about component libraries. Essentially the idea is to bundle up our site into little bricks of functionality that we can use to construct a larger site. Each brick would be called a component, and consist of the HTML/CSS/JS needed to accomplish whatever the component wanted to do. There are tons of component libraries, but I wanted to give you a few options I've found that might be useful for you. You can find even more in our article [How to cheat at CSS | Schulich Ignite](https://schulichignite.com/blog/how-to-cheat-at-css/), this also covers [what Tailwind is](https://schulichignite.com/blog/how-to-cheat-at-css/#utility-classes) if you've never heard of it:

- Pure CSS
	- [Bootstrap](https://getbootstrap.com/)
	- [Bulma](https://bulma.io/)
	- [Materialize](https://materializecss.com/)
	- [W3.CSS](https://www.w3schools.com/w3css/default.asp)
	- [Foundation for sites](https://get.foundation/sites.html)
	- [How to cheat at CSS](https://schulichignite.com/blog/how-to-cheat-at-css/)
- React
	- [React Aria (adobe.com)](https://react-spectrum.adobe.com/react-aria/)
	- [Radix UI (radix-ui.com)](https://www.radix-ui.com/)
	- [shadcn/ui](https://ui.shadcn.com/)
	- [Material UI](https://mui.com/material-ui/all-components/)
	- [NextUI](https://nextui.org/)
	- [Agnostic](https://www.agnosticui.com/)
- Astro/Tailwind
	- [Themes | Astro](https://astro.build/themes/)
	- [Flowbite - Build websites even faster with components on top of Tailwind CSS](https://flowbite.com/)
	- [pingidentity.design](https://www.pingidentity.design/)
	- [Astro - Installation Guide (material-tailwind.com)](https://www.material-tailwind.com/docs/react/guide/astro)
	- [agnosticui/agnostic-astro](https://github.com/AgnosticUI/agnosticui/tree/master/agnostic-astro)
	- [daisyUI — Tailwind CSS Components ( version 4 update is here )](https://daisyui.com/)
	- [Getting started with Astro Framework | refine](https://refine.dev/blog/astro-js-guide/)

### Other things to look into
There's a few other additional resources and topics that might be interesting, and worth looking into:
- Client apps
	- Apps that are designed to run in the browser on the users device like native apps
	- [PWA's](https://web.dev/explore/progressive-web-apps)
	- [Electron](https://www.electronjs.org/)
	- [Expo](https://expo.dev/)
- [Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
	- Allows you to access devices, useful for apps that need access to cameras, bluetooth, GPS etc.
	- [Navigator: geolocation property - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation)
- MIDI
	- Access to MIDI devices like pianos
	- [WEBMIDI.js | WEBMIDI.js (webmidijs.org)](https://webmidijs.org/)
- Additional Resources
	- [Tutorials (joshwcomeau.com)](https://www.joshwcomeau.com/tutorials/)
	- [100+ JavaScript Concepts you Need to Know - YouTube](https://www.youtube.com/watch?v=lkIFF4maKMU)
	- [Archives | CSS-Tricks - CSS-Tricks](https://css-tricks.com/archives/)
	- [Kevin Powell](https://www.youtube.com/@KevinPowell)
	- [Chrome for Developers](https://www.youtube.com/@ChromeDevs)
	- [CSS Tutorial (w3schools.com)](https://www.w3schools.com/css/)
	- [albertwalicki.com](https://albertwalicki.com/blog)
	- [Modern CSS Solutions](https://moderncss.dev/)
	- [CSS { In Real Life } (css-irl.info)](https://css-irl.info/)
	- [Daily Dev Tips just for you - Daily Dev Tips (daily-dev-tips.com)](https://daily-dev-tips.com/)
	- [Design & Development Related Blog (cssauthor.com)](https://cssauthor.com/)
	- [Blog · V8](https://v8.dev/blog)
	- [Blog | WebKit](https://webkit.org/blog/)
	- [devaslife - YouTube](https://www.youtube.com/@devaslife/featured)
	- [Learn JavaScript, React, and TypeScript to Node.js, Fullstack, and Backend | Frontend Masters](https://frontendmasters.com/)
	- [Frontend Mentor | Front-end coding challenges using a real-life workflow](https://www.frontendmentor.io/)
## Backend
Towards the end of the sessions we started looking at the backend. We got into a bit of how some networking worked, and setup a few small apps. If you want to improve your backend skills there are a lot of topics to cover.


### Databases
Databases are how we store data for our applications. There are tons of ways of doing storage, but the most common are relational SQL databases. 

#### SQL
Structured Query Language is the most popular language we use to talk with databases. It also informs how data is stored in a database. Essentially a database like this will store data in a table, the table will have a schema (some fields with data). For example this might be what a User table looks like for storing info:

| Name (Varchar)  | Email (Varchar)             | Age (Int) |
| --------------- | --------------------------- | --------- |
| Kieran Wood     | kieran@canadiancoding.ca    | 25        |
| Lucille Johnson | lucille.johnson@example.com | 37        |
| Lonnie Bell     | lonnie.bell@example.com     | 19        |
| Carole Miller                | carole.miller@example.com                            | 42          |

For this we would say we have a table with 4 rows and 3 columns. The columns make up the schema which is:

- Name: A Varchar (basically a string but with a max length)
- Email: A Varchar (basically a  string but with a max length)
- Age: An integer

Usually databases are their own apps that will run, and then you will connect to them and send your SQL queries. So if the table above existed I could get all rows with people over 30 using:

```sql
SELECT * FROM Users WHERE Age > 30;
```
Which would return a table with our data:

| Name (Varchar) | Email (Varchar) | Age (Int) |
| ---- | ---- | ---- |
| Lucille Johnson | lucille.johnson@example.com | 37 |
| Carole Miller | carole.miller@example.com | 42 |

Or if we just wanted to know how many there are we could do:
```sql
SELECT COUNT(*) FROM Users WHERE Age > 30;
```
Which would return the table

| Count (int) |
| ---- |
| 2 |

You do also have the option of using something like [sqllite](https://www.sqlite.org/index.html) which is a great option for beginners because it's just a file instead of it's own app you run.

**Resources**:
- SQL syntax
	- [SQL Tutorial (w3schools.com)](https://www.w3schools.com/sql/)
	- [SQL Explained in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=zsjvFFKOm3c)
	- [How to learn SQL for free | Roadmap to learning SQL (youtube.com)](https://www.youtube.com/watch?v=a-hFbr-4VQQ&list=PLavw5C92dz9Ef4E-1Zi9KfCTXS_IN8gXZ)
- Other Database systems
	- [PostgreSQL](https://www.postgresql.org/)
		- [PostgreSQL in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=n2Fluyr3lbc)
		- [Learn PostgreSQL Tutorial - Full Course for Beginners (youtube.com)](https://www.youtube.com/watch?v=qw--VYLpxG4)
	- [MySQL](https://www.mysql.com/)
		- [MySQL - The Basics // Learn SQL in 23 Easy Steps (youtube.com)](https://www.youtube.com/watch?v=Cz3WcZLRaWc)
		- [MySQL Tutorial for Beginners [Full Course] (youtube.com)](https://www.youtube.com/watch?v=7S_tz1z_5bA)
- Optimization & the importance of optimization
	- [This single query costs $1,000,000 a month! (youtube.com)](https://www.youtube.com/watch?v=Ckdw7L3JWrg)
	- [Database Engineering - YouTube](https://www.youtube.com/playlist?list=PLQnljOFTspQXjD0HOzN7P2tgzu7scWpl2)

#### No-SQL
No-SQL databases are databases that do not follow the same paradigms as SQL databases. For example [mongoDB](https://www.mongodb.com/) is a document oriented, schemaless database. What this means is that you don't need to know exactly what you want to store before you store it, all you have to define is where you want to store it. So you might have a collection of Users that would look something like this:
```json
{
  "Users":
    [
      {
          _id:"asdfkjhsdahlkfh", 
          name: "Kieran Wood", 
          email: "kieran@canadiancoding.ca", 
          age: 25 
      },
      {
		  _id:"treertyhtreyhrty", 
          name: "Lucille Johnson", 
          email: "lucille.johnson@example.com", 
          age: 37 
      },
	  {
		  _id:"dsfgsdfgsdfgsdfg", 
          name: "Lonnie Bell", 
          email: "lonnie.bell@example.com", 
          age: 19
      },
      {
		  _id:"jhgkghjkddddhfdg", 
          name: "Carole Miller", 
          email: "carole.miller@example.com", 
          age: 42
      }
    ]
}
```

Document oriented is just 1 type of no-SQL database, others include graph databases[^2] [^3] [^4], key-value DB's [^5] [^6] [^7], vector databases[^8] [^9] [^10], etc.

**Resources**
- MongoDB
	- [MongoDB in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=-bt_y4Loofg)
	- [MongoDB Crash Course (youtube.com)](https://www.youtube.com/watch?v=ofme2o29ngU)
	- [Learn MongoDB in 1 Hour 🍃 (2023) (youtube.com)](https://www.youtube.com/watch?v=c2M-rlkkT5o)
- Neo4j (graph database)
	- [Neo4j in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=T6L9EoBy8Zk)
	- [Neo4j (Graph Database) Crash Course (youtube.com)](https://www.youtube.com/watch?v=8jNPelugC2s)
	- [Neo4j Graph Database & Analytics | Graph Database Management System](https://neo4j.com/)
- Redis (Key-value)
	- [Redis in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=G1rOthIU-uo)
	- [Redis](https://redis.io/)
	- [Redis Crash Course (youtube.com)](https://www.youtube.com/watch?v=jgpVdJB2sKQ)
- Chroma (vector)
	- [Chroma (trychroma.com)](https://www.trychroma.com/)
- [7 Database Paradigms (youtube.com)](https://www.youtube.com/watch?v=W2Z7fbCLSTw)

### Networking & Architecture
Throughout scorch we covered various parts of how HTTP worked, and how to deploy your sites using github actions. While our coverage of HTTP covered most of what you needed, there's still plenty more to learn.

#### OSI
HTTP was the main networking we covered, but when we covered it we glossed over tons of steps that are taken before we even get to exchanging HTTP requests and responses. If you are interested in more about HTTP you can see our blog posts building an HTTP server from scratch in python[^11]. But before we even get to HTTP there are a ton of different "layers" to networks. From the physical wires connecting your computer to another, up to the applications running on servers there's a whole world of networking to explore. A structured way to do this is to look into the OSI model[^12] [^13] [^14]. This is basically the model we use to understand networking on computers (though some of it is a bit outdated these days). It's a great way to learn about networks from copper to cloud.

- Resources
	- [NetworkChuck - YouTube](https://www.youtube.com/@NetworkChuck)
	- [Hussein Nasser - YouTube](https://www.youtube.com/@hnasr)
	- [Introduction to the OSI Model (networklessons.com)](https://networklessons.com/cisco/ccna-routing-switching-icnd1-100-105/introduction-to-the-osi-model)
- Videos
	- [What is OSI Model | Real World Examples (youtube.com)](https://www.youtube.com/watch?v=0y6FtKsg6J4)
	- [what is TCP/IP and OSI? // FREE CCNA // EP 3 (youtube.com)](https://www.youtube.com/watch?v=CRdL1PcherM)
	- [how the OSI model works on YouTube (Application and Transport Layers) // FREE CCNA // EP 5](https://www.youtube.com/watch?v=oIRkXulqJA4)

#### Containerization
I briefly mentioned containerization during CI/CD. Essentially this is running a mini-computer inside another computer. This can also be helpful when creating applications. Separating out multiple parts of your app into separate containers and connecting them together is a common pattern to make code re-use and flexibility simpler.

**Resources**:
- Docker
	- [Docker in 100 Seconds (youtube.com)](https://www.youtube.com/watch?v=Gjnup-PuquQ)
	- [you need to learn Docker RIGHT NOW!! // Docker Containers 101 (youtube.com)](https://www.youtube.com/watch?v=eGz9DS-aIeY)
	- [Learning Docker // Getting started! (youtube.com)](https://www.youtube.com/watch?v=Nm1tfmZDqo8)
- Ansible
	- [Ansible in 100 Seconds - YouTube](https://www.youtube.com/watch?v=xRMPKQweySE)
- Articles and talks
	- [Lessons learned from two decades of Site Reliability Engineering (sre.google)](https://sre.google/resources/practices-and-processes/twenty-years-of-sre-lessons-learned/)
	- [The "thundering herd" problem - Nick's Blog and Digital Garden (groenen.me)](https://nick.groenen.me/notes/thundering-herd/)
	- [Microservices Explained in 5 Minutes - YouTube](https://www.youtube.com/watch?v=lL_j7ilk7rc)

#### SMTP (Simple Mail Transfer Protocol)
Another useful protocol to know would be the SMTP protocol. This protocol is what we use to handle email. Learning about how to setup an SMTP server is important because it comes up more often than you think. Want to send a newsletter to someone from your own email, you need SMTP, want to setup a "forgot password" system on your app, you need SMTP. 

- SMTP
	- [What is the Simple Mail Transfer Protocol (SMTP)? | Cloudflare](https://www.cloudflare.com/learning/email-security/what-is-smtp/)
	- [SMTP Basics: How It Works and Why It Matters [2024] (mailtrap.io)](https://mailtrap.io/blog/smtp/)
- DNS records related to email
	- [What is a DNS MX record? | Cloudflare](https://www.cloudflare.com/learning/dns/dns-records/dns-mx-record/)
	- [What is an MX Record, and How Do They Work? (practical365.com)](https://practical365.com/mx-record/)
	- [MX Lookup Tool - Check your DNS MX Records online - MxToolbox](https://mxtoolbox.com/)
	- [What is a DNS SPF record? | Cloudflare](https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/)
	- [Set up SPF identify valid email sources for your Microsoft 365 domain | Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-spf-configure?view=o365-worldwide)

### Frameworks
We talked about UI frameworks and meta frameworks earlier. Both of these approaches are focused on the frontend. They will often allow you to do backend operations, but they are built primarily with the frontend in mind, and try to blur the lines between frontend and backend in many cases. Traditional frameworks are the opposite. The backend is there to have data, to generate the information to send to the client, and the clients job on the frontend is just to display the information, and query the backend for updates. This separation is called Co-location, and it's a reason why frameworks are still popular today. Frameworks are designed typically to be a "batteries-included" option, with standard ways of interacting with databases, doing security, and managing your data. This makes them very idiosyncratic, and some people would argue it makes them easier to work with since there's a "correct way" often.

#### Flask
We covered flask in the sessions, flask is a micro-framework. It provides the tools you need to build your own framework. It will let you do basic routing, and pass data to the frontend. Everything else needs to be installed and configured, but it's a good base to start from.

#### FastAPI
[FastAPI](https://fastapi.tiangolo.com/) is a flask-like framework that has some additional features added. It's primarily a good option when you wan to build some larger API's that **other people** are going to be using. It provides built in:

- Data cleaning + validation
- Documentation of endpoints
- Much faster execution

#### Django
[Django](https://www.djangoproject.com/) is a full framework. It has systems for automating database management, doing security for things like forms etc. It has all the tools you need out of the box to run a full-fledged app, and is designed to be that way. You can even use django just on the backend, and use react on the frontend where it's data is populated by django.

**Resources**:
- [Learn Django in 20 Minutes!! (youtube.com)](https://www.youtube.com/watch?v=nGIg40xs9e4)
- [Django at a glance | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/5.0/intro/overview/)
- [Django documentation | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/5.0/)

### UI Framework Alternatives
We spoke about using frameworks to manage your backend, and then use UI frameworks to manage your state changes, and updates. This is one option, but there have been many systems introduced that can do the same job of a UI library, but without the complexity. Tools like  [alpine js](https://alpinejs.dev/) and [htmx](https://htmx.org/) will allow you to do state changes more simply.

**Resources**
- [htmx in 100 seconds (youtube.com)](https://www.youtube.com/watch?v=r-GSGH2RxJs)
- [HTMX Crash Course | Dynamic Pages Without Writing Any JavaScript (youtube.com)](https://www.youtube.com/watch?v=0UvA7zvwsmg)


### Security
We covered some basic XSS attacks and the idea of sanitization quite a bit in the sessions. This is where the majority of vulnerabilities come up, but it's not everything. The best way to learn more about security is to spend time breaking systems, and watching how other people break in. The best options for this are to sign up for CTF and blackbox challenges. These are challenges where people ask you break into a system for a "flag", which is some text on a server that confirms you broke in. Below are some good CTF and blackbox challenges + some other great resources.

**Resources**:
- CTF and Black Box challenges
	- [Sharishth/ctf-practice: Practice your hacking skills with these CTFs (github.com)](https://github.com/Sharishth/ctf-practice)
	- [Seela](https://seela.io/en/blog/top-5-des-meilleures-plateformes-de-ctf-capture-the-flag/)
- Good talks & example exploits
	- [The dark side of open source productivityBy Jamie Scott (youtube.com)](https://www.youtube.com/watch?v=raE7J9zafLk)
	- [Lord of SQLInjection - Banshee (youtube.com)](https://www.youtube.com/watch?v=nYJ7ecYxHN4)
- Other resources
	- [John Hammond - YouTube](https://www.youtube.com/@_JohnHammond)
	- [LiveOverflow - YouTube](https://www.youtube.com/@LiveOverflow)
	- [NetworkChuck - YouTube](https://www.youtube.com/@NetworkChuck)


## General
This section is just a section of links to various concepts, blog posts and websites that can also be useful in no particular order:

- [Dogfooding](https://www.nytimes.com/2022/11/14/business/dogfooding.html)
- [CodeCrafters | Advanced programming challenges](https://codecrafters.io/)
- [LeetCode - The World's Leading Online Programming Learning Platform](https://leetcode.com/)
- [Fly.io Distributed Systems Challenge · Fly Docs](https://fly.io/dist-sys/)
- [Reflections on a decade of coding (scattered-thoughts.net)](https://www.scattered-thoughts.net/writing/reflections-on-a-decade-of-coding/)
- [100+ Web Development Things you Should Know - YouTube](https://www.youtube.com/watch?v=erEgovG9WBs)
- [Run GUI Applications in a Docker Container | by Gursimar Singh | Medium](https://gursimarsm.medium.com/run-gui-applications-in-a-docker-container-ca625bad4638)
- [Containerization Explained | IBM](https://www.ibm.com/topics/containerization#:~:text=Containerization%20is%20the%20packaging%20of,runs%20consistently%20on%20any%20infrastructure.)
- [Introduction to Containers: Basics of Containerization | by Animesh Gaitonde | Geek Culture | Medium](https://medium.com/geekculture/introduction-to-containers-basics-of-containerization-bb60503df931)
- [About Me (codinghorror.com)](https://blog.codinghorror.com/about-me/)
- [Shopify Engineering](https://shopify.engineering/)
- [Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/)
- [Engineering at Meta - Engineering at Meta Blog (fb.com)](https://engineering.fb.com/)
- [Netflix TechBlog](https://netflixtechblog.com/)
## Conclusion
Web development is very complicated. There's a lot of moving parts. I would recommend just taking it one concept at a time, and not worrying about knowing everything. If you get good in one area you often don't need to learn other areas (but you should because they're fun). Take your time, build projects you like, and keep your passion for coding ignited!

[^1]: [The Problem with Typescript’s Types | by Chris Grounds | Medium](https://medium.com/@iamchrisgrounds/the-problem-with-typescripts-types-1ee92ba7ec39)
[^2]: [What is a Graph Database? - Developer Guides (neo4j.com)](https://neo4j.com/developer/graph-database/)
[^3]: [What Is a Graph Database? (amazon.com)](https://aws.amazon.com/nosql/graph/)
[^4]: [Graph database - Wikipedia](https://en.wikipedia.org/wiki/Graph_database)
[^5]: [What Is a Key-Value Database? (amazon.com)](https://aws.amazon.com/nosql/key-value/#:~:text=A%20key%2Dvalue%20database%20is,serves%20as%20a%20unique%20identifier.)
[^6]: [What is a Key-Value Database? | Redis](https://redis.com/nosql/key-value-databases/)
[^7]: [Key–value database - Wikipedia](https://en.wikipedia.org/wiki/Key%E2%80%93value_database)
[^8]: [What is a vector database? | Cloudflare](https://www.cloudflare.com/learning/ai/what-is-vector-database/#:~:text=A%20vector%20database%20is%20a,and%20text%20generation%20use%2Dcases.)
[^9]: [What is a Vector Database & How Does it Work? Use Cases + Examples | Pinecone](https://www.pinecone.io/learn/vector-database/)
[^10]: [Vector Database | Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/memories/vector-db)
[^11]: [Writing your own HTTP server | Schulich Ignite](https://schulichignite.com/blog/hhttpp/series-introduction/)
[^12]: [OSI model - Wikipedia](https://en.wikipedia.org/wiki/OSI_model)
[^13]: [What is the OSI Model? | Cloudflare](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi)
[^14]: [What is OSI Model | 7 Layers Explained | Imperva](https://www.imperva.com/learn/application-security/osi-model/)