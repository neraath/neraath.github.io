---
comments: true
date: '2006-08-19 12:43:09'
layout: post
slug: ip-address-regular-expression
status: publish
title: IP Address Regular Expression
wordpress_id: '26'
categories:
- software development
tags:
- php
- code
---

This regex command I determined and figure I would share with everyone trying to verify the authenticity of an IP address.

{% highlight text %}
^([0-9]{1,3}\.){3}[0-9]{1,3}$
{% endhighlight %}

If you have a better regex, certainly entertain me. I'm always willing to listen.

This came about as a result of realizing that a contact form on my business's website fell subject to XSS (Cross-Site Scripting) attacks. Essentially, what the person (script, computer, hacker, evil sons of b*tches) was using my form and figured out a way to use it to spam others. This came about by checking my mail log and trying to figure out why I had such a large queue of messages, and why my email count had been ridiculously high going to different outbound accounts.

What happens is people can inject a statement as follows into a text field (textarea input, or any other input field):

{% highlight text %}
bcc: email@email.com\r\n
bcc: email2@anotherdomain.com\r\n
bcc: email3@imgonnascrewyou.net\r\n\r\n

Howdy! This is SPAM. Have a crabby day!
{% endhighlight %}

<small><strong>Note:</strong> This can be all on one line, but needs to contain line break characters \r and \n.</small>

So, what happens is if the script isn't written correctly, those bcc headers get stuck into the email message, resulting in multiple people getting the email, besides just you. 

What I've been doing is going back through and validating all input (because that's what I've learned to do through my PHP training sessions as of late) so that this will stop. I <strong>hopefully</strong> will be catching all invalid input and will be notifying myself when it happens, so that I can immediately ban that IP address. 

So, if you are reading this and are any type of PHP developer (beginner to advanced) and don't care about security - either stop coding or start concerning yourself with security. Follow <a href="shiflett.org" title="Chris Shiflett">Chris Shiflett's</a> advice: FIEO (Filter Input Escape Output). 
