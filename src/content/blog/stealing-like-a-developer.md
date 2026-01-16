---
title: Stealing Like a Developer
subtitle: Using other people's code
description: "Ever wondered what open source software is? What about how to use other people's code appropriately? We cover the basics of licensing and vendoring in this article!"
pubDate: 2023-03-13T00:00:00-06:00
modified_date: 2023-03-13T00:00:00-06:00
heroImage: /tech/blog/stealing.jpg
crosspostURL: https://schulichignite.com/blog/stealing-like-a-developer/
tags:
  - scorch
  - web
  - legal
  - open-source
---

No one writes all their own code. We always build on the shoulders of the people that came before us. But how do we do this responsibly, and legally? 

If I see a website I like why can't I just copy the HTMl, CSS, and Javascript then host it myself and change the name? In this article we're going to go over some of the basics of copyright, licensing, and different source code types. 

## Disclaimers and notes

**This is not legal advise**, if you're going to put this into practice get it looked over by a lawyer first. We're not responsible if something goes wrong, I'm a developer not a lawyer. 

On top of that, a few things to consider while reading:

1. Laws change over time
2. Laws are different in different countries
3. Legal systems are often not intuitive. Don't just assume it works "the obvious way", look it up, or ask a lawyer

## Leagalese

There are a lot of terms in this post that are legal terms. Any that aren't explicitly defined you can find here:

- Intellectual Property: The ownership of an idea. For example a cartoon company may own the intellectual property (IP) to a character in their shows. This means other people can't use the character without talking to them first.
- Proprietary: Created by and for someone. For example a company may create a proprietary algorithm to recommend videos to users. 
- Fraud: Knowingly lying to someone in order to gain something. For example lying about being able to speak a language in order to get paid to be a translator.

## Licensing

A license is basically the thing that tells you what you can do with some software. Sometimes you buy "license keys" in order to gain access, othertimes the licenses are implicit, meaning you agree to them when you use the software. These **must** be stated either somewhere in the software, and/or **must** be available in some form to be considered valid. That means if you are just providing a binary/executable, you must have some way for someone to read the license that is available to them. 

Generally in software development we care about licenses for source code (code used to create the program), but licenses can exist in many forms. For example you might buy a license to use a photo, or to "unlock" a piece of software etc. 

Source code licenses can be used to determine:

- If you can use the code in your project
- If you can use the project name in your project
- If you have to send back any changes you make
- If you are allowed to make any changes to the code
- If you are allowed to use the code without purchase
- If the code comes with a warranty 
- If you can change the license to the code & usually which are "compatible"
- etc.

There are a few common misconceptions about source code licenses:

- Projects don't have to have **just 1** license, portions of the code can be licensed differently (this gets messy though)
- Licenses do not imply [copyright](#copyright), just because facebook lets you use code they distribute doesn't mean you can use their brand name

### Open source

Open source is the idea of having people publish the source code to their projects. This means that people "have the freedom" to know what is running on their computers. The argument is that in the same way you can open up an engine in a car, you should be able to "open up the engine" of software.

Other benefits:

- People who want a feature can create it and contribute it back to the project for other people to use
- Bugs and security flaws can be found and patched
- People can learn from existing code
- Privacy audits can be done on code you are running
- Can take [libraries and API's](#apis-and-libraries) and stick them together to build a bigger overall project

Open source is **very** popular in software development. Many of the projects that power the internet are open source. Here are a few examples:

- [linux kernel](https://github.com/torvalds/linux); What runs all "linux" operating systems, which account for over %90 of server market share [^1]. 
- [Bootstrap](https://github.com/twbs/bootstrap); Popular CSS framework used to build over %20 of sites [^2] 
- [Python](https://github.com/python/cpython); Yep the source code for the python programming language is fully open source and you can see exactly how it works

There are many more examples, but basically most of modern development runs on open source!

#### Copyleft

Copyleft is the opposite of copyright. Instead of being closed by default any copyleft licenses will require derivative products (products made with code that is copyleft) to also be open source. For example [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/) requires you to disclose the source code:

> To protect your rights, we need to prevent others from denying you
> these rights or asking you to surrender the rights.  Therefore, you have certain responsibilities if you distribute copies of the software, or if you modify it: responsibilities to respect the freedom of others.

> For example, if you distribute copies of such a program, whether
> gratis or for a fee, you must pass on to the recipients the same
> freedoms that you received.  You must make sure that they, too, receive or can get the source code.  And you must show them these terms so they know their rights.

As well as other things like disclose any changes, and you also must maintain the license in any derivatives. This means if you create a new project based off a GPLv3 codebase, your code has to adhere to the same rules!

#### Free as in freedom, not in price

Lots of people refer to open source as "free software". The idea isn't that the software doesn't cost anything, but rather that the person using it has the freedom to know what's happening with **their device** while they're running the code. Likewise people have the **freedom** to be able to modify the code to add patches/fixes for their problems.

This is also intended to address issues like:

- When a company stops selling a product you should still be able to keep it running (especially if you bought it)
- You should know how your data is being processed, and be able to trace it in the code
- You shouldn't have to "trust" that a company is doing what they should be. You should also be able to verify it

#### Common open source licenses

In the open source community there are lots of licenses, and families of licenses that come up a lot

- [MIT]() is an incredibly popular license that is incredibly permissible. It lets people do (mostly) whatever they want with the code, while still refusing to supply a warranty. When in doubt, I highly recommend it.
- GPL is a family of licenses. The two most popular are (there's also [AGPL](https://choosealicense.com/licenses/agpl-3.0/) and others)
  - [GPLV3](https://choosealicense.com/licenses/gpl-3.0/); Highly popular option that requires people to make any derivatives based off the software also open source.
  - [LGPLv3](https://choosealicense.com/licenses/lgpl-3.0/); Has similar terms to GLPv3 except if the project only includes the code to be used as a [library](#apis-and-libraries) then the remainder of the program doesn't have to be under the same terms
- [Creative commons](https://creativecommons.org) is a family of licenses that are generally permissive, but each "code" has different requirements to satisfy. One thing to keep in mind is that the license is **non-revokable**, meaning even if you want to stop sharing later anyone who has copies can do what they want so long as they're within the original terms. You can see the full list [here](https://creativecommons.org/about/cclicenses/), but some common  ones include:
  - CC-BY: You can do what you want, but the original creator must be credited somehow
  - CC-BY-SA: You can do what you want, but the original creator must be credited somehow and all adaptations must have the same terms
  - CC-0: The work is fully public domain and you give up all rights (including copyright) to the content
- [Apache 2](https://choosealicense.com/licenses/apache-2.0/) is a common license for big company projects because it allows a project to be open source, while keeping people from being able to use your trademarks

### Closed source

Closed source is what most people will think of as the "default" way to do things. Essentially this means that the source code used to create an app is not disclosed. So for example if you have a large company that distributes videos, you may have no idea what code is running on their servers to process your data. It's important to keep in mind that closed source does not guarantee that something is **proprietary** (created by the company, for the company). Many closed source systems actually rely (sometimes entirely) on [open source](#open-source) software.

Assuming the other software you're using does not have any conflicts with the licenses it is perfectly fine to write closed source software. 

There are some valid reasons to do so:

- You are one of the first groups in a field and want to keep your head start
- You are using methods of solving a problem that haven't been patented/published yet
  - Many countries use a "first to patent" approach, meaning even if you created the technology you can be sued out of using it if someone patents it before you
- You just don't want people to use your code

#### Bad reasons to do closed source

With everything being said, some people opt to do close source for bad reasons. Here are a few **bad reasons** to do closed source.

##### Security through obscurity

The idea is that something can be secured by just making it hard to find. For example you might have a "closed source" file with all the passwords in it, or a server that uses an encryption key in a weird directory so people are less likely to find it.

One real world example of this was a story I heard from someone who wrote firmware for a router company that used to "trust" devices by having them send signals with set time intervals. So for example it would send a letter "a" after establishing a connection at 1, 1.3, 1.5, 1.8, and 3 seconds. The idea being this pattern was so "random", that it should be secure.

**This isn't security**, at best it's just inconvenient for people trying to steal your information. Close sourcing something because you don't know how to do security is just irresponsible, not clever. People should be able to know which encryption system, or software your using and **still not be able to break in**. If just having to know some small piece of information allows people to break in, then it's just a matter of your project having information worth stealing before someone will get in.

##### Uniqueness/proprietary system

Many times when people are creating projects they intend to sell they will try to not be transparent with the technologies they use. If they create websites they want customers to think they use some "special sauce" system to create them that requires the company. This being a reason to close source is also a bad idea if you are actually just using open source projects to build with. Not only because it's dishonest, but depending on what you're doing the claims themselves can be illegal. 

If you lie to someone in order to get them to work with you you're committing fraud. It's fine if you don't want people to know what you're using, but trying to hide behind closing your source to ramp up the price can create a lot of problems.

## Vendoring

Vendoring is the name given to importing other people's code to use in your projects. In some frameworks there will be dedicated folders for this (`/vend`, `/vendor` etc.). This can mean bringing in small pieces of code, or vendoring an entire application This can be used for things like:

- Adding in plugins
- Extending existing code in a framework to support a feature. For example vendoring the authentication system to allow you to use a custom system to authenticate
- Taking an entire existing application and being able to modify it as necessary. For example having a system to manage courses on campus and vendoring it to add your own branding

### API's and Libraries

API's (Application programming interfaces) are a system that allows you to interact with someone else's code. For example you might have an API for a music service that allows you to get information about songs in their database. API's come in all shapes and sizes, often when vendoring code you will need to modify an API.

Libraries is the name given to collections of code that are brought into one project. For example game engines can often be considered libraries since they are brought into projects in order to handle displaying things to the user. API's and libraries are often conflated together, but both will be used a lot when vendoring code.

### Vendoring entire projects

This is actually often allowed. In fact depending on the license provided by the software it's encouraged. One of the packages I wrote a while ago called [ahd](https://github.com/descent098/ahd) actually encourages this as a feature to get around some limitations and provide additional customization. Without getting into too much detail normally you have to run the `ahd` command to use the project, but you can vendor the code and change this keyword to whatever you want!

Likewise lots of software projects that are full systems (full apps, not just API's) will let you vendor them. This is done for branding purposes, to support very custom functionality, and tons of other reasons. That being said you have to keep in mind that closed source software usually does not allow you to do this. Likewise you should not assume you can **always** vendor projects. When in doubt, check with the creator.

## Copyright

Copyright is the protection put in place for intellectual property, branding etc. Essentially it is what allows companies and people to "own" things. A copyright on a brand name for example is what means you can't just use other company names to promote your products. Different countries have **wildly** different laws about this. 

The big thing to keep in mind that is important is that open source licenses **do not guarantee copyright**. If a company releases an open source project, it does not mean they don't have the copyright for portions of the code. For example the [apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) does not allow you to use the name of a project:

> 6. Trademarks. This License does not grant permission to use the trade
>    names, trademarks, service marks, or product names of the Licensor,
>    except as required for reasonable and customary use in describing the
>    origin of the Work and reproducing the content of the NOTICE file.

## Terms of service

A terms of service is similar to a license. It defines what you can and cannot do with software. Typically this is just used for **executable/runnable software**, not source code. This might include clauses about what is and isn't allowed on a platform, what the company can do with your data, etc.

## Suggestions

While hard and fast rules are tough there are some suggestions we can make in general

1. Always add **a license**, when in doubt [MIT](https://choosealicense.com/licenses/mit/) is a great option, or if you want to force people to send any improvements they make back to you, use [GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
   - Not including a license can carry consequences, for example some countries offer an implied warranty, so not including a license makes you liable for problems with the software! 
2. Any live projects (i.e. websites/webapps) you have should have a terms of service
3. If you don't have any reason not to, open source is usually a good call
4. Don't assume anything, if there's no license, or you can't find the license then assume it's not available to you

## Resources

There are tons of resources not only about these topics, but also for being able to find code and resources that **you can** use for whatever you want:

- [choosealicense.com](https://choosealicense.com/) is a website created by [GitHub](https://github.com/) to help people understand licenses and choose good ones!
- [unsplash](https://unsplash.com/) is a site that provides great photographs for free, and has a very permissive [license](https://unsplash.com/license)
- [pexels](https://www.pexels.com/) is another great option for images with [a good license](https://www.pexels.com/license/)
- [HTML5Up](https://html5up.net) is a great site for free HTML templates (a great paid version [here](https://pixelarity.com/))
- [Startbootstrap](https://startbootstrap.com/?showAngular=false&showVue=false&showPro=false) is a great option for bootstrap based HTML templates (you can also pay for some great ones on there)
- [Terms of service generator](https://www.termsofservicegenerator.net/) will help you generate terms of services

## References

[^1]: "Linux is used to power 96.3% of the world's top web servers" https://www.enterpriseappstoday.com/stats/linux-statistics.html#:~:text=Linux%20is%20used%20to%20power,the%20world%27s%20top%20web%20servers.&text=In%20fact%2C%2096.3%25%20account%20for,%25)%20are%20the%20main%20players.
[^2]: "Bootstrap is used by 25.8% of all the websites whose JavaScript library we know. This is 21.3% of all websites." https://w3techs.com/technologies/details/js-bootstrap#:~:text=Bootstrap%20is%20used%20by%2025.8,is%2021.3%25%20of%20all%20websites.
