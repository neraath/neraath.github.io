---
layout: post
title: "PHP preg_match Maximum Length"
date: 2013-01-06 16:09
comments: true
external-url: 
categories: 
- software development
tags:
- php
- zend
- rest
- preg_match
---
Last weekend and this weekend I spent a good deal of time trying to track down a PHP error I was having in my customer's production environment. This wasn't an exception being thrown by PHP, but rather, I couldn't readily identify if it was a PHP error or not, because different parts of our infrastructure were throwing different errors during the request. 
<!--more-->
The problem was first noticed by an early adopter of the new RESTful API we released a month ago. He kept receiving an HTTP error code 400 with the following message:

```
{
    "message": "Invalid Payload Format"
}
```

When I dug into this, I found this error was coming from the [RESTful Zend Framework component](https://github.com/codeinchaos/restful-zend-framework) I was using to develop our RESTful web service. However, when I looked at the customer's request payload, it looked fine (the ``audiodata`` parameter was about 60k in size, properly Base64 encoded):

```
{
  "callbackDestination": "chris@chrisweldon",
  "callbackMethod": "EMAIL",
  "language": 1,
  "audiodata": "gEUS9gckvq37RG4J7LYg12YdZAwVJCB053EiDJp9iNLDr6vGyOWvFDzyPwqVoS6UVO+ ... etc"
}
```

However, when I started digging in and debugging this issue, I saw that about half the web requests being sent to my php-fpm backend were malformed. The payload looked like this:

```
{
  "callbackDestination": "chris@chrisweldon",
  "callbackMethod": "EMAIL",
  "language": 1,
  "audiodata": "gEUS9gckvq37RG4J7LYg12YdZAwVJCB053EiDJp9iNLDr6vGyOWvFDzyPwqVoS6UVO+ STOPPED SHORT"
{
  "callbackDestination": "chris@chrisweldon",
  "callbackMethod": "EMAIL",
  "language": 1,
  "audiodata": "gEUS9gckvq37RG4J7LYg12YdZAwVJCB053EiDJp9iNLDr6vGyOWvFDzyPwqVoS6UVO+ EVEN SHORTER
```

This was a very strange pecularity. The body of the message was being duplicated, but the ``audiodata`` parameter was being cut short in two different places in the request. I presumed this was a problem with nginx, but I couldn't find any information to guarantee this. Furthermore, the behavior seemed rather erratic. Some requests would include the full payload, others would have this behavior from above. 

That's when I took a look at my syslog. I started to see the following errors in ``/var/log/syslog``:

```
Jan  6 16:24:53 app01 kernel: [4435039.857398] php5-fpm[19547]: segfault at 7fff7b2a8fe0 ip 000000000048f7dc sp 00007fff7b2a8fd0 error 6 in php5-fpm[400000+824000]
```

I checked the ``/var/log/php-fpm.log`` and saw a similar output there as well:

```
[06-Jan-2013 16:24:53] WARNING: [pool www] child 19547 exited on signal 11 (SIGSEGV) after 450.542383 seconds from start
```

Segmentation faults? This seemed rather extreme just for handling 60k of payload. 

I continued digging further and figured out what was going on. I managed to find that the first request passed to the application servers contained the **complete** payload, properly Base64 encoded. However, this request was what triggered the segmentation fault. Once that segmentation fault was triggered, the signal abruptly terminated and nginx re-dispatched the request to a separate application node. This application node was receiving the malformed body, not causing a segmentation fault, and was instead returning the ``Invalid Payload Format`` message. 

So, to get to the bottom of what was going on, I started throwing logging statements into my application to see where I got to. Eventually, I ended up at a validation block of code, to validate that exact parameter that was having the truncation problems (``audiodata``):

``` php
if (trim($value->audiodata) != '') {
    // Verify the data is base64 encoded.
    if (!preg_match("/^(?:[a-z0-9+\/]{4})*(?:[a-z0-9+\/]{2}==|[a-z0-9+\/]{3}=)?$/i", $value->audiodata)) {
        $this->setMessage('The audio data supplied was either not Base64 encoded or was incomplete.');
        return false;
    }
}
```

It turns out, ``preg_match`` has a *configurable* maximum upper limit on the number of characters ([source](http://stackoverflow.com/questions/6173223/preg-match-has-string-size-limit)). This really makes sense, as regular expression matching should be on small bodies of text (generally, < 10k characters is my good recommendation). Therefore, this was not a suitable solution. We would be better off attempting to base64 decode the text, and if it fails, assume it's invalid. This can easily be done with the following:

``` php
if (trim($value->audiodata) != '') {
    // Verify the data is base64 encoded.
    if (base64_decode(chunk_split($value->audiodata)) == false) {
        $this->setMessage('The audio data supplied was either not Base64 encoded or was incomplete.');
        return false;
    }
}
```

After deploying this code change, all is well. No more segmentation faults. 
