---
title: Putting a leash on AI
subtitle: How can we navigate the complicated world of AI?
creation_date: 2024-04-18
description: Legislation? Good Will? How do we solve today and tomorrow's problems with ai?
pubDate: 2024-04-30
heroImage: /tech/blog/putting-a-leash-on-ai.png
tags: [ai]
modified: 2024-05-07
---
Ai is an exciting topic. The entire field is fraught with potential. Even in it's current infancy we see startups forming every day, not to mention the more mundane and pragmatic uses cropping up in everyday life. Quick document preparation, summarization, rough draft generation, chat bots, content thumbnail generation and many more. In our lifetime the ability to direct, narrate, score and edit an entire film in an accessible format to many people. But all this excitement comes with a looming anxiety about these technologies.

Who controls them? What are the rules for accessing them? How do they screen for dangerous content? How do we screen for content produced by them? These are just the simple questions, what about questions of laying off workers to automate their work with AI, or the dangers of the inherently incestuous relationship of learning off their own generated data? These questions are important, this article seeks to bring up some of these questions in specific contexts and use cases, as well as provide current lawsuits, draft legislation, and legal precedence in various countries to address some of these anxieties.

*EDIT (August 23rd 2024): MIT has since released the [AI Risk Repository](https://airisk.mit.edu/), which catalogues lots of what I talk about and more, I would recommend checking it out... after finishing this article :)*

## Deepfakes
Starting with one of the most contentious topics, deepfakes are a system of generative AI that allows you to do face and body-swaps of people into existing footage. In it's positive uses it can be used by film companies to edit in actors to shots that could be dangerous, or even just for some fun[^1] [^10]. There are obvious concerns with this, most notably it's use to propagate fake information[^2] (I will talk about this in the [fake information section](#fake-information)), and the ability of others to create deepfake porn. 
### The porn problem
Starting with the second point first, it seems to me that there's no way around the potential issues of deepfake porn. In general models don't do well at culling NSFW prompts, at least not reliably (2/3 in optimistic cases[^7]). Likewise there's not much research I'm aware of to just cull specifically deepfake content, and/or what that would look like. Though, admittedly the technology could prove possible eventually with the rate it's developing, if this becomes the case I may change my perspective.

**Most "mainstream" AI platforms should probably ban NSFW content in general and especially face/body swapping/undressing** (and do[^19], though people think they shouldn't[^20] ) . My opinion on this comes largely from 4 things. 

1. The datasets being used have been demonstrated to have a ton of CSAM (Sexual Abuse Material) [^3] [^4] [^5] [^14], and NSFW prompts that are allowed to go through can obviously pull from that data and use it
2. We are seeing it used frequently for creating non-consensual content for celebrities[^8] [^9]
3. The technology has gotten good enough that normal people are being used in the content[^11] [^12] [^13]
4. There's enough consensually shot porn in the world. By this I mean you can already find what you want, shot by people who are paid and willing participants. Beyond insidious purposes I don't see much of a need for this feature on mainstream platforms considering how involved of a vetting process you would need to do on each request to do it responsibly
 
Unfortunately banning it from most easy-to-use generative AI systems will not get rid of it entirely[^15] [^16] [^49] [^50], so additionally I would say prosecution akin to regular non-consensual porn should probably come into play (and additional charges for distribution). This seems to be in line with new draft law proposals from the UK and Wales[^17] [^18]. Hopefully other countries will follow suit. 

## Fake information
For as long as the internet has existed there's been people posting misinformation on it. It's a time-honored legacy that even without AI has left a chilling effect on the world, from state-sponsored attacks[^21], to lying about science[^22] it doesn't take an AI to be awful. The concern now however is that AI can help lend an air of credibility to misinformation that previously was not possible. Mundane and annoying situations such as incorrect bug disclosures[^26], to more malicious circumstances like companies being scammed with real-time recreations of their board members[^23], or disgruntled ex-employee's posting falsified racial screeds[^24] [^25]. Not to mention the "improvement" to the aforementioned state sponsored attacks and "hacktivist" groups[^27].

Sadly these problems are going to likely require a multifaceted approach to resolve. On a platform basis fact-checking has become a crowd-sourced endeavor with platforms like X (twitter)[^30] [^31] [^34], and YouTube[^28] [^29] including fact-check boxes of crowd-sourced information. These have several problems including people "brigading" them[^32] [^33] [^35]. There are also third-party fact-checking websites[^36] [^37] [^38] [^39], however all of this is assuming there are correct answers, and that these groups can be trusted. Searching on search engines now is so heavily influenced by demographics that you can often never escape your own biases. 

Another interesting approach I've seen is with groups like [ground news](https://ground.news/) who's subscription plan instead shows you each "side" of stories. This still has the issue of bias, but I think gives an opportunity to somewhat escape ones own eco chamber of looking things up in our demographics-driven world of searches. Doing this and holding people more accountable for their beliefs, and the standard of information they use for developing those beliefs seems to be the only path forward I can see. Requiring media-literacy in education to understand these landscapes better would also help. Additionally more ways to escape a potential demographics-based echo chamber seems to be the sort of tooling we should invest in and/or legislate for.

## Ownership
This one is a relatively simple point, all current forms of generative AI are currently breaking most copyright laws and most terms of service(s) for the sites they are pulling their data for. Every major generative AI that is in the mainstream has been trained on copyrighted works, and produces derivatives of those works. This can be seen most evidently in art generators reproducing image watermarks[^48] [^51]. However legally speaking it's actually not this simple. As they cover in their blog post (though it is bias) open AI (makers of Chat GPT) have precedent in the US to continue their training on copyrighted materials[^56].  Time will tell whether these lawsuits pan out or not, but it is very clear that content creators are not being properly compensated for their work[^57].

There have been some technical attempts to mitigate this with "watermarks"[^52] [^53], to little avail[^54] [^55]. Other companies such as DeviantArt take the bizarre approach of allowing you to **request** your name to be blacklisted as a "style"[^58], all but admitting it will be used to replace you. The indifference to the art community by these companies is astonishing, and the fact that situations where models are copying works of clearly-defined styles[^59]. Problem is that most models can't just have the requested work removed, so there is no way around this once a model has been trained. Even more concerning is the move towards companies selling private data for datasets[^62]. Ultimately the legislation will move too slowly on this, but the only fair resolution would be to force companies to retrain on explicitly opt-in datasets. This solution is basically untenable however because until forced to these companies will not acquiesce. So a more malicious solution might be better.

Some people have taken matters into their own hands and have tried data poisoning attacks[^47] [^60] [^61]. These combined with prompt injection attacks[^63] [^64] including providing fake prices, and using them to generate complex scripts. The intention being to cost the companies using them money, and ultimately that might be the best solution right now. Legislation is unlikely to catch up, and so some malicious messing with the systems might be the most reasonable and cathartic way to slow down this sort of adoption. It's unclear whether companies will be forced to uphold the deals given on these sites, but hey may as well make it a headache for them, after all it's not illegal! (double check that's true in your country before following this advice).

## Generative intimacy
Everybody gets a little lonely, and AI services are here to help[^65] [^66].  Don't want to touch grass, but still want to get a girl, there's dozens of services that will emulate one for you!  With some incredible levels of tact, and very fine tuning, it would be possible to have AI companions that don't cause psychological harm to people. Unfortunately we rarely get the good ending these days, and the reality is that AI companion apps are primarily, thinly veiled sex chatbots that happen to occasionally show a bit of personality. Many of the same AI companion concerns would also be applicable to OnlyFans[^68] [^69], and it's messaging system, with a few crucial exceptions. 

Did your boyfriend die and you want to avoid the grieving process and pay a company to replace the hole in your heart, we've got you[^67] [^77]! Many of these platforms play into very sinister aspects of dark-patterns including playing on people's grief and loneliness. Concerning situations could arise in the future such as a commercialized version of a situation where a south Korean group "brought a daughter back to life"[^70]. This used an actor instead of AI, but this sort of thing being mass-market capable is concerning. However legislation around this would be difficult, especially when practices like [mediumship](https://en.wikipedia.org/wiki/Mediumship#:~:text=Mediumship%20is%20the%20pseudoscientific%20practice,tables%2C%20trance%2C%20and%20ouija.) are still allowed commercially. Likewise using someone's (ostensible) partner to market to them is something to be highly concerned over. Depending on how prevalent these situations end up being there may need to be outright bans on certain interactions, like marketing, assuming another personality etc.

## Generative academia
It is highly concerning to me just how quickly generative AI's found a footing in academia. Anecdotally most of the students I know in computer science don't write their own code anymore. Beyond that papers are getting less and less human[^71] [^72] [^73], this is concerning in how much learning is no longer required from students. There's a lot of skipping out on work that I suspect will lead to more at-time assignments (essays written in class, no laptops for exams etc.). Even in the research world chat GPT is being used to generate papers. This paper for example forgot to remove the GPT response in the introduction[^74]. This doesn't necessarily invalidate the work, but it is a red-flag that should be a cause for concern.

Additionally we need to be skeptical of work being done using generative AI for research itself, such as recent CRISPR advances[^75] [^76]. This sort of work is nothing new[^78], but again should raise some red flags. We need better systems in place for monitoring the work being done to ensure it's up to standard. At minimum that should include a defined set of standard generative AI models that can be used in research this way, governance around requiring people to mention they used AI, and additional testing to validate results (as much as possible).

## Wearable bugs
There has been an increase in the number of AI voice assistants becoming standalone products in recent years. [Humane](https://humane.com/), the [Rabbit R1](https://www.rabbit.tech/rabbit-r1) and I'm sure no end of similar clones. The problem with these systems that I see most prevalent is the same issues we already find with existing voice assistants like [Siri](https://www.apple.com/ca/siri/), [Bixby](https://www.samsung.com/us/apps/bixby/), [Alexa](https://www.alexa.com/) and [Google Assistant](https://assistant.google.com/), the data. For years now conversations with these voice assistants has constantly leaked[^40]  [^41] [^42] [^45], and had data retention issues[^43] [^44]. Audio is notoriously hard to process[^46] because of the density of the data, so it's often trained more manually than something like image generation. People are used to label conversations effectively, which inevitably causes privacy issues. Even without this human intervention these AI pins will have other issues. When you're using the assistants out and about none of the people you're potentially recording have agreed to the terms of service. Every person who buys one of these and uses it frequently has the potential to leak the data of people around them at all times. Intense voice isolation is an option to limit this potential, but nothing is perfect. 

I suspect these systems would also in some cases violate all-party consent requirements. For anyone who doesn't know there are two different sets of laws for recordings, single-party consent, and all-party consent. Single-party locations allow people to record others without their consent, all-party locations require everyone to agree to being recorded. These laws differ in different countries around when these rules apply, however it is possible these types of assistants are just generally illegal in many places already. 

## Boundaries of evolution
When I was in high school I came across an incredible project called [MarI/O](https://www.youtube.com/watch?v=qv6UVOQ0F44) (an interesting follow up [here](https://www.youtube.com/watch?v=5zg_5hg8Ydo)), at this point in my life I had never even programmed. I remember finding the mutation rate and testing to see how modifying it at different parts of the training would effect the result. 

Seeing this project in action, and the work of creators like [carykh](https://www.youtube.com/@carykh) was incredibly interesting and was an additional nudge to my interest in computer science. They were at the time working on an approach to deep learning called evolutionary neural networks. The terms get somewhat nebulous, but in essence it's a system where you tell it things it can do, tell it what "succeeding" is (fitness function), and then it will mutate and modify it's behavior to better attain that goal. With MarI/O that included telling it what buttons it could press, and allowing it to pick when to press them. Over time it builds a sort of "script" that it follows to learn when to press what buttons. This all sounds interesting, so what's the problem.

Remember that whole bit about telling it what "success" looks like, it turns out that's really hard to do. Imagine I have a semi-sentient robot, and I tell a robot to make ice cream, what could go wrong. If I'm an ice cream salesman it will just make ice cream for me right? Well we didn't limit how it creates that ice cream, so it will just do **whatever** gets it more ice cream. If it determines beating cows to an inch of their life produces more milk (and thus more ice cream), it will do it, animal cruelty laws be dammed. If it determines it can threaten surrounding farmers and take their milk it will. Essentially because there is no well-defined boundary the typical moral intuitions we rely on, and the contextual understanding of the world does not apply. 

While the examples seem like a far-fetch [I-robot](https://www.imdb.com/title/tt0343818/)-esque plot consider a simpler case. What if I get a system to design a train system to get people from one place to the other faster. How long before it cuts safety regulations that weren't given to it as context? What if we make a rule to say when people are on board it needs to be safe? Well then when people aren't on board how long before it "cheats" and starts sending the train hundreds of miles an hour faster than it should to game the system? This is a nearly intractable problem, and as such this sort of system should really only be applied in simulations, and then human-verified. 

## Conclusion

AI poses an incredible dialectic of possibility and danger. There is so much potential to do incredible never-before-seen things with it, yet some things are better left never seen. Hopefully some of these suggestions can help get the ball rolling on ideas for where the lines should be to limit AI, and help start discussions for where future problems may need to be addressed.

## Additional References
- [Staying ahead of threat actors in the age of AI | Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2024/02/14/staying-ahead-of-threat-actors-in-the-age-of-ai/) 
- [Statement on AI Risk | CAIS (safe.ai)](https://www.safe.ai/work/statement-on-ai-risk)
- [Altman handpicked for Homeland Security's AI safety board (axios.com)](https://www.axios.com/2024/04/26/altman-mayorkas-dhs-ai-safety-board)
- [Practices for Governing Agentic AI Systems (openai.com)](https://openai.com/research/practices-for-governing-agentic-ai-systems)
- [AI Art: What Should Fair Compensation Look Like? - EmoryBusiness.com](https://www.emorybusiness.com/2024/02/16/ai-art-what-should-fair-compensation-look-like/)
- [The scary truth about AI copyright is nobody knows what will happen next - The Verge](https://www.theverge.com/23444685/generative-ai-copyright-infringement-legal-fair-use-training-data)
- [Public AI Training Datasets Are Rife With Licensing Errors - IEEE Spectrum](https://spectrum.ieee.org/data-ai)
- [OpenAI, Google, and Meta used your data to build their AI systems - Vox](https://www.vox.com/technology/2023/7/27/23808499/ai-openai-google-meta-data-privacy-nope)
- [How We Think About Copyright and AI Art | Electronic Frontier Foundation (eff.org)](https://www.eff.org/deeplinks/2023/04/how-we-think-about-copyright-and-ai-art-0)

## Relevant Articles that have come out since publication

- [For Data-Guzzling AI Companies, the Internet Is Too Small](https://www.wsj.com/tech/ai/ai-training-data-synthetic-openai-anthropic-9230f8d8)
- [These AI sites need to be shut down... | AI Docu-Dive Part 1](https://www.youtube.com/watch?v=J3YB0VvBvjs)
- Company bans on Deepfake Porn
  - [Google prohibits ads promoting websites and apps that generate deepfake porn](https://www.engadget.com/google-prohibits-ads-promoting-websites-and-apps-that-generate-deepfake-porn-130059324.html)
  - [Google restricts promotion of deep fake sexual content](https://searchengineland.com/google-restricts-promotion-deep-fake-sexual-content-440141)
  - [Updated Google Ad Policy Bans Promotion of Deepfake Porn Apps](https://www.pcmag.com/news/google-updates-its-ad-policy-to-prohibit-promoting-deepfake-porn-apps)
- Deepfakes in court rooms
  - [After an Arizona man was shot, an AI video of him addresses his killer in court](https://www.npr.org/2025/05/07/g-s1-64640/ai-impact-statement-murder-victim)
  - [Arizona man shot to death in road rage 'returns' to address his killer](https://www.bbc.com/news/articles/cq808px90wxo)

[^1]: [A new A.I. tool replaces Iconic Lil Yachty concert video with Joaquin Phoniex’s Joker (youtube.com)](https://www.youtube.com/watch?v=bxtSsQIEDpU)
[^2]: [Fake Obama created using AI video tool - BBC News (youtube.com)](https://www.youtube.com/watch?v=AmUC4m6w1wo)
[^3]: [Identifying and Eliminating CSAM in Generative ML Training Data and Models | Stanford Digital Repository](https://purl.stanford.edu/kh752sm9123)
[^4]: [The AI-Generated Child Abuse Nightmare Is Here | WIRED](https://www.wired.com/story/generative-ai-images-child-sexual-abuse/)
[^5]: [AI-generated child sexual abuse images could flood the internet. Now there are calls for action | AP News](https://apnews.com/article/ai-artificial-intelligence-child-sexual-abuse-c8f17de56d41f05f55286eb6177138d2)
[^6]: [Groot: Adversarial Testing for Text-to-Image Generative Models with Tree-based Semantic Transformation Content Warning: this paper may include model-generated offensive or disturbing content. (arxiv.org)](https://arxiv.org/html/2402.12100v1)
[^7]: https://arxiv.org/html/2402.12100v1#:~:text=Table%201%3A,adversarial%20testing%20techniques.
[^8]: https://www.polygon.com/23642040/twitch-deepfake-porn-atrioc-livestream-streamer-clip-update
[^9]: [Nearly 4,000 celebrities found to be victims of deepfake pornography | Deepfake | The Guardian](https://www.theguardian.com/technology/2024/mar/21/celebrities-victims-of-deepfake-pornography)
[^10]: [How do LLMs like ChatGPT work? Explained by Deep-Fake Ryan Gosling using Synclabs and ElevenLabs. (youtube.com)](https://www.youtube.com/watch?v=xU_MFS_ACrU)
[^11]: [Deepfake porn is ruining women’s lives. Now the law may finally ban it. | MIT Technology Review](https://www.technologyreview.com/2021/02/12/1018222/deepfake-revenge-porn-coming-ban/)
[^12]: [Deepfake Porn Is Out of Control | WIRED](https://www.wired.com/story/deepfake-porn-is-out-of-control/)
[^13]: [How to Detect a Deepfake Online: Image Forensics and Analysis of Deepfake Videos - Sensity AI](https://sensity.ai/blog/deepfake-detection/how-to-detect-a-deepfake/)
[^14]: [A deepfake bot is being used to “undress” underage girls | MIT Technology Review](https://www.technologyreview.com/2020/10/20/1010789/ai-deepfake-bot-undresses-women-and-underage-girls/)
[^15]: [Github is banning copies of ‘deepfakes’ porn app DeepNude - The Verge](https://www.theverge.com/2019/7/9/20687902/github-bans-deepnude-deepfakes-ai-nudity-app-copies)
[^16]: [Ghost of DeepNude still haunts young women | Ghost of DeepNude still haunts young women (deccanchronicle.com)](https://www.deccanchronicle.com/nation/current-affairs/140719/ghost-of-deepnude-still-haunts-young-women.html)
[^17]: [Deepfake porn production could soon be a crime in England | CTV News](https://www.ctvnews.ca/sci-tech/making-deepfake-porn-without-consent-could-soon-be-a-crime-in-england-1.6848990)
[^18]: [Government cracks down on ‘deepfakes’ creation - GOV.UK (www.gov.uk)](https://www.gov.uk/government/news/government-cracks-down-on-deepfakes-creation)
[^19]: [NSFW Ban on Generative AI Platforms: What, Why, and What to Do? - Metaroids](https://metaroids.com/feature/nsfw-ban-on-generative-ai-platforms-what-why-and-what-to-do/)
[^20]: [I don't understand how these various AI companies even try to filter NSFW conten... | Hacker News (ycombinator.com)](https://news.ycombinator.com/item?id=32727118)
[^21]: [How Russia Used Facebook To Organize 2 Sets Of Protesters : NPR](https://www.npr.org/2017/11/01/561427876/how-russia-used-facebook-to-organize-two-sets-of-protesters)
[^22]: [The Danger of Misinformation in the COVID-19 Crisis - PMC (nih.gov)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7721433/)
[^23]: [Deepfake scammer walks off with $25 million in first-of-its-kind AI heist | Ars Technica](https://arstechnica.com/information-technology/2024/02/deepfake-scammer-walks-off-with-25-million-in-first-of-its-kind-ai-heist/)
[^24]: [Pikesville High athletic director used AI to fake racist recording of principal, police say – Baltimore Sun](https://www.baltimoresun.com/2024/04/25/racist-recording-pikesville-athletic-director/)
[^25]: [Dazhon Darien: Ex-athletic director accused of framing principal with AI arrested at airport with gun - The Baltimore Banner](https://www.thebaltimorebanner.com/education/k-12-schools/eric-eiswert-ai-audio-baltimore-county-YBJNJAS6OZEE5OQVF5LFOFYN6M/)
[^26]: [The I in LLM stands for intelligence | daniel.haxx.se](https://daniel.haxx.se/blog/2024/01/02/the-i-in-llm-stands-for-intelligence/)
[^27]: [Disrupting malicious uses of AI by state-affiliated threat actors (openai.com)](https://openai.com/blog/disrupting-malicious-uses-of-ai-by-state-affiliated-threat-actors)
[^28]: [YouTube misinformation policies - How YouTube Works](https://www.youtube.com/howyoutubeworks/our-commitments/fighting-misinformation/)
[^29]: [Google tools for fact-checkers (youtube.com)](https://www.youtube.com/watch?v=Q0RcyKwaIU8)
[^30]: [How Twitter's Birdwatch fact-checking project really works - The Washington Post](https://www.washingtonpost.com/technology/2022/11/09/twitter-birdwatch-factcheck-musk-misinfo/)
[^31]: [Twitter is adding crowdsourced fact checks to images - The Verge](https://www.theverge.com/2023/5/30/23742851/twitter-notes-images-crowdsourced-fact-checks-misinformation-moderation)
[^32]: [Why Twitter’s Community Notes feature mostly fails to combat misinformation - Poynter](https://www.poynter.org/fact-checking/2023/why-twitters-community-notes-feature-mostly-fails-to-combat-misinformation/)
[^33]: [Propaganda War: Pro-Israel Trolls are Mobbing Twitter’s Community Notes – ScheerPost](https://scheerpost.com/2023/10/25/propaganda-war-pro-israel-trolls-are-mobbing-twitters-community-notes/)
[^34]: [twitter/communitynotes: Documentation and source code powering Twitter's Community Notes (github.com)](https://github.com/twitter/communitynotes)
[^35]: [Twitter says crowdsourced fact-checking system updated to better address 'low quality' contributions | TechCrunch](https://techcrunch.com/2022/11/28/twitter-says-crowdsourced-fact-checking-system-updated-to-better-address-low-quality-contributions/?guccounter=1)
[^36]: [Snopes.com | The definitive fact-checking site and reference source for urban legends, folklore, myths, rumors, and misinformation.](https://www.snopes.com/)
[^37]: [FactCheck.org - A Project of The Annenberg Public Policy Center](https://www.factcheck.org/)
[^38]: [PolitiFact](https://www.politifact.com/)
[^39]: [SciCheck Archives - FactCheck.org](https://www.factcheck.org/scicheck/)
[^40]: [Google admits leaked private voice conversations (cnbc.com)](https://www.cnbc.com/2019/07/11/google-admits-leaked-private-voice-conversations.html)
[^41]: [Google workers listen to your “OK Google” queries—one of them leaked recordings | Ars Technica](https://arstechnica.com/information-technology/2019/07/google-defends-listening-to-ok-google-queries-after-voice-recordings-leak/)
[^42]: [These Are The Real Problems Revealed By The Belgian Leak Of Google Assistant Voice Recordings (forbes.com)](https://www.forbes.com/sites/kevinmurnane/2019/07/14/these-are-the-real-problems-revealed-by-the-belgian-leak-of-google-assistant-voice-recordings/?sh=6bfc36c714e7)
[^43]: [Amazon to Pay $30M for Ring and Alexa Privacy Violations: Tips for Protecting Your Smart Home Data - CNET](https://www.cnet.com/tech/services-and-software/amazon-to-pay-30-m-for-ring-and-alexa-privacy-violations-tips-for-protecting-your-smart-home-data/)
[^44]: [Amazon settles $25m lawsuit over Alexa's privacy breach (retail-insight-network.com)](https://www.retail-insight-network.com/features/amazon-settles-25m-lawsuit-over-alexas-privacy-breach/)
[^45]: [Confirmed: Apple Caught In Siri Privacy Scandal, Let Contractors Listen To Private Voice Recordings (forbes.com)](https://www.forbes.com/sites/jeanbaptiste/2019/07/30/confirmed-apple-caught-in-siri-privacy-scandal-let-contractors-listen-to-private-voice-recordings/?sh=643c78cd7314)
[^46]: https://research.aimultiple.com/audio-data-collection/#:~:text=As%20compared%20to%20image%20data%2C%20recording%20audio%20data%20consumes%20more%20time
[^47]: https://www.technologyreview.com/2023/10/23/1082189/data-poisoning-artists-fight-generative-ai/
[^48]: [Getty Images is suing the creators of AI art tool Stable Diffusion for scraping its content - The Verge](https://www.theverge.com/2023/1/17/23558516/ai-art-copyright-stable-diffusion-getty-images-lawsuit)
[^49]: [Apple Pulls 3 Generative AI Apps Being Used to Make Deepfake Nudes | PCMag](https://www.pcmag.com/news/apple-pulls-3-generative-ai-apps-being-used-to-make-deepfake-nudes)
[^50]: [Apple Removes Nonconsensual AI Nude Apps Following 404 Media Investigation](https://www.404media.co/apple-removes-nonconsensual-ai-nude-apps-following-404-media-investigation/)
[^51]: [Watermarks on Generative AI Art ... and Copyright - Tech Contracts](https://www.techcontracts.com/2023/08/10/watermarks-on-generative-ai-art-and-copyright/)
[^52]: [Google launches watermarks for AI-generated images | CNN Business](https://www.cnn.com/2023/08/30/tech/google-ai-images-watermark/index.html)
[^53]: [Watermarking in the Age of AI-generated Images | by Vishal Rajput | AIGuys | Medium](https://medium.com/aiguys/watermarking-in-the-age-of-ai-generated-images-3d3649c8bd1f)
[^54]: [Researchers Tested AI Watermarks—and Broke All of Them | WIRED](https://www.wired.com/story/artificial-intelligence-watermarking-issues/)
[^55]: [AI Watermarking Won't Curb Disinformation | Electronic Frontier Foundation (eff.org)](https://www.eff.org/deeplinks/2024/01/ai-watermarking-wont-curb-disinformation)
[^56]: [OpenAI and journalism](https://openai.com/blog/openai-and-journalism)
[^57]: [Visual artists fight back against AI companies for repurposing their work | AP News](https://apnews.com/article/artists-ai-image-generators-stable-diffusion-midjourney-7ebcb6e6ddca3f165a3065c70ce85904)
[^58]: https://www.theverge.com/2022/11/15/23449036/deviantart-ai-art-dreamup-training-data-controversy#:~:text=banning%20the%20use%20of%20certain%20artists%E2%80%99%20names%20(as%20well%20as%20the%20names%20of%20their%20aliases%20or%20individual%20creations)%20in%20prompts.%20Artists%20can%20fill%20out%20a%20form%20to%20request%20this%20opt%2Dout%2C%20and%20they%E2%80%99ll%20be%20approved%20manually.
[^59]: [Invasive Diffusion: How one unwilling illustrator found herself turned into an AI model - Waxy.org](https://waxy.org/2022/11/invasive-diffusion-how-one-unwilling-illustrator-found-herself-turned-into-an-ai-model/)
[^60]: [‘Data poisoning’ anti-AI theft tools emerge — but are they ethical? – Computerworld](https://www.computerworld.com/article/1638694/data-poisoning-anti-ai-theft-tools-emerge-but-are-they-ethical.html)
[^61]: [[2310.13828] Nightshade: Prompt-Specific Poisoning Attacks on Text-to-Image Generative Models (arxiv.org)](https://arxiv.org/abs/2310.13828)
[^62]: [The AI trust crisis (simonwillison.net)](https://simonwillison.net/2023/Dec/14/ai-trust-crisis/)
[^63]: [People buy brand-new Chevrolets for $1 from a ChatGPT chatbot (the-decoder.com)](https://the-decoder.com/people-buy-brand-new-chevrolets-for-1-from-a-chatgpt-chatbot/#:~:text=A%20car%20for%20a%20dollar,that%20could%20not%20be%20withdrawn.)
[^64]: [Car Dealership Disturbed When Its AI Is Caught Offering Chevys for $1 Each (futurism.com)](https://futurism.com/the-byte/car-dealership-ai)
[^65]: https://replika.com/
[^66]: [Ads for Explicit ‘AI Girlfriends’ Are Swarming Facebook and Instagram | WIRED](https://www.wired.com/story/ads-for-explicit-ai-girlfriends-swarming-facebook-and-instagram/)
[^67]: [SF's Replika bot aimed to end loneliness. Then its users revolted. (sfgate.com)](https://www.sfgate.com/tech/article/replika-san-francisco-ai-chatbot-17915543.php)
[^68]: [Think You're Messaging an OnlyFans Star? You're Talking to These Guys (vice.com)](https://www.vice.com/en/article/4a3b33/onlyfans-management-agency-chatters)
[^69]: [How OnlyFans Works For Users (bustle.com)](https://www.bustle.com/wellness/how-onlyfans-works-users)
[^70]: [Virtual reality "reunites" mother with dead daughter in South Korean doc (youtube.com)](https://www.youtube.com/watch?v=0p8HZVCZSkc)
[^71]: [Free AI Research Research Paper Generator & Paper Writer (smodin.io)](https://smodin.io/writer/research-paper)
[^72]: [Students Are Likely Writing Millions of Papers With AI | WIRED](https://www.wired.com/story/student-papers-generative-ai-turnitin/)
[^73]: [Ai-generated Research Papers Published On Arxiv Post Chatgpt Launch – Originality.AI](https://originality.ai/blog/ai-generated-research-papers)
[^74]: https://www.sciencedirect.com/science/article/abs/pii/S2468023024002402#preview-section-abstract:~:text=Certainly%2C%20here%20is%20a%20possible%20introduction%20for%20your%20topic%3A
[^75]: [This AI Just Designed a More Precise CRISPR Gene Editor for Human Cells From Scratch (singularityhub.com)](https://singularityhub.com/2024/04/25/this-ai-just-designed-a-more-precise-crispr-gene-editor-for-human-cells-from-scratch/)
[^76]: [Generative A.I. Arrives in the Gene Editing World of CRISPR - The New York Times (nytimes.com)](https://www.nytimes.com/2024/04/22/technology/generative-ai-gene-editing-crispr.html)
[^77]: [Our story (replika.com)](https://replika.com/about/story)
[^78]: [[2004.10746] Chip Placement with Deep Reinforcement Learning (arxiv.org)](https://arxiv.org/abs/2004.10746)