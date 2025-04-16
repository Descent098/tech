---
title: UTF-8 in Games
subtitle: Make prototyping games faster
description: How to use text in your games
pubDate: 2025-04-16
modified_date: 2025-04-16T00:00:00-06:00
heroImage: /tech/blog/utf-8-games.jpg
tags:
  - web
  - html
  - frontend
  - ui-ux
  - design
  - games
  - python
---

When you're reading this you probably don't think much about text. When I go to setup a new html page from scratch I typically just hit `!` which in vs code produces:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

Even just in this small bit of code there's a lot of information, but the one I want to focus on is:

```html 
<meta charset="UTF-8">
```

When we see text we typically don't care at all about the complexities involved in rendering it, the complexity of the font infrastructure to make rendering all this possible, or the encoding. 

\**There's an accompanying repo with the code examples [here](https://github.com/Descent098/uft-8-cards)*

## What is Encoding?

For those who are unaware what encoding is, I would recommend checking out [this page](https://kieranwood.ca/compsci/Programming/Encodings) for a detailed explanation, but in short when you have text like this paragraph it isn't actually text. Instead each letter is simply a number, and the encoding is what tells the browser how to take these numbers and represent them as text.

For a quick example in python consider the text:

```python
def encode_str(input_text:str) -> list[int]:
    result = []
    for letter in input_text:
        letter = ord(letter) # convert letter to number
        result.append(letter)
    return result


def decode_str(input_text:list[int]) -> str:
    result = ""
    for letter in input_text:
        letter = chr(letter)
        result += letter
    return result

# Testing
original_text = "Hello World"

encoded_string = encode_str(original_text)
# Prints: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
print(encoded_string) 

decoded_string = decode_str(encoded_string)
# Prints: Hello World
print(decoded_string)

# Whether the string is the same
is_same = True if original_text == decoded_string else False

# Prints: Is decoded string the same as original? Yes
print(f"Is decoded string the same as original? {'Yes' if is_same else 'No'}")
```

This is what powers text in files, and by extension the majority of the internet.

## The wonderful world of UTF-8

So, let's get to the point. UTF-8 is the standard that runs most of the world. It is the character set chosen for most things by default (in english speaking countries at least), and as such it has a ton of support. This is handy because when UTF-8 (also called unicode), was created they added more than your traditional "characters", in fact they added all you need to make tons of common games. For example, [dominos](https://utf8-icons.com/subset/domino-tiles), [Mahjong](https://utf8-icons.com/subset/mahjong-tiles), [chess](https://utf8-icons.com/white-chess-king-9812), [dice](https://utf8-icons.com/die-face-1-9856), [playing cards](https://utf8-icons.com/subset/playing-cards), here's a suit of spades entirely in text:

```
🂠 🂡 🂢 🂣 🂤  
🂥 🂦 🂧 🂨 🂩  
🂪 🂫 🂬 🂭 🂮
```

There are some quirks with most of these, including some challenges you might not be used to. For example those cards are hard to see. Most typical text isn't so information dense, so let me show off the same characters, but more interactive to help see the potential:

<div>
    <p class="card" style="font-size:2rem; padding:0; margin:0; line-height:1.6;">
        &#127136;
    </p>
    <p class="card" style="font-size:2rem; padding:0; margin:0; line-height:1.6;">
        &#127137;
    </p>
    <p class="card" style="font-size:2rem; padding:0; margin:0; line-height:1.6;">
        &#127147;
    </p>
    <p class="card" style="font-size:2rem; padding:0; margin:0; line-height:1.6;">
        &#127148;
    </p>
    <p class="card" style="font-size:2rem; padding:0; margin:0; line-height:1.6;">
        &#127150;
    </p>
</div>


<form>
    <input type="range" name="fontsize" min="1" max="8" step="0.1" value=2
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.fontSize=`${this.value}rem`})">
    <label for="fontsize">Font Size (in rem)</label> <br>
    <input type="range" name="fontweight" min="400" max="800" step="400" value=400
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.fontWeight=`${this.value}`})">
    <label for="fontsize">Font Weight</label><br>
    <input type="range" name="lineHeight" min="1" max="4" step=".1" value=1.6
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.lineHeight=`${this.value}`})">
    <label for="lineHeight">Line Height</label><br>
    <select name="displayType"
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.display=`${this.value}`})"
    style="border: 1px solid black;border-radius: .7rem;padding: .2rem;">
        <option value="block" selected>block</option>
        <option value="inline">inline</option>
    </select>
    <label for="displayType">Display Type</label><br>
    <input type="range" name="margin" min="1" max="5" step=".1" value=0
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.margin=`${this.value}rem`})">
    <label for="margin">Margin (rem)</label><br>
    <input type="range" name="padding" min="1" max="5" step=".1" value=0
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.padding=`${this.value}rem`})">
    <label for="padding">Padding (rem)</label><br>
    <input type="color" name="fontColor" value="black"
    oninput="Array.from(document.getElementsByClassName('card')).forEach( (el) =>{el.style.color=`${this.value}`})"
    style="margin-top:1.2rem;">
    <label for="fontColor">Font Color</label> <br>
</form>

## Game Dev

I am terrible at building games. I find the engines hard to reason about, and I often find it's easier to "start from scratch" than using lots of modern engines. If you could make a game with basic HTML, and a small amount of javascript, now you get: 

- A runtime that has standards going back 20 years of compatability
- Lots of tutorials
- A ton of pre-developed design materials
- Easy ways to distribute

When developing simple games like the ones that have character codes, you can use UTF-8 to generate procedural (code generated) assets quickly. No one wants to see test messages and logs, UTF-8 provides a chance to create game assets that work with all the features of HTML (event listeners, animations, etc.). In fact this means we can develop games with only basic web development skills.

## UTF-8 🤝 Browsers

The handy thing about UTF-8 and HTML is a feature I forgot to mention, the encoding. There's a feautre in HTML that allows you to specify characters you can do this with the format `&#x<value>;` where Value is a [hexadecimal](https://kieranwood.ca/compsci/Programming/Binary,-Hexadecimal-and-Number-Systems#hexadecimal) number. For example `&#x1F0A1;` is 🂡 (ace of spades). For cards we need to care about the last two digits `&#x1F0` is constant. The last two digits are:

- The letter: A-D representing ♠ ♥ ♦ ♣
- The number; 1-E(14) 2-10 are just 2-10, 1 is ace, A is jack, B is queen, E is King
  - We skip 12 because it's the [knight](https://en.wikipedia.org/wiki/Knight_(playing_card)) (told you these get weird some times)

With this we can create [a fully functioning deck of cards in ~80 lines of code](https://github.com/Descent098/uft-8-cards/cards.js) .

<details style="background:#f0f0f0; padding:1rem;border-radius:.7rem;cursor:pointer;"><summary>The code (collapsed for easy reading)</summary>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Card</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#6A737D">    /** </span></span>
<span class="line"><span style="color:#6A737D">    Suit {"♠"|"♥"|"♦"|"♣"} - The suit of the card</span></span>
<span class="line"><span style="color:#6A737D">    value {Number} - The value of the card between 1-13 (ace is 1 and becomes 14 if acesHigh)</span></span>
<span class="line"><span style="color:#6A737D">    acesHigh {Boolean} - If ace should be worth 11 or 1</span></span>
<span class="line"><span style="color:#6A737D">    */</span></span>
<span class="line"><span style="color:#F97583">    constructor</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">suit</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">value</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">acesHigh</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> false</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> color </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "black"</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (suit </span><span style="color:#F97583">===</span><span style="color:#9ECBFF">"♥"</span><span style="color:#F97583"> ||</span><span style="color:#E1E4E8"> suit </span><span style="color:#F97583">===</span><span style="color:#9ECBFF">"♦"</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#E1E4E8">            color </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "red"</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> letter </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "A"</span></span>
<span class="line"><span style="color:#F97583">        switch</span><span style="color:#E1E4E8"> (suit){</span></span>
<span class="line"><span style="color:#F97583">            case</span><span style="color:#9ECBFF"> "♠"</span><span style="color:#E1E4E8">: letter </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "A"</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            case</span><span style="color:#9ECBFF"> "♥"</span><span style="color:#E1E4E8">: letter </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "B"</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            case</span><span style="color:#9ECBFF"> "♦"</span><span style="color:#E1E4E8">: letter </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "C"</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            case</span><span style="color:#9ECBFF"> "♣"</span><span style="color:#E1E4E8">: letter </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "D"</span><span style="color:#E1E4E8">; </span><span style="color:#F97583">break</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">            default</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">throw</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Error</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">`Provided suit is invalid ${</span><span style="color:#E1E4E8">suit</span><span style="color:#9ECBFF">}`</span><span style="color:#E1E4E8">);</span><span style="color:#F97583">break</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> characterNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> value</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (value</span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF">9</span><span style="color:#E1E4E8">){ </span><span style="color:#6A737D">// Need to start with hex values A-E</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> (value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF">11</span><span style="color:#E1E4E8">){ </span></span>
<span class="line"><span style="color:#E1E4E8">                characterNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (value</span><span style="color:#F97583">+</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">).</span><span style="color:#B392F0">toString</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">16</span><span style="color:#E1E4E8">).</span><span style="color:#B392F0">toUpperCase</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">            } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">                characterNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> value.</span><span style="color:#B392F0">toString</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">16</span><span style="color:#E1E4E8">).</span><span style="color:#B392F0">toUpperCase</span><span style="color:#E1E4E8">()</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.suit </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> suit</span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.character </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> `&amp;#x1F0${</span><span style="color:#E1E4E8">letter</span><span style="color:#9ECBFF">}${</span><span style="color:#E1E4E8">characterNumber</span><span style="color:#9ECBFF">};`</span><span style="color:#6A737D"> // UTF-8 Character </span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.html </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> `&lt;span class="card" style="color:${</span><span style="color:#E1E4E8">color</span><span style="color:#9ECBFF">}"&gt;&amp;#x1F0${</span><span style="color:#E1E4E8">letter</span><span style="color:#9ECBFF">}${</span><span style="color:#E1E4E8">characterNumber</span><span style="color:#9ECBFF">};&lt;/span&gt;`</span><span style="color:#E1E4E8">    </span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8">(value </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583">  &amp;&amp;</span><span style="color:#E1E4E8"> acesHigh){</span></span>
<span class="line"><span style="color:#79B8FF">            this</span><span style="color:#E1E4E8">.value </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 14</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">        </span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.value </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> value </span><span style="color:#6A737D">// The raw value (i.e. queen &gt; jack since queen is higher value)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (value </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 14</span><span style="color:#E1E4E8">){ </span><span style="color:#6A737D">// Aces high, and it's an ace</span></span>
<span class="line"><span style="color:#79B8FF">            this</span><span style="color:#E1E4E8">.number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 11</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> (value </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">){ </span><span style="color:#6A737D">// The base value (i.e. queen == jack since both are 10)</span></span>
<span class="line"><span style="color:#79B8FF">            this</span><span style="color:#E1E4E8">.number </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8"> </span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#79B8FF">            this</span><span style="color:#E1E4E8">.number </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> value</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Deck</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#F97583">    constructor</span><span style="color:#E1E4E8"> (){</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> cards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#F97583">        let</span><span style="color:#E1E4E8"> deck </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">            "♠"</span><span style="color:#E1E4E8">:[],</span></span>
<span class="line"><span style="color:#9ECBFF">            "♥"</span><span style="color:#E1E4E8">:[],</span></span>
<span class="line"><span style="color:#9ECBFF">            "♦"</span><span style="color:#E1E4E8">:[],</span></span>
<span class="line"><span style="color:#9ECBFF">            "♣"</span><span style="color:#E1E4E8">:[]</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">const</span><span style="color:#79B8FF"> suit</span><span style="color:#F97583"> of</span><span style="color:#E1E4E8"> [</span><span style="color:#9ECBFF">"♠"</span><span style="color:#E1E4E8">,</span><span style="color:#9ECBFF">"♥"</span><span style="color:#E1E4E8">,</span><span style="color:#9ECBFF">"♦"</span><span style="color:#E1E4E8">,</span><span style="color:#9ECBFF">"♣"</span><span style="color:#E1E4E8">]){</span></span>
<span class="line"><span style="color:#F97583">            for</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">let</span><span style="color:#E1E4E8"> i</span><span style="color:#F97583">=</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">;i</span><span style="color:#F97583">&lt;=</span><span style="color:#79B8FF">13</span><span style="color:#E1E4E8">; i</span><span style="color:#F97583">++</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">                let</span><span style="color:#E1E4E8"> newCard </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Card</span><span style="color:#E1E4E8">(suit, i)</span></span>
<span class="line"><span style="color:#E1E4E8">                cards.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(newCard)</span></span>
<span class="line"><span style="color:#E1E4E8">                deck[newCard.suit].</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(newCard)</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.cards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> cards            </span><span style="color:#6A737D">// The cards in the deck in an unordered array</span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.deck </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> deck              </span><span style="color:#6A737D">// The cards in the deck, by suit</span></span>
<span class="line"><span style="color:#79B8FF">        this</span><span style="color:#E1E4E8">.remaining </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> cards.</span><span style="color:#79B8FF">length</span><span style="color:#6A737D"> // Number of cards remaining</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    /** Gets a random card, if remove is True will remove it from this.remaining*/</span></span>
<span class="line"><span style="color:#B392F0">    getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">remove</span><span style="color:#F97583">=</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.cards.</span><span style="color:#79B8FF">length</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">            const</span><span style="color:#79B8FF"> cardIndex</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> Math.</span><span style="color:#B392F0">floor</span><span style="color:#E1E4E8">(Math.</span><span style="color:#B392F0">random</span><span style="color:#E1E4E8">()</span><span style="color:#F97583">*</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.cards.</span><span style="color:#79B8FF">length</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">            const</span><span style="color:#79B8FF"> card</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.cards[cardIndex]</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> (remove){</span></span>
<span class="line"><span style="color:#79B8FF">                this</span><span style="color:#E1E4E8">.deck[card.suit].</span><span style="color:#B392F0">splice</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.deck[card.suit].</span><span style="color:#B392F0">indexOf</span><span style="color:#E1E4E8">(card), </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">                this</span><span style="color:#E1E4E8">.cards.</span><span style="color:#B392F0">splice</span><span style="color:#E1E4E8">(cardIndex, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#79B8FF">            this</span><span style="color:#E1E4E8">.remaining </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.cards.</span><span style="color:#79B8FF">length</span></span>
<span class="line"><span style="color:#F97583">            return</span><span style="color:#E1E4E8"> card</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">            throw</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Error</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"No Cards remaining"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
</details>


### Showing off cards

We now have a deck that we can do what we want with. If I want to show off every card now I can use:

```html
<style>
    #cards{
        display: grid;
        grid-template-columns: repeat(13, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-column-gap: 2px;
        grid-row-gap: 2px;
        font-size:4rem;
    }
</style>

<div id="cards"></div>

<script>
let a = new Deck()
for (const card of a.cards){
    document.getElementById("cards").innerHTML += card.html
}
</script>
```

Which looks like this (and because it's HTML we can do an interactive demo):

<div>
    <style>
        :root{
            --columns: 13;
            --rows: 4;
        }
        #cards{
            display: grid;
            grid-template-columns: repeat(var(--columns), 1fr);
            grid-template-rows: repeat(var(--rows), 1fr);
            grid-column-gap: 2px;
            grid-row-gap: 2px;
            font-size:4rem;
            overflow-x:auto;
        }
    </style>
    <div id="cards"></div>
</div>

<form>
    <button type="button" style="border: 1px solid black;border-radius: .7rem;padding: .2rem;" onclick="renderDeck();this.focus()">Reset Changes</button><br>
    <input type="range" name="fontsize" min="1" max="8" step="0.1" value=2
    oninput="Array.from(document.getElementsByClassName('card2')).forEach( (el) =>{el.style.fontSize=`${this.value}rem`})">
    <label for="fontsize">Font Size (in rem)</label> <br>
    <input type="range" name="fontweight" min="400" max="800" step="400" value=400
    oninput="Array.from(document.getElementsByClassName('card2')).forEach( (el) =>{el.style.fontWeight=`${this.value}`})">
    <label for="fontsize">Font Weight</label><br>
    <input type="range" name="lineHeight" min="1" max="4" step=".1" value=1.6
    oninput="Array.from(document.getElementsByClassName('card2')).forEach( (el) =>{el.style.lineHeight=`${this.value}`})">
    <label for="lineHeight">Line Height</label><br>
    <input type="range" name="rows" min="1" max="15" step="1" value=4
    oninput="document.querySelector(':root').style.setProperty('--rows', `${this.value}`)">
    <label for="rows">Rows</label><br>
    <input type="range" name="columns" min="1" max="20" step="1" value=13
    oninput="document.querySelector(':root').style.setProperty('--columns', `${this.value}`)">
    <label for="columns">Columns</label><br>
    <input type="color" name="fontColor" value="black"
    oninput="Array.from(document.getElementsByClassName('card2')).forEach( (el) =>{el.style.color=`${this.value}`})"
    style="margin-top:1.2rem;">
    <label for="fontColor">Font Color</label><br>
</form>

### Black Jack

Now because we have a re-usable asset we can start creating card games while focusing on the game logic. For a game like black jack the logic can now be done in less than 70 lines:

<details style="background:#f0f0f0; padding:1rem;border-radius:.7rem;cursor:pointer;"><summary>The code (collapsed for easy reading)</summary>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0"><code><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> dealerCards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> playerCards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> deck </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Deck</span><span style="color:#E1E4E8">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> getHandValues</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">hand</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> totalNumber </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> totalValue </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> (</span><span style="color:#F97583">const</span><span style="color:#79B8FF"> card</span><span style="color:#F97583"> of</span><span style="color:#E1E4E8"> hand){</span></span>
<span class="line"><span style="color:#E1E4E8">        totalNumber </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> card.number</span></span>
<span class="line"><span style="color:#E1E4E8">        totalValue </span><span style="color:#F97583">+=</span><span style="color:#E1E4E8"> card.value</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#E1E4E8"> [totalNumber, totalValue]</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> checkBust</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">hand</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> [total, _] </span><span style="color:#F97583">=</span><span style="color:#B392F0"> getHandValues</span><span style="color:#E1E4E8">(hand)</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> (total </span><span style="color:#F97583">&gt;</span><span style="color:#79B8FF"> 21</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#79B8FF"> true</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#79B8FF"> false</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> hit</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">hand</span><span style="color:#E1E4E8">){</span></span>
<span class="line"><span style="color:#E1E4E8">    hand.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(deck.</span><span style="color:#B392F0">getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> startGame</span><span style="color:#E1E4E8">(){</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> acesHigh </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> false</span></span>
<span class="line"><span style="color:#E1E4E8">    deck </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Deck</span><span style="color:#E1E4E8">(acesHigh)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    dealerCards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [deck.</span><span style="color:#B392F0">getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">), deck.</span><span style="color:#B392F0">getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#E1E4E8">    playerCards </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [deck.</span><span style="color:#B392F0">getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">), deck.</span><span style="color:#B392F0">getRandomCard</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> endGame</span><span style="color:#E1E4E8">(){</span></span>
<span class="line"><span style="color:#F97583">    let</span><span style="color:#E1E4E8"> t </span><span style="color:#F97583">=</span><span style="color:#B392F0"> getHandValues</span><span style="color:#E1E4E8">(playerCards)</span></span>
<span class="line"><span style="color:#E1E4E8">    playerTotalNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">    playerTotalValue </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">    t </span><span style="color:#F97583">=</span><span style="color:#B392F0"> getHandValues</span><span style="color:#E1E4E8">(dealerCards)</span></span>
<span class="line"><span style="color:#E1E4E8">    dealerTotalNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">] </span></span>
<span class="line"><span style="color:#E1E4E8">    dealerTotalValue </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">checkBust</span><span style="color:#E1E4E8">(playerCards) </span><span style="color:#F97583">||</span><span style="color:#E1E4E8"> playerTotalNumber </span><span style="color:#F97583">&lt;</span><span style="color:#E1E4E8"> dealerTotalNumber){</span></span>
<span class="line"><span style="color:#E1E4E8">        console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You Lose"</span><span style="color:#E1E4E8">) </span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> (playerTotalNumber </span><span style="color:#F97583">==</span><span style="color:#E1E4E8"> dealerTotalNumber){ </span><span style="color:#6A737D">// Tie</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (playerTotalValue </span><span style="color:#F97583">&gt;</span><span style="color:#E1E4E8"> dealerTotalValue){</span></span>
<span class="line"><span style="color:#E1E4E8">            console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You win"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">            console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You Lose"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#6A737D">        // dealer Tries to win</span></span>
<span class="line"><span style="color:#F97583">        while</span><span style="color:#E1E4E8"> (dealerTotalNumber </span><span style="color:#F97583">&lt;=</span><span style="color:#E1E4E8"> playerTotalNumber){</span></span>
<span class="line"><span style="color:#B392F0">            hit</span><span style="color:#E1E4E8">(dealerCards)</span></span>
<span class="line"><span style="color:#E1E4E8">            t </span><span style="color:#F97583">=</span><span style="color:#B392F0"> getHandValues</span><span style="color:#E1E4E8">(dealerCards)</span></span>
<span class="line"><span style="color:#E1E4E8">            dealerTotalNumber </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">] </span></span>
<span class="line"><span style="color:#E1E4E8">            dealerTotalValue </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> t[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">            </span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> (</span><span style="color:#B392F0">checkBust</span><span style="color:#E1E4E8">(dealerCards)){</span></span>
<span class="line"><span style="color:#E1E4E8">            console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You win"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> (dealerTotalValue </span><span style="color:#F97583">&gt;=</span><span style="color:#E1E4E8"> playerTotalValue ){</span></span>
<span class="line"><span style="color:#E1E4E8">                console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You Lose"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">            } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">                console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"You win"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">            }</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
</details>

Now we have the logic, we can replace the `console.log()`'s with a div, and insert the text into it to make our UI:

```html
<style>
    #gameDemo{
        background: #1bbc1b7a;
        font-size: 1.4rem;
        padding: 1rem;
        border-radius: 1.1rem;
    }
    #playerCards,
    #dealerCards,
    #gameOutcome{
        background:white;
        padding: .4rem;
        border-radius:1.1rem;
        min-height:40px;
        max-width:fit-content;
        margin-bottom:.5rem;
        min-width:40%;
    }
    #gameDemo button{
        border: 1px solid black;
        border-radius: .7rem;
        padding:.6rem;
        background:white;
        font-size:1.2rem;
        font-weight:400;
        height:min-content;
    }
    #gameDemo .card2{
        font-size:5rem;
    }
</style>
<div id="gameDemo">
    <div style="">
        <span>Player: 
            <div id="playerCards"></div>
        </span>
    </div>
    <div style="">
        <span>Dealer:
            <div id="dealerCards"></div>
        </span>
    </div>
    <div style="display:flex; gap:2rem;">
        <button type="button" onclick="startGame()">Start Game</button>
        <button type="button" onclick="endGame()">End Game</button>
        <button type="button" onclick="hit(playerCards)">+🂠</button>
    </div>
    Outcome
    <div id="gameOutcome"></div>
<div>
```

We can create a helper function called `displayCards()` to show each hand:

```js
function displayCards(){
    document.getElementById("playerCards").innerHTML = ""
    for (const card of playerCards){
        document.getElementById("playerCards").innerHTML += card.html
    }
    document.getElementById("playerCards").innerHTML += `total: ${getHandValues(playerCards)[0]}`

    document.getElementById("dealerCards").innerHTML = ""
    for (const card of dealerCards){
        document.getElementById("dealerCards").innerHTML += card.html
    }
    document.getElementById("dealerCards").innerHTML += `total: ${getHandValues(dealerCards)[0]}`
}
```


We then just need to update the `div` with an ID of `gameOutcome` for the end of the game and we get something that looks like this:

<style>
    #gameDemo{
        background: #1bbc1b7a;
        font-size: 1.4rem;
        padding: 1rem;
        border-radius: 1.1rem;
    }
    #playerCards,
    #dealerCards,
    #gameOutcome{
        background:white;
        padding: .4rem;
        border-radius:1.1rem;
        min-height:40px;
        max-width:fit-content;
        margin-bottom:.5rem;
        min-width:40%;
    }
    #gameDemo button{
        border: 1px solid black;
        border-radius: .7rem;
        padding:.6rem;
        background:white;
        font-size:1.2rem;
        font-weight:400;
        height:min-content;
    }
    #gameDemo .card2{
        font-size:5rem;
    }
</style>
<div id="gameDemo">
    <div style="">
        <span>Player: 
            <div id="playerCards"></div>
        </span>
    </div>
    <div style="">
        <span>Dealer:
            <div id="dealerCards"></div>
        </span>
    </div>
    <div style="display:flex; gap:2rem;">
        <button type="button" onclick="startGame()">Start</button>
        <button type="button" onclick="endGame()">Stay</button>
        <button type="button" onclick="hit(playerCards)">+🂠</button>
    </div>
    Outcome
    <div id="gameOutcome"></div>
</div>

## Conclusion

A fully functional HTML-based game with nothing but knowledge of how to do web development to get it to work. Now I'll admit this isn't the prettiest game ever, but because it's made with simple web technologies it's easy to integrate with whatever design you want. It's also easy to embed in whatever website you want. All without having to learn a proper game engine.




<script client:load>
    class Card{
        /** 
        Suit {"♠"|"♥"|"♦"|"♣"} - The suit of the card
        acesHigh {Boolean} - The value of the card between 1-13 (ace is 1 and becomes 14 if acesHigh)
        */
        constructor (suit, value, acesHigh = false){
            let color = "black"
            if (suit ==="♥" || suit ==="♦"){
                color = "red"
            }
            let letter = "A"
            switch (suit){
                case "♠": letter = "A"; break;
                case "♥": letter = "B"; break;
                case "♦": letter = "C"; break;
                case "♣": letter = "D"; break;
                default: throw new Error(`Provided suit is invalid ${suit}`);break;
            }
    
            let characterNumber = value
            if (value>9){ // Need to start with hex values A-E
                if (value >11){ 
                    characterNumber = (value+1).toString(16).toUpperCase()
                } else{
                    characterNumber = value.toString(16).toUpperCase()
                }
            }
            this.suit = suit
            this.character = `&#x1F0${letter}${characterNumber};` // UTF-8 Character 
            this.html = `<span class="card2" style="color:${color}">&#x1F0${letter}${characterNumber};</span>`    

            if(value == 1  && acesHigh){
                this.value = 14
            }
            
            this.value = value // The raw value (i.e. queen > jack since queen is higher value)

            if (value == 14){ // Aces high, and it's an ace
                this.number = 11
            } else if (value > 10){ // The base value (i.e. queen == jack since both are 10)
                this.number = 10 
            } else{
                this.number = value
            }
        }
    }
    
    class Deck{
        constructor (){
            let cards = []
            let deck = {
                "♠":[],
                "♥":[],
                "♦":[],
                "♣":[]
            }
            for (const suit of ["♠","♥","♦","♣"]){
                for (let i=1;i<=13; i++){
                    let newCard = new Card(suit, i)
                    cards.push(newCard)
                    deck[newCard.suit].push(newCard)
                }
            }
            this.cards = cards            // The cards in the deck in an unordered array
            this.deck = deck              // The cards in the deck, by suit
            this.remaining = cards.length // Number of cards remaining
        }
    
        /** Gets a random card, if remove is True will remove it from this.remaining*/
        getRandomCard(remove=false){
            if (this.cards.length){
                const cardIndex = Math.floor(Math.random()*this.cards.length)
                const card = this.cards[cardIndex]
                if (remove){
                    this.deck[card.suit].splice(this.deck[card.suit].indexOf(card), 1)
                    this.cards.splice(cardIndex, 1)
                }
                this.remaining = this.cards.length
                return card
            } else {
                throw new Error("No Cards remaining")
            }
        }
    } 


    
    function renderDeck(){
        console.log("We here")
        let a = new Deck()
        document.getElementById("cards").innerHTML = ""
        for (const card of a.cards){
            document.getElementById("cards").innerHTML += card.html
        }
    }

    renderDeck()
    
</script>


<script client:load>
let dealerCards = []
let playerCards = []
let deck = new Deck()

function getHandValues(hand){
    let totalNumber = 0
    let totalValue = 0
    for (const card of hand){
        totalNumber += card.number
        totalValue += card.value
    }
    return [totalNumber, totalValue]
}
function checkBust(hand){
    let [total, _] = getHandValues(hand)
    if (total > 21){
        return true
    }
    return false
}

function hit(hand){
    hand.push(deck.getRandomCard(true))
    displayCards()
}

function displayCards(){
    document.getElementById("playerCards").innerHTML = ""
    for (const card of playerCards){
        document.getElementById("playerCards").innerHTML += card.html
    }
    document.getElementById("playerCards").innerHTML += `total: ${getHandValues(playerCards)[0]}`

    document.getElementById("dealerCards").innerHTML = ""
    for (const card of dealerCards){
        document.getElementById("dealerCards").innerHTML += card.html
    }
    document.getElementById("dealerCards").innerHTML += `total: ${getHandValues(dealerCards)[0]}`
}

function startGame(){
    let acesHigh = false
    deck = new Deck(acesHigh)

    dealerCards = [deck.getRandomCard(true), deck.getRandomCard(true)]
    playerCards = [deck.getRandomCard(true), deck.getRandomCard(true)]
    document.getElementById("gameOutcome").innerHTML = ""
    displayCards()
    
}

function endGame(){
    let t = getHandValues(playerCards)
    playerTotalNumber = t[0]
    playerTotalValue = t[1]
    t = getHandValues(dealerCards)
    dealerTotalNumber = t[0] 
    dealerTotalValue = t[1]
    
    if (checkBust(playerCards) || playerTotalNumber < dealerTotalNumber){
        // Replace with logic to display
        document.getElementById("gameOutcome").innerHTML = "You Lose"
        console.log("You Lose") 
    } else if (playerTotalNumber == dealerTotalNumber){ // Tie
        if (playerTotalValue > dealerTotalValue){
            document.getElementById("gameOutcome").innerHTML = "You win"
            console.log("You win")
        } else{
            document.getElementById("gameOutcome").innerHTML = "You Lose"
            console.log("You Lose")
        }
    } else{
        // dealer Tries to win
        while (dealerTotalNumber <= playerTotalNumber){
            hit(dealerCards)
            t = getHandValues(dealerCards)
            dealerTotalNumber = t[0] 
            dealerTotalValue = t[1]
            
        }
        if (checkBust(dealerCards)){
            document.getElementById("gameOutcome").innerHTML = "You win"
            console.log("You win")
        } else{
            if (dealerTotalValue >= playerTotalValue ){
                document.getElementById("gameOutcome").innerHTML = "You Lose"
                console.log("You Lose")
            } else {
                document.getElementById("gameOutcome").innerHTML = "You win"
                console.log("You win")
            }
        }
    }
}
</script>


















