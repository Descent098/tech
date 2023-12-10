---
title: HHTTPPP; Implementing the networking portion
subtitle: How to use sockets to communicate over the internet
description: "Doing the socket communication for HTTP. HHTTPP; Writing your own HTTP server Part 4/5"
pubDate: 2023-09-25T00:00:00-06:00
modified_date: ""
heroImage: /astro-redesign/blog/hhttpp/hero.jpg
crosspostURL: https://schulichignite.com/blog/hhttpp/implementing-the-networking-portion/
tags:
  - python
  - scorch
  - web
  - theory
---

We have what we need to make HTTP requests and responses properly, so now let's look at adding networking so we can see the results in the browser. It's important to note we're only covering enough networking to understand **this project**, we're not covering everything there is to know about networking. So keep in mind there might be more steps and technologies in real server interactions!

Another warning is that for this set of code there is no easy way to test it without a ton of boilerplate code and concepts I would need to cover, and as such there are no additional tests for this post. If you want to know if your code works then open the URL to your server in a browser and see if it loads ¯\\\_(ツ)\_/¯.

## How connections work

In previous posts we looked at a bunch of terms:

- Ip's and ports
  - ipv4 vs ipv6
  - Localhost
- hostname/DNS
- etc.

For simplicity we will only care about a few terms:

- Ip's
- Ports
- Protocols
- Berkley Sockets

When we want to connect to another computer we can think about it the same way we would when we're sending a letter, or even an email. There's a few things we need:

- A message
- A place to deliver the message
- A place to get a response
- A procedure to deliver the message

Here is what the equivalent mail to http values would look like:

|Role|HTTP|Mail|
|----|----|----|
|A message| HTTP request | A letter or package | 
|A place to deliver the message| The **client** IP address & port | An address | 
|A place to get a response| The **host** IP address & port | An address | 
|A procedure to deliver the message| HTTP over berkley sockets | The mail company rules through a post delivery person | 

So for the postal service when you send a letter they will:

0. Drop off the letter at a post office to be sent
1. Lookup the address on the letter/package
2. Find the corresponding physical location on the letter/package
3. Drive to the location following rules and procedures of the company, and drop off the letter/package

For retrieving a site they will:

0. If they used a domain they need to lookup the IP address associated with the domain
1. Start a connection with the IP address of the host through a berkley socket
2. Send an HTTP request through the socket
3. Wait for a response to be sent back from the server through the socket


## Berkley Sockets

\**We will cover the basics, but if you want a breakdown of sockets in detail (in python and in the underlying C calls python is making) check out [this gist](https://gist.github.com/Descent098/783f68e1e3943e8796a3aaf8a14f8013).*

We've now looked at how berkley/bsd sockets are used, but let's get into specifics. Our steps were:

0. If they used a domain they need to lookup the IP address associated with the domain
1. Start a connection with the IP address of the host through a berkley socket
2. Send an HTTP request through the socket
3. Wait for a response to be sent back from the server through the socket

\**Keep in mind when you hear "sockets" in webdev it can mean berkley sockets, **or** [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)*

### So what actually are berkley sockets?

Berkley/bsd Sockets are a fancy API provided by your operating system that allows you to talk to your NIC (network interface card). Your NIC is what sends the 1s and 0s over the internet, and berkley sockets are an API built on top of the hardware to make it easier to work with lower-level networking. They basically allow you to talk back and forth between you and your NIC in human-friendly ways. Under the hood each persons NIC running the code might be doing different things when you dig into the details, but berkley sockets are a universal standard for interfacing with NICs for basically any brand/card in your PC.

In our analogy from before Berkley Sockets would be the mail person delivering the mail. It's job is to simply connect to a computer and send/recieve data. It has no rules about what protocols you talk using, or anything like that. This means they can be used for more than HTTP (like [telnet](https://en.wikipedia.org/wiki/Telnet) or [sftp](https://www.ssh.com/academy/ssh/sftp-ssh-file-transfer-protocol)).

## How to use them

There are 3 basic steps (and some sub-steps within them) to using berkley sockets as a server/host in your code:

1. Setup/config: Tell the socket what you intend to do with it, so it can set itself up for what you need. This includes what type of IP address ([IPV4](https://bluecatnetworks.com/glossary/what-is-ipv4/#:~:text=Now%2C%20exactly%20what%20is%20IPv4%3F) or [IPV6](https://en.wikipedia.org/wiki/IPv6_address#:~:text=An%20IPv6%20address%20is%20represented,the%20representation%20of%20IPv6%20addresses.)), [socket type/kind](https://stackoverflow.com/questions/5815675/what-is-sock-dgram-and-sock-stream), and any [options](https://www.gnu.org/software/libc/manual/html_node/Socket_002dLevel-Options.html#Socket_002dLevel-Options) you want to use.
2. Binding and listening: When you tell the socket what IP address and port to bind to, as well as when to start listening for connections
   1. Call `.bind()` with the host and port, this "reserves" the port so other sockets can't use them on the same IP address
   2. Call `.listen()` to tell the socket to start listening for potential connections
   3. Call `.accept()` to say you're fine with the incomming connection (any validation steps for only allowing certain devices would happen between `.listen()` and `.accept()`)
3. Send/recv: This is when data is exchanged between the client and host

### How this works in python

In python you create a socket with a [context manager](https://www.learndatasci.com/solutions/python-context-managers/). What this does is basically for the duration of the program a socket will be opened, but you must make sure to close the socket or else that port is constantly being used and never released. A context manager makes sure that a socket is always closed once you're done with it.

Here is what steps 1 and 2 would look like in python:

```python
import socket

ip = "127.0.0.1" # The IP address to use, this one specifies internal
port = 8338 # The port to bind to

# Step 1
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # Set internal socket to allow SO_REUSEADDR (1 means true)

    # Step 2
    s.bind((ip, port)) # Bind the configured socket to the server (assign ip address and port number to the socket instance)
    s.listen(1) # Listen for incoming connections
    client_connection, client_address = s.accept() # Accept connections and return details about them
```

There's a few constants and variables we're using here so let's explain what they do

| Constant/variable name | Purpose | 
|---------------|---------|
| [socket.AF_INET](https://docs.python.org/3/library/socket.html#socket.AF_INET) | This specifies you want to use an [ipv4](https://www.juniper.net/documentation/us/en/software/junos/interfaces-security-devices/topics/topic-map/security-interface-ipv4-ipv6-protocol.html#:~:text=Length%20Subnet%20Masks-,IPv4%20Classful%20Addressing,-To%20provide%20flexibility) ip address instead of an [ipv6](https://en.wikipedia.org/wiki/IPv6_address#:~:text=An%20Internet%20Protocol%20Version%206,the%20destination%20of%20each%20packet.) one |
| [socket.SOCK_STREAM](https://docs.python.org/3/library/socket.html#socket.SOCK_STREAM) | This tells the socket to use [TCP](https://www.fortinet.com/resources/cyberglossary/tcp-ip#:~:text=Transmission%20Control%20Protocol%20(TCP)%20is,data%20and%20messages%20over%20networks.) instead of [UDP](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/#:~:text=The%20User%20Datagram%20Protocol%2C%20or,connection%20before%20data%20is%20transferred.), this distinction is complicated, so don't worry about it for now, you will basically always use TCP unless you're in certain performance constrained situations but [here is a quick breakdown](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/#:~:text=TCP%20vs.%20UDP,-UDP%20is%20faster)| 
| [socket.SOL_SOCKET](https://www.gnu.org/software/libc/manual/html_node/Socket_002dLevel-Options.html#Socket_002dLevel-Options) | Allows you to set options for a socket (like SO_REUSEADDR below)| 
| [socket.SO_REUSEADDR](https://www.gnu.org/software/libc/manual/html_node/Socket_002dLevel-Options.html#index-SO_005fREUSEADDR) | Lets you reuse a set port if you need to. This just helps avoid weird bugs when testing locally that can occur |
| client_connection | This is another `Socket` object that represents the client connection to the server, it is what we use to get data, and send it back |
| client_address | The address (ipv4 in our case) for the client connecting to you |

From this we can then add in step 3:

```python
import socket

ip = "127.0.0.1" # The IP address to use, this one specifies internal
port = 8338 # The port to bind to

# Step 1
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

  s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # Set internal socket to allow SO_REUSEADDR (1 means true)

  # Step 2
  s.bind((ip, port)) # Bind the configured socket to the server (assign ip address and port number to the socket instance)
  s.listen(1) # Listen for incoming connections
  client_connection, client_address = s.accept() # Accept connections and return details about them

  # Step 3
  # Get the client request
  raw_data = client_connection.recv(4096)
  if raw_data:
      request = raw_data.decode() # Used to take the recieved data, and convert it to text
  else: 
      raise ValueError("No raw data found")

  print(request) # The plaintext version of a request
  
  # The response would in our code be made by Server.generate_response()
  response = "HTTP/1.1 200 OK\n\n<h1>Hello World</h1>"
  
  client_connection.sendall(response.encode())  # Send the HTTP plaintext response back
  client_connection.shutdown(socket.SHUT_RDWR) # Tell the client we have  no additional responses to send them for now
```

So, we can send data, all that's left is to replace the request parsing, and response generation with our server methods, and we're good to go.... right...

### Common gotchas

Networking is very finicky, and there's lots of weird problems that can arise such as:

- Clients/hosts losing connection mid-message
- Multiple servers with their own configurations and rules potentially causing issues
- Mostly everything being sent is just a bunch of strings. So all of the below are possible problems:
  - Not doing data validation (Letters where there should be numbers, remote code execution etc.)
  - Using a different [encoding](https://schulichignite.com/definitions/encoding/)

But with all of these gotchas there's one we will need to make sure we code around...

### Binary vs Text data

Files on your computer can be grouped in 2 common types. Text and Binary; Text is what we've been working with so far. Things like source code, or just plain `.txt` files. Text files can just be read and understood. The contents of the file just need to be displayed to make them useful. 

Binary files on the other hand are meant to be interpreted and/or executed. When you open a `.jpg` file you don't read the number values for the pixels, instead a program (like the windows photo viewer) interprets the data, and is executed to show you a human-understandable version of it. The same is true for binary executables like `.exe` files, which themselves are meant to "run", not just be "read".

The problem is that computers store these types of files differently. For text documents it's good enough to encode the text (using something like `"some data".encode()`) and send using `Socket.sendall()` (which sends all the data at once). Here is a stripped down example, imagine `client` in this case is a socket that is connected to the client, and we wanted to send the contents of `index.html` to them, we could do:

```python
import socket

with socket.Socket() as client: # We will imagine this is a valid connection to the client

  # Get data from file client is looking for
  with open("index.html", "r") as response_file:
    data = response_file.read() # Read plaintext data from file

  # Generate full response
  response = f"HTTP/1.1 200 OK\nserver:hhttpp\n\n{data}"
  client.sendall(response.encode()) # Encode and send the whole response

  # Cleanup
  client_connection.shutdown(socket.SHUT_RDWR)
```

For binary files however the first line of a Request/Response and the headers are text, but the content could be something called a binary string (or binary data).

#### How binary files work

Binary is a number system that uses base 2 instead of base 10 (if you're interested see [this video]() for details). We can actually see the binary versions of numbers in python by seting an `int` to base 2 instead of 10 by using `bin()` (we can also do base 16 using `hex()`):

```python
256
bin(256) # '0b100000000'
hex(256) # '0x100'
```

You'll notice that the values we get back look like strings. This is because they are a text representation of numbers, where the first 2 digits tell you the type (`0b` for binary `0x` for hexedecimal). Everything we do on a computer eventually comes back to 1's and 0's (see [this article]() for more details). A group of 8 digit binary is called a byte (`0b00000000` to `0b11111111`), a single byte can be converted to a single hexedecimal number. A byte just so happens for a ton of reasons to be a nice way to split up binary numbers, and that's why we often use it in computer science.

Binary files are files that are composed of just 1's and 0's into bytes, and that's all they contain. If you were to try to look at a binary file you will often get incomprehensible nonsense because it's just a bunch of numbers.

#### Binary/byte Strings

When we read a binary file we get a byte string. Which is a string of characters which split the file into bytes. From there we directly read the bytes. Images for example are often a collection of 3 numbers representing the RGB values of a colour for a given pixel. So an image file just puts those numbers into the file so each pixels numbers are just lined up next to each other. For example:

```
(255, 255, 255)                             <-- Original value of 1 pixel
(255, 255, 255), (0, 0, 0), (135, 135, 135) <-- Original value of 3 pixels
0xFF0xFF0xFF                                <-- Byte string value of 1 pixel
0xFF0xFF0xFF0x000x000x000x870x870x87        <-- Byte string value of 3 pixels
```

To get this info in python we need to read/write our files with an extra b appended to the method (i.e. `wb` or `rb`). So to read the byte string of an image we would do:

```python
filename = "ice-caps.jpg"

with open(filename, "rb") as file:
  data = file.read()

data # b"0xFF0xFF0xFF0x000x000x000x870x870x87"
```

Notice that byte strings have a `b` prefix before the string, this helps you differentiate. You can switch back to a string representation (sometimes) with `b"".decode()`.

Text files actually work the same way, and are stored the same, but we just hide the complexity. When we read text files we are supposed to specify an encoding (usually in [UTF-8](https://blog.hubspot.com/website/what-is-utf-8#:~:text=UTF%2D8%20is%20an%20encoding,or%20%E2%80%9CUnicode%20Transformation%20Format.%E2%80%9D), this encoding is what helps us interpret the characters properly. [Here is a page](https://www.learnbyexample.org/python-open-function/) with additional details about `open()` but here is what is happening for you by default:

```python
filename = "data.txt"

with open(filename, "r", encoding="UTF-8") as file:
  data = file.read()

data # "some text"
```

When we call `"".encode()` on a string it reverses the encoding process, and goes back to a binary string). 

#### Sending binary data over a socket

Here is a stripped down example, imagine `client` in this case is a socket that is connected to the client, and we wanted to send the contents of `index.html` to them, we first send the text data, then we send the binary data:

```python
import socket

filename = "ice-caps.jpg"

with socket.Socket() as client: # We will imagine this is a valid connection to the client

  # Get data from file client is looking for
  with open(filename, "rb") as response_file:
    data = response_file.read() # Read binary data from file

  # Send text data
  first_line_of_response = f"HTTP/1.1 200 OK\nserver:hhttpp\n\n"
  client_connection.send(first_line_of_response.encode())
  
  # Send Binary Data
  client_connection.sendall(data)

  # Cleanup
  client_connection.shutdown(socket.SHUT_RDWR)
```

So the full version of this process would be:

```python
import socket

ip = "127.0.0.1" # The IP address to use, this one specifies internal
port = 8338 # The port to bind to
filename = "ice-caps.jpg"

# Step 1
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

  s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # Set internal socket to allow SO_REUSEADDR (1 means true)

  # Step 2
  s.bind((ip, port)) # Bind the configured socket to the server (assign ip address and port number to the socket instance)
  s.listen(1) # Listen for incoming connections
  client_connection, client_address = s.accept() # Accept connections and return details about them

  # Step 3
  # Get the client request
  raw_data = client_connection.recv(4096)
  if raw_data:
      request = raw_data.decode() # Used to take the recieved data, and convert it to text
  else: 
      raise ValueError("No raw data found")

  print(request) # The plaintext version of a request
  
  # Get data from file client is looking for
  with open(filename, "rb") as response_file:
    data = response_file.read() # Read binary data from file

  # Send text data
  first_line_of_response = f"HTTP/1.1 200 OK\nserver:hhttpp\n\n"
  client_connection.send(first_line_of_response.encode())
  
  # Send Binary Data
  client_connection.sendall(data)
  
  client_connection.shutdown(socket.SHUT_RDWR) # Tell the client we have  no additional responses to send them for now
```


## Conclusion

All this functionality was added to `Server.start_server()`, which you can see the source for [here](https://github.com/Descent098/HHTTPP/blob/master/Post%203/Handmade%20HTTP%20Project/hhttpp/classes.py#L357-L412)!

## Resources

- [Socket module](https://docs.python.org/3/library/socket.html)
- [Official python socket howto](https://docs.python.org/3/howto/sockets.html)
- [Another intro to sockets](https://realpython.com/python-sockets/)
- [Berkley Socket's (video)](https://www.youtube.com/watch?v=onQTzTJ5sqU)
- [Python Socket Programming Tutorial (video)](https://www.youtube.com/watch?v=3QiPPX-KeSc)
- [Socket Programming in Python(Simplified) - in 7 minutes! (Video, covers client and server)](https://www.youtube.com/watch?v=JNzfG7XMYSg)