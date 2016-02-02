---
comments: true
date: '2007-04-24 09:41:39'
layout: post
slug: sans-web-application-security-review
status: publish
title: 'SANS: Web Application Security Review'
wordpress_id: '81'
categories:
- events
- software development
- systems administration
tags:
- linux
- php
- windows
- security
---

I'm here in Austin, TX today at the <a href="http://www.sans.org/training/description.php?tid=455"  title="SANS: Web Application Security Workshop">SANS: Web Application Security Workshop</a> (I was also here yesterday, too). I hope to be able to provide an accurate review for this nearly worthless workshop that many of us from CIS Customer Applications are attending. There are a couple of individuals who believe that the information being taught here is somewhat worthwhile, but most of us from the group either know everything that's been taught so far, or find some of the information being taught doesn't relate to us. 

For a quick synopsis, here's what I would have to say: If you are a intermediate or experienced developer, you will be absolutely bored with this workshop. If you are an executive who has not much technical know-how, but want to learn about security for your web applications, this is a worthwhile program for you to attend. <b>Be aware</b>, however, because there are some things that executives don't need to (or don't care to) learn about in this. Regardless, this is the most watered down version of a so-called technical workshop I've ever been through. Read on to find out how ridiculous some of the things we learned were. 

<!--more-->
<h3>Web Application Architecture</h3>
In the beginning portion of this workshop, the speaker taught everyone about how to setup a secure architecture for your application and creating segregation of information and duties by creating a tiered application setup (ie: having firewall then web server then application server then database server, etc.). This stuff is mostly server administration and/or managerial information - not developer information. Granted, I've learned about this type of setup many many years ago, it's only possible to implement when an organization actually has <b>money</b>. Anywho, a worthless topic to talk about. 

<h3>Unicode Exploits</h3>
The next topic discussed (which was presented in a manner that probably would fly really high above executives) was unicode exploits and how servers and their applications are susceptible to them. Again, another topic I've already learned about.

<h3>SSL Certificates</h3>
Yes, there was a talk on SSL certificates and the "error messages" that are displayed when you access a page that has an invalid, expired, or otherwise bad SSL certificate. This one was geared towards the executives in the room because anyone with a hint of a bit of intelligence in the IT sector already knows everything they discussed. Certificates, Certificate Authorities, etc. are relatively straightforward and is more boring data. The one thing that was a little more challenging to know about were making certain that your web server is returning appropriate Cryptographic methods (and not null-ciphers) so that you are using a strong encryption method and not a weak encryption method. 

<h3>Authentication Methods</h3>
This was probably the biggest waste of my time. This section was talking about HTTP Basic and Digest Authentication (and only a _little_ bit of form-based authentication). They mentioned sanitizing the input data to make certain that the user doesn't try to do SQL injections (which is covered later in this workshop). This was an overly long section that essentially represented that the moral was just use SSL for any type of authentication. 

<h3>Hacking Tools</h3>
Yes, hacking tools. This course involves using a few different hacking tools to test your application. In particular, the course taught us how to use Brutus, Nikto, WebScarab, for brute force attacking your application, checking your web server for vulnerabilities, and viewing comments, hidden fields, and other things to try to either do session hijacking, trying to break websites, or going through and modifying the HTTP headers you are sending to the server. 

Overall, these are cool tools, but I've used some variants of these before and they don't usually stay in my toolbox (except for viewing and modifying HTTP headers - Komodo has that feature built-in and is a very worthwhile tool). 

<h3>Summary</h3>
Well, my brief summary was on the front page, which basically was that if you are an experienced developer, don't even bother attending this conference. I'll update later at the end of this workshop. 
