---
title: How to give a stranger your credit card
subtitle: An intro to encryption & public-key encryption
description: "How do we pay for things safely online? How does encryption happen safely over a network. How does public key encryption work?"
pubDate: 2023-11-13T00:00:00-06:00
heroImage: /astro-redesign/blog/cc.jpg
crosspostURL: https://schulichignite.com/blog/how-to-give-a-stranger-your-credit-card/
tags:
  - security
  - theory
  - cryptography
  - encryption
---

When you go online and buy something it's taken for granted that the store you're buying from is protecting your data. How does this work? Ultimately when you buy something the person you're buying from needs your payment information. But if we just send them our information then it just takes someone watching our network traffick to steal our info (called a man-in-the-middle attack). This is where encryption comes in.

## What is encryption

Encryption is a system that allows you to create some sort of key. You then encrypt data you want to keep safe, and without a key it looks like random text, but you can use the key to reverse the encryption and turn it back into the original content. A sort of virtual padlock that is used to protect your information.

## Encryption Protocols

There are a ton of different options for doing encryption, but we will start by looking at an older protocol that was very popular, look at it's weaknesses and look at a more modern option!

### One time pad

The one time pad actually pre-dates computers. It was used often in WW2 to encrypt messages between soldiers. It relies heavily on [encoding](https://schulichignite.com/definitions/encoding/). Let's take this simple example of an encoding, we'll use `string.printable` which contains all ACII printable characters. With this every letter in text can be converted to a number by checking it's index in the list:

```python
import string

test_string = "Hello World!"

numbers = []

for letter in test_string:
    numbers.append(string.printable.index(letter))

print(f"{test_string} can be represented with: {numbers}")
```

So we can now get a list of integers to represent our text. This is handy because there is now a few formulas we can use:

```text
text XOR pad = ciphertext
ciphertext XOR pad = text
ciphertext XOR text = pad
```

where `text` is our original message, `pad` is a set of randomly generated numbers that are equal length to text, and the `ciphertext` is the encrypted text. So the basic algorithm to encrypt our data is:

1. Generate a `pad` of equal length to `text` of random characters
2. Convert `pad` and `text` to numbers using an encoding (in our case `string.printable` indicies)
3. For each number in the same index for `pad` and `text` XOR them together, and put all those values in a new list
4. use the constructed list of XOR values, and construct a string from `string.printable` indicies with those values called `ciphertext`
5. Distribute the `pad` to people you trust
6. Send the ciphertext publicly to the people you trust

Only the people who have the `pad` from step 5 can decrypt it! Here's the basic implementation:

```python
import string
import random
test_string = "Hello World!"

def encrypt(text):
    ciphertext = []
    pad = []
    for letter in text:
        # Get number representations of current letter and random pad number
        pad_number = random.randint(0, len(string.printable)) # Randomly generated number for the pad
        letter_number = string.printable.index(letter) # number representation of current letter in text
        
        # Append string representation to pad list
        pad.append(string.printable[pad_number])
        
        # Generate ciphertext letter by XORing pad_number and letter_number
        ciphertext.append(string.printable[pad_number^letter_number])
        
    return "".join(pad), "".join(ciphertext)

def decrypt(pad, ciphertext):
    result_text = []
    for pad_letter, ciphertext_letter in zip(pad, ciphertext):
        # Get number representations of current pad and ciphertext characters
        pad_number = string.printable.index(pad_letter)
        ciphertext_number = string.printable.index(ciphertext_letter)
        
        # Append the string representation of the original text after XORing
        result_text.append(string.printable[pad_number ^ ciphertext_number])
    return "".join(result_text)

pad, ciphertext = encrypt(test_string)

print(f"{pad=}, {ciphertext=}") # pad=p[*7E+1cQcgW ciphertext=O{?iMmXkLpt4
print(decrypt(pad, ciphertext)) # Hello World!
print(test_string== decrypt(pad, ciphertext)) # True
```

So you can only decrypt with the right pad! Keep in mind that XOR will allow you to get numbers that go outside the possible range of `string.printable`, so this code **can** raise an `IndexError`. If you want to see a better implementation check out:

- A [video explanation](https://www.youtube.com/watch?v=QVV_bUxxiZ8)
- [Source code for better implementation](https://github.com/Descent098/simple-otp)

With that out of the way, let's look at some problems with this approach.

### Public key encryption

Public key encryption is a special class of encryption protocols. This is because you **never** have to publicly share **any** private information for it to work. With the one-time-pad step 5 was to distribute the pad, the problem is that we can't do this section publicly. The protocol relies on there already safely having been delivered a pad to the person you're trying to communicate with. If you send the pad publicly, people can access the pad and break your encryption. 

Public key encryption solves this with fancy math equations that allow you to send enough information for you and someone else to have the same key, but anyone else can't break into your data. At first this seems impossible, but there is a way.

#### Diffie Hellman

Before explaining diffie-hellman, let's talk about what this would look like. Let's say you have two people, Alice and Bob. Bob wants to send alice a message, but he doesn't want eve to see the message. If they were using diffie hellman, all that Eve would see is an interaction like this:


```
Alice and Bob agree on two numbers:
    p = 281
    g = 53493
Alice sends Bob:
    A = g^a mod p = 70
Bob sends alice:
    B = g^b mod p = 122
```

This would be all that Eve sees, but behind the scenes bob and alice both have the number 119 generated as their key, but how? Admittedly the math behind this is complicated, but the implementation in code is pretty easy. Here is a guide on what each variable means:

| Common name | Variable | Description |
|-------------|----------|-------------|
|Shared Prime | p |  This is a number decided upon by both Alice and Bob (eve knows this also), that is a prime number which is used in the various modulus calculations explained later.|
|Shared Base | g |  This is an arbitrary number decided upon by both Alice and Bob (eve knows this also), that has no requirements beyond being positive and each member knowing about it.|
|Alice Secret | a |  This is a secret that only Alice knows, and is used to calculate her public key (A) and the common secret (s and a_s).|
|Bob Secret | b |  This is a secret that only Bob knows, and is used to calculate his public key (B) and the common secret (s and b_s).|
|Alice Public | A |  Alice's public key that is sent to Bob (and it is assumed that eve also knows it) and it used to calculate s and b_s|
|Bob Public | B |  Bob's public key that is sent to Alice (and it is assumed that eve also knows it) and it used to calculate s and a_s|
|Common Secret | s |  The secret that is calculated by each after the exchange of the public secrets. Naturally this implies that a_s == s == b_s (otherwise something has gone wrong).|
|Alice Calculated Common Secret | a_s |  Alice's calculated common secret, if the exchange is done properly then a_s == s == b_s .|
|Bob Calculated Common Secret | b_s |  Bob's calculated common secret, if the exchange is done properly then a_s == s == b_s .|

From here the formula we need is: 

```
g^(a) mod p = A
g^(b) mod p = B

B^a mod p = common secret
A^b mod p = common secret
```

Essentially only `a` and `b` need to be secret, `p`, `A`, `B`, `g` can all be known by Eve and she still can't break the encryption. So the full exchange would look like this:


```
First a shared prime (p) & shared base (g) were generated(eve knows these also):
        p = 281
        g = 53493

Next Alice and Bob generated their own private secrets (a and b respectively):
        a = 348
        b = 26699

Alice and Bob now compute their public secrets and send them to each other.
These are represented as A and B respectively (eve knows these also):
        A = g^a mod p = 70
        B = g^b mod p = 122

Alice and Bob can now calculate a common secret that can be used to encrypt later transmissions:
        Alice's Calculation:
                s = B^a mod p = 119
        Bob's Calculation:
                s = A^b mod p = 119
```

<pre class="mermaid">
sequenceDiagram
    actor Alice
    actor Bob
    Note left of Alice: a = 348 (private)
    Note right of Bob: b = 26699 (private)
    critical Public communication
        Alice-->Bob: p = 281 g = 53493
        Alice ->> Bob: A = 70 (calculated using g^a mod p)
        Bob ->> Alice: B = 122 (calculated using g^b mod p)
    end
    Note left of Alice: s = B^a mod p = 119 (private)
    Note right of Bob: s = A^b mod p = 119 (private)
</pre>


The code is pretty simple to implement, you can find an example of it [here](https://github.com/Descent098/diffie-hellman). Once that key is generated it can either be used directly, or can be put into another encryption protocol in some way. A variant of diffie hellman called [ECDH (Eliptic Curve Diffie Hellman)](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/) is one of the public-key algorithms used to encrypt your web traffic. When you go to a website that has `https` in it's name, this means some kind of public-key exchanged happened and was used to help  encrypt your connection. The s at the end means secure, and many TLS/SSL certificates use Diffie-Hellman to generate their keys.

So everytime you're going to use your credit card online you can know that one of these systems is keeping you safe (unless you're on http instead of https, then run away!). 
