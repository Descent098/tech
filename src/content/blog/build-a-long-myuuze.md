---
title: "Build-a-long: Myuuze"
subtitle: Building a self-hosted music management platform
description: The thought process and tech behind the project
pubDate: 2025-11-30
heroImage: /tech/blog/build-a-long/myuuze/hero.png
tags:
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
  - astro
  - build-a-long
---

I listen to a lot of music. As such I have used many music management and listening systems including (but not limited to):

- Itunes (RIP)
- Google Play Music (RIP)
- Pandora (RIP)
- Apple Music
- Youtube Music
- Amazon Prime Music
- Tidal
- Deezer
- Mp3Tag + VLC/winamp

I have been using Spotify for many years at this point, and it's the one I've mostly landed on. It works great for %80 of my use case. The social aspect is great, it has clients on every device you could want, chrome-cast, streaming audio, what's not to love?

## Background

Spotify solves %80 of my use case, but man, that %20 is rough. **A lot** of music that I enjoy was either never on Spotify, or has been removed for various reasons. I was talking to my girlfriend about some of the music I used to listen to a few years ago, and when I went back to one of my playlists over 100 of the songs were removed:

![](/tech/blog/build-a-long/myuuze/missing-songs.png)


There's probably some good legal reason for why to do with contracts, but honestly I don't care. As a user I just care that my music is now gone, some of which I might not be able to find again. It echos back to problems like when [sony was going to remove people's videos they "owned"](https://consumerrights.wiki/w/Sony%27s_attempted_removal_of_%22purchased%22_content). 

Unlike Google Play Music (RIP), Spotify's solution for adding your own files to your library was pretty janky. You used to have to have a device connected with the files, you could then add them to a playlist, and then on another device download them while that device also had spotify open. It worked (kinda), but it was error prone, and caused a bunch of problems. Nowadays spotify will let you specify a local folder and just use it like a local folder, but the same syncing issues still apply. So, what if we become Spotify?

Well, actually I don't really want to do that. Spotify is great and all, but I'm not actually trying to replace it entirely. Instead I want a system that allows me to:

- Have my own library on a server
- Help me to organize my library
- Not lock me in to using the platform
- Be able to play those songs remotely
- Give me analytics and info about how I listen to my music
- Be easy to setup and maintain

I will then keep my Spotify subscription for:

- Recommendations of music
- Social features like sharing songs, playlists and jams
- Use in car play/android auto
- Listening to tracks I don't want to buy

### Feature Inspiration

It's always good to start with looking at what exists to see what you like, and hate.

#### Music Players


Most music players are pretty same-y. I need a queue of what I'm playing, I want to be able to add/remove things, and re-order the queue. On top of that some audio controls like which audio device to output to, volume, shuffle and repeat would be nice. So, I didn't need much inspiration for the music player itself considering I basically described VLC's controls, and every other music player on my list from earlier.

![](/tech/blog/build-a-long/myuuze/ui-comparison.png)

Honestly speaking there's nothing particularly stand out about any of them, and (spoiler) for this first version I'm probably going to just slightly update the example UI available on [daisy UI](https://daisyui.com/) which is my design library of choice.

![](/tech/blog/build-a-long/myuuze/daisy-music-player.png)

I will need to add some stuff like a UI for seeing the queue, and a "now-playing" section with more info than just the audio title, but it's probably a good start.


#### File Organizers

There are some planned features that took heavy inspiration from some other systems notably [Romm](https://romm.app/) and [Booklore](https://github.com/booklore-app/BookLore). Both of these apps are systems to manage your game ROM's and books respectively. 

[Romm](https://romm.app/) operates based on a set file/folder structure that encourages you to keep things organzied (`library/{platform}/roms/{game}` e.g. `library/gba/roms/{game}.gba` for gameboy advanced games), and provides an upload interface that also helps to do just that. [Romm](https://romm.app/) also has several built in metadata providers that allow you to quickly find the game you're looking for, and get it organized. You just add the files, and then you "scan" through them to find matches.

![](/tech/blog/build-a-long/myuuze/romm-example.png)

Above is a file I had called `stairs.zip` that I put in `/library/win/roms/stairs`. It's an obscure game from 2015 that was released for free, and I was able to add it's metadata by finding it's [entry](https://www.igdb.com/games/stairs) and ID on [IDGB](https://www.igdb.com/). [Romm](https://romm.app/) did the rest of the work for me, and for most games you don't even have to do that, just putting a folder or file with the game name is enough. It does store the metadata it collects in a database that is annoying to try to port away from, but overall it empowers you to make **your plain files work for you**. 


[Booklore](https://github.com/booklore-app/BookLore) takes this to another level. [Booklore](https://github.com/booklore-app/BookLore) starts by giving you 2 options:

![](/tech/blog/build-a-long/myuuze/booklore-ui.png)

1. Upload books (individually or as a back)
2. A "dump" folder called `bookdrop`, where your unorganized files live until you're ready to organize them and clean them up. Once you do input the metadata for them, it will let you write that metadata **back to the file**, so it's stored with the plain file if I leave booklore


Here is what me processing the Epub copy of virgil's Aneid from project guttenberg looks like. I put the `pg228-images.epub` in my `/bookdrop` folder, and am greeted with this UI:

![](/tech/blog/build-a-long/myuuze/booklore-processing.png)

After filling it all out I went from a random file called `pg228-images.epub`, and in seconds had the book organized into a folder with metadata attached. This is possible because booklore allows "patterns", for example my main book pattern is `{authors}/<{series}/><{seriesIndex}.> {title}`. This basically says, when done processing the file use the metadata to put the book in a folder starting with the author, then the series info (if available), then the title, for example: `/J.K. Rowling/Harry Potter/01. Harry Potter and the Sorcerer's Stone.pdf`. 

![](/tech/blog/build-a-long/myuuze/patterns-example.png)

This means that my processed "libraries" go from a dump of a bunch of PDF's and EPUB's to several top level folders ("libraries", in my case `books`, `papers` and `comics`) that each contain a programmable folder structure that is automated for me, and reactive to updates I apply in the app. Essentially I can take the folder with my libraries, and copy it anywhere **without losing the effort I put int organizing it**.

## Getting started

So, a nice music-management server. Right off the bat I realized that I might want to change some of the decisions I make down the road, so before even starting the code I decided I would write up a specification. This specification would determine on the server:

- What API routes exist
- A database schema (optional to use, but highly recommended)
- A flexible way to tell clients what capabilities you have, with room for plugins/extensions

This... is actually really hard. Planinng an entire data model up front with no real domain knowledge from a backend perspective is a terrible idea. 

I also realized I wanted to have a few different versions of the servers that supported different things. For example a `single-user` server intended to be dead simple to setup, just run a binary in a folder, and put your files into the "dump" folder, and open a browser. This is perfect for people who:

1. Want to just try myuuze
2. Don't need anything more than what's offered by the single-user version

This server would be designed **without any application-level auth**, instead leaving that to gating the application behind a proxy like [pangolin](https://github.com/fosrl/pangolin) or locking it down to just running locally. This would also allow me to test very easily which is nice. But, eventually I would like to have a server version that does have **application-level auth** and extra tweakable config for people who want a more in-depth experience. 


With this dilema occuring on **literally the first day** I decided I would start with the `single-user` version, and build the `multi-user` one down the road with something like [OIDC](https://openid.net/developers/how-connect-works/) and a proper permissions system. In the meantime for the `single-user` version I will make the basic plans of what I want to do as categories of routes, implement them with a frontend, adapt as I go, and create the specification based on what I write! This ended up looking something like this:

```
/song/<ID>
/album/<ID>
/artist/<name>
/songs/<filter>
/albums/<filter>
/recents
/popular
/analytics/<event>
```

This structure gives me the very basics of what I needed to get started with the frontend, and for now we'll deal with the "dump" portion of the app later. I reserved `/scan` and `/dump` routes for whatever I needed to do, and decided I would fill in the details later. I decided I want to **force** people to use the dump method for uploads, so even when you "upload" it all still goes to the "dump" folder. If someone tries to manually add files to the "library" folder, **they won't show up in the UI**. This means that I can **guarentee** all entries that are in the DB have been processed at some point. So, I can get the speed of a database, while still having the file-system-first approach to the organization. I can then implement some sort of background task that can run on an interval to cull entries from the database that no longer have the files associated available in the system, and have it move "unprocessed" library files to the "dump" folder.

## Structure

With these high level ideas in place I went to work setting up all the repo's, and peices I would need. I setup a github organization, and a bunch of repo's that I would work from:

- [oragnization](https://github.com/Myuuze)
	- [Information Site/Homepage](https://github.com/Myuuze/Myuuze.github.io); A webpage for people to learn about the project
	- [local-server](https://github.com/Myuuze/local-server); The reference implementation of the `single-user` server
	- [frontend](https://github.com/Myuuze/frontend); [AstroJS](https://astro.build/) based frontend using [tailwind CSS](https://tailwindcss.com/) + [daisy UI](https://daisyui.com/)
	- [specifications](https://github.com/Myuuze/specifications); The official specifications for the server(s). This will allow people to re-implement them in whatever stack they want, and retain compatability with the frontend

I still had not yet figured out what I wanted to do with user docs, but I was eyeing [starlight](https://starlight.astro.build/) since it was also astro based, or [zensical](https://zensical.org/) which had just released. I'll cross that bridge when I'm ready, but for now, let's get building.

## Initial attempt

Because I am doing all the work for this project I needed to first start building out a backend, in order to build a frontend, to decide what I need for the frontend. So, a mini v1 was in order. This version I wanted to:

1. Be able to just directly store a bunch of files that already have metadata (no "dump" yet), basically just strip the metadata from the `.mp3` or `.flac` files directly and put it into a db (backend)
2. Build out a simple music player that just grabs an endpoint, takes in all the songs, and puts them into an array that it plays through 1 by 1 (backend/frontend)
3. Get a basic skeleton UI, and figure out the feel (frontend)

### Backend

For the [server](https://github.com/Myuuze/local-server) The full stack is:

- [golang](https://go.dev/): I wanted to use go because of it's simplicity, my familiarity, and because it allows you to cross-compile to multiple targets. Meaning I would have a garbage collected language that is easy to iterate with, has good tooling
- [fiber](https://gofiber.io/): As the web framework. Probably didn't need it necessarily, the built in http library can handle everything I'm doing as of go 1.23. I am a bit familiar with it, and need it for another larger project I'm working on, so nice to get more experience.
- [sqlite](https://sqlite.org/index.html): I was planning on using a "real" db down the road, but with the [WAL](https://sqlite.org/wal.html), [Normal Synchronus](https://sqlite.org/pragma.html#pragma_synchronous), [threads](https://sqlite.org/pragma.html#pragma_threads) and [foreign keys](https://sqlite.org/pragma.html#pragma_foreign_keys) PRAGMA's (settings), and some of the [go connection pool concurrency options](https://github.com/Myuuze/local-server/blob/f74820c38db4331e7f325f21f80fcc21d9009514/database/utilities.go#L94-L137) sqlite is plenty fast enough for data at this scale. Beyond ~500,000-750,000 rows it starts to slow down, but before then it's performant and **simple**.
- [sqlc](https://sqlc.dev/): I've been wanting to use sqlc for a while now. Essentially you write a quick [config file](https://github.com/Myuuze/local-server/blob/f74820c38db4331e7f325f21f80fcc21d9009514/sqlc.yml), then all of your normal [queries](https://github.com/Myuuze/local-server/tree/f74820c38db4331e7f325f21f80fcc21d9009514/database/definitions/queries) and [table schemas](https://github.com/Myuuze/local-server/tree/f74820c38db4331e7f325f21f80fcc21d9009514/database/definitions/schemas) into `.sql` files with comments above to tell sqlc what the function signature should look like. You then run `sqlc generate` and it will create type-safe bindings for your queries. It saves time, comes with validation when updating schemas, and allows quick changes to other DB systems, all while adding basically 0 overhead. The big difference between it and an ORM is that sqlc runs **native sql queries**. There's no "engine" overhead, and it means the resulting file is very human-readable.

With these choices we have a **very** simple architecture making our backend quite easy to understand:

![](/tech/blog/build-a-long/myuuze/backend-setup.png)

The primary hurdle at this point was images. I was tempted to introduce something like [minio](https://github.com/minio/minio) or a separate microservice to make accessing the album covers easier, but instead I went with a tried and true classic, [base64](https://www.freecodecamp.org/news/what-is-base64-encoding/). For those of you who don't know base64 is an encoding standard that lets you turn large blobs of binary data into text strings. This is handy because you can load these strings as images on the web (using a [URI](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)). [This tool](https://onlineminitools.com/random-base64-image-generator) will let you generate random ones, or you can [convert an image here](https://b64encode.com/tools/image-to-base64/), or [view a base64 string as an image here](https://b64encode.com/tools/base64-image-viewer/). The format is pretty simple, the string is `data:<MIME TYPE>;base64,<binary data>`, where you have your [MIME Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types) (i.e. `image/png` for png's), then the binary data is just the result of feeding the image bytes into a base64 encoder:

![](/tech/blog/build-a-long/myuuze/base64-pipeline.png)

Base64 encoding typically **adds** size overhead, making images larger (%30). In my case the images were typically huge (`1-40mb+`), so sizing down to 300x300 and compressing before encoding made the resulting 20-40kb string over 100 times smaller on average. In my testing at this point on my machine after [multithreading the processing code]() my 10,000 song 200GB+ library of music was able to be processed and serialized down to a ~90MB database file. I think this is acceptable for now, but it's something I will continue to itterate on, playing with the resolution, compression, and encoding options to try to find a good balance. In the meantime I had other fish to fry

The last issue I encountered that gave me grief was songs. Initially my server was fine just having a `/songs` endpoint that returned **everything**. I was astonished at how well it was handling everything. Unfortunately (foreshadowing) the browser was not so fortunate. I ended up having to [paginate](https://www.dashbase.ai/blog/pagination-sql-limit-offset) essentially every route, and allow for a [config value](https://github.com/Myuuze/local-server/blob/f74820c38db4331e7f325f21f80fcc21d9009514/core/types/types.go#L59) to be set with how many max songs per request can be returned. 

At this point of the article [this commit](https://github.com/Myuuze/local-server/tree/f74820c38db4331e7f325f21f80fcc21d9009514) is where I'm at with the backend.

### Frontend

For the frontend the stack I went with was:

- [astroJS](https://astro.build/): The framework I'm using as the base to generate my site. It has tons of great features, and is designed to be leaner than many of the alternatives since most of the site can be statically generated.
- [Tailwind CSS](https://tailwindcss.com/): The css framework necessary to use daisy. I'm not necessarily a fan, but it works for what I need in this case, and is the de-facto in the industry oftentimes so it has many resources
- [Daisy UI](https://daisyui.com/): The component library that will help make a lot of the design work simple, as well as make implementing themes much easier
- [AlpineJS](https://alpinejs.dev/): Alpine is nice for adding some types of interactivity, and especially for handling UI initialization/hydration
- [Webcomponents](https://www.webcomponents.org/introduction): A web standard way of creating re-usable components that have baked-in reactivity
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): A web standard way of storing data in the browser, this will be useful for caching and persisting settings

I should say off the bat I have much less experience in frontend, especially in the javascript framework world. Some of these choices were probably redundant, but I worked with what I knew how to do. Speaking of, I managed to throw together a working demo of the frontend and backend over ~2 days. It was pretty janky, there was just an array that would hit `/recents` and that was your queue, but it gave me some hope that it wouldn't be as hard as I thought it would be to build something of this complexity. I ended up with a dark and light theme varient that looked like this on the homepage:

![](/tech/blog/build-a-long/myuuze/ui-v1-dark.png)
![](/tech/blog/build-a-long/myuuze/ui-v1-light.png)

I've been using a lot of [gruvbox](https://github.com/morhetz/gruvbox) inspired themes for my desktop, IDE, and [obsidian](https://obsidian.md/) recently, so I decided to make the light theme gruvbox based. Daisy makes creating themes [quite simple and interactive](), at this point I just want the two themes, but it would be nice to be able to add more down the road if I want, and possibly allow users to define their own. I also decided to just add a linear gradient to any albums that didn't have covers:

![](/tech/blog/build-a-long/myuuze/album-v1-no-cover.png)

I also had a now-playig navigation that worked with simple album and artist pages:

![](/tech/blog/build-a-long/myuuze/album-artist-v1-demo.gif)

I did however come to the realization that my current approach was absolutely not going to scale to any of the features I wanted. The current designs main issues were:

- Theme did not persist, would choose based on OS preference and refresh on every page load
- The queue would rebuild on every refresh
- The queue would not support fancier features like adding "quick" items without major issues
- I was storing a ton of crap in the browser, and it was eating memory up
- I was hitting [`Audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio) limits

The last point needs a bit of explanation I think. In the browser you would typically load audio in through the `Audio` object in javascript. This is actually a really slick system that allows you to do a bunch of fancy stuff like streaming data by default. Unfortunately, a major issue should start to become apparent by now... If I have 10,000 songs, what happens when you try to load them in?

Actually everything works until 1000 of them, then you hit the [defined limit](https://chromium-review.googlesource.com/c/chromium/src/+/3057111) in most browsers, and it just says **NO**. "just don't load them in then" you might say, or "load them as you go". I have a need... a need for speed. Because of that need I want to have things cached and just ready to go as fast as possible. That being said, these limits are also quite oppressive on mobile, so I needed a more clever option, one that would require a refactor. Being that I already hated having to write any javascript code, I wanted to try vibe coding a solution. 

At this point in the article [this commit](https://github.com/Myuuze/frontend/tree/3464c8f602d5d9f80ab2b72b5e42e2e9696f9a58) is where I was at with the fontend.

## Phase 2

Seeing that there was going to be a number of changes I needed to make after my first "working" demo, I consider this next section to be the second phase. I'm pretty well planned out, and know what I want to do, and how I want to do it. Now it's just a matter of getting it done.

### Frontend

Last episode I had decided to 🤖🧠 v̸͉͇͌̇̄͘i̵̱̝͕̝͍͎̟͍͛̏͐̈̽͂̓͘ͅb̵͓͍̥͇̼̗͇̞̩̏͊̀̎ͅé̷̬̩͐̿͂̓ ̸̡̬͚̼͚̰̭̩̺̓̿̈͒̍̓̅̚̚ͅc̴͚̯͔̺̼̮̝͓͊͑̊o̵͉͈͚͓͗͐̑͜d̷̗͉͓̾̋̿̊̒̅͝ȅ̸̩̾̌̋͊ 🧠🤖 away my problems

![](/tech/blog/build-a-long/myuuze/cash-macanaya-X9Cemmq4YjM-unsplash.jpg)

*How I thought this would go ([credit](https://unsplash.com/photos/two-hands-reaching-for-a-flying-object-in-the-sky-X9Cemmq4YjM))*

I wasn't going to be like the other boys, you see I had a plan. I had an idea for an architecture, and decided to try vibing it. Javascript is the language of choice for LLM's, and we're a few years into 6 months from it taking everyones job. This is a job I would be happy to let it steal quite frankly. 

I'm not a total beginner to AI. Typically I just use AI for stuff I'm too lazy to do, like writing unmarshalling code for JSON types by hand, scouring for browser API's, or reformatting all my `print()` debug statements into nicer logging formats (great reasons to burn a rain forrest per generation). I had already used it earlier to help with the image resizing code, and some of the knobs to tweak in sqlite because I couldn't easily find good documentation on it. 9 times out of 10 I would rather just do complicated things myself so I know I can support the code, but this time I was feeling the 1/10 fiesty time (and also was lazy). This was my first time doing something relatively complex, so I gave GPT my breakdown, my [existing component](https://github.com/Myuuze/frontend/blob/3464c8f602d5d9f80ab2b72b5e42e2e9696f9a58/src/components/MusicPlayer.astro), a structured prompt of what I wanted changed, and... yeah of course it didn't work. The one time AI could have been actually useful to me, and it was worse than useless.

I ended up [nerdsniping](https://www.explainxkcd.com/wiki/index.php/356:_Nerd_Sniping) myself for so long trying to make it work that I probably could have been done already doing it manually by the time I was actually restarting from scratch to do it manually. I literally wasted a whole day's worth of progress and 6 separate restarts for utter garbage. The problems I ran into (certainly not limited to just these):

- It trying to cache every image from every request to localstoarage and causing cascading errors because it was consuming too much space (2MB is the top end of what's "safe" to store and it was trying to store ~80-90MB)
- It screwing up an unnecessary recursive call with no base case, and just running until it crashed the tab
- Deleting the guards I had in place to stop multiple audio elements from playing at once, and trying to play 20-1000 songs simultaneously
- Deleting my icons and replacing them all with text
- Trying to import made up dependencies, in one case a [typosquatted](https://en.wikipedia.org/wiki/Typosquatting) seemingly malicious repo
- Forgetting it was in astro entirely, and generating random react snippets
- Trying to run 2 separate "storage management" classes it created that would trample one another and lead to constant null/undefined's that would break the UI randomly
- Some of the least-optimized code that involved multiple copies of the same array of songs wasting tons of memory
- Incoherrent patterns where it added parts of several other types of solutions together, but didn't orchestrate them together, and broke everything
- etc.

After getting pissed off I worked on some other aspects:

- Created a proper settings page with ability to specify your server URL, theme choices, and the ability to customize the default image settings all persisted to localStorage
- Unified all the icons with [boostrap icons](https://icons.getbootstrap.com/)
- Finalized the navbar
- tweaked the homepage
- Added stub pages for dump/import, analytics, library

With the human back on the case, I managed to get a lot done in half a day:

![](/tech/blog/build-a-long/myuuze/ui-2-updates-1.gif)

But it was time to face my demons and rewrite the music player. So I sat down, and came up with a plan. Essentially all of my data would comfortably fit into memory except audio files and album covers. So, I decided to create a few [sliding windows](https://medium.com/@megha_bh/mastering-the-sliding-window-technique-a-visual-guide-with-mind-map-751cebf936e0). My server would give me **all** of the information about everything on each request, and from there I would implement a system that would decide what's important to keep in a persistent cache. I noticed that audio was almost unnoticeable to load because:

1. It was streamed in
2. It was requested over http which means the browser will also do some nice caching for us

So, that cache of audio objects could exist ephemerally and be fine. But, what about the album data, in particular the covers of albums? This is where I needed to get a bit fancy. I started with something like this:

![](/tech/blog/build-a-long/myuuze/initial-v2-plan.png)

Where:

- `queue` would be an array of song ID's ([uuidv7's](https://uuid7.com/))
- `currentSongIndex` would be an integer to the index of where the user was in the queue
- `SongData` would be a mapping of song ID's to an object containing the song data, which in turn would reference some sort of `AlbumData` object
- `SongAudio` would be the ephemeral map of song audio data, it would act as a "sliding window" with a setting to define how many to keep in memory at one time
- `Covers` Another "sliding window" that would be cached, and would contain the album covers of a bunch of a set number of albums

While this might seem complicated (and it was to plan out), the actual implementation is deceptively simple. I would have my `MusicPlayer` web component (wrapped in an astro component) that would handle the `queue`, `CurrentSongIndex`, and user interactions. I would then have a `SongMetaData` and an `AlbumMetaData` class. To the code from the music player it would be interacting with just those two classes, but under the hood each of them would use [static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static) attributes and methods to manage the `SongData`, `SongAudio`, `Covers` and the caching of all these values. This is somewhat memory and CPU wasteful because you're constantly making new objects and deleting them, but this was the nicest conceptual way I could think of for how to do this. 


