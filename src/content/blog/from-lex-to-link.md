---
title: From Lex to Link
subtitle: Building a simple compiler from source code to LLVM
description: My experience learning, building, and debugging a simple compiler
pubDate: 2026-02-20
heroImage: /tech/blog/the-rsc-problem.png
tags:
    - theory
    - compilers
---
<!-- CHANGE IMAGE -->


New year, new me. For 2026 I wanted to do less, but more intricate projects, so naturally I picked a compiler. Full disclosure I am in a compiler course at the same time, but the approach taken in the course is much more high level than this article will cover. 


## Lexer

The steps are:

1. Read characters (`rune`s in this case) one by one from the source text
2. For each character decide if it's
    - An Operator (`+`, `-`, `&&`, etc.)
    - An Identifier (`if`, `while`, `func`, variables, etc.)
    - Whitespace (which will be skipped)
3. If not whitespace produce a token,
4.  Add the token to a slice that you return at the end of the scanning function


The meat of the character parsing comprised primarily of 2 functions `parseOperator()` and `parseIdentifier()`. To determine which to use a function `isOperator()` was made, which checks if the current character is an operator, if it's not, then it's an identifier. 

