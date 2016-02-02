---
comments: true
date: '2006-11-02 16:56:35'
layout: post
slug: phpunit-review
status: publish
title: PHPUnit Review
wordpress_id: '45'
categories:
- software development
tags:
- php
- phpunit
---

I attended a session today on PHPUnit, the PHP framework for testing your code. I felt as though this was a significant software solution that must be talked about, considering I'd never heard of it before. 

Before I begin though, and so others are aware of the general gist of stuff that was talked about at the conference, I want to go over the main "Themes" that the conference talked about. The overall theme was "Creating Modern Web Applications with PHP". Within that, the sessions and tutorials were broken into 3 different tracks. They were: 
<ul><li>Track 1 - PHP and Web Services</li><li>PHP Development</li><li>PHP Management</li></ul>

A track that was frequented by many was the PHP and Web Services track. Web Services are nothing new, but they certainly are becoming a big thing. If not used for a greater good (ie: <a href="http://www.flickr.com/services/" target="Flickr">Flickr Services</a>, <a href="http://code.google.com/" target="google">Google Code</a>, etc.), then Web Services are something that are necessary in AJAX based programming. For AJAX based websites, small XML datafeeds are sent with requests to the server, and the server responds with a small XML datafeed - thus, we have a Web Service, only on a smaller scale.

But that's not the point of this blog post. I wanted to go into the PHP Development and PHP Management tracks. As I put on my first blog post about the "PHP Development Best Practices" tutorial, there were several important things that were mentioned in that lecture. One was documentation - something that has been fronted as long as I have been doing programming. The other, however, was properly testing your code. Now, at OSCON, this was hardly mentioned at all. Speakers either assumed you were testing or just decided not to mention it. Nevertheless, testing was a key component in the development and management aspect of the Zend/PHP Con. 

So, what is meant by testing? Do we just type some code, hit refresh, and expect it to work? No. The PHP5 coding methodology is going in the way of OOP. Thus, making a change to a page which is strictly OOP and no spaghetti code will simply make your debugger scratch it's head because it doesn't know where to begin. This is where Unit Testing is coming in. Unit Testing (though seemingly been around for a while) will test each specific function and class to verify the output came out as expected. So, this is cool, but does this mean you have to write extensive code to test your already massive bits of code? The answer is <strong>No</strong>. This is what <a href="http://www.phpunit.de" target="phpunit">PHPUnit</a> is for.

PHPUnit is, again, a framework which you build on top of to run the Unit Tests on your PHP5 code. When you tell PHPUnit to do it's thing, it will run through the tests as you have set them up and will tell you if any fail.

<h2>My opinions</h2>

This is a truly marvelous idea. Although I've been doing PHP coding for ~3 years now, I had never known something like this existed, but now with all of the new knowledge gained about PHP5 and coding styles, I'm certain to go straight to implementing this in our code. I'm very excited as I can look forward to decreased testing times and more productivity. Now if I could only convince my boss that we need to start moving the OOP way...
