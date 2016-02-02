---
comments: true
date: '2006-11-04 15:45:25'
layout: post
slug: zendphp-conference-06-wrapup
status: publish
title: Zend/PHP Conference 06 Wrapup
wordpress_id: '46'
categories:
- events
- software development
tags:
- php
- zendcon
---

Okay, so now that I have a chance to blog about what I thought of the conference overall, I figured that I would do it and get it out of the way before I forget and/or run out of time during the week to do it. 

<!--more-->
<strong>Sunday</strong>: Arrived at the conference hotel. Nothing happened, other than me meeting Enygma. 
<strong>Monday</strong>: Tutorials day. 

There were about 120 or so people there for the tuts - not very many at all. I had been debating whether to go to the PHP Performance tutorial or the Best Practices of PHP Development. I opted for the latter and was quite pleased. 

<h2>Best Practices of PHP Development - An Overview</h2>
The presentation when into many different aspects of development that we currently do not implement at Cerberus or A&M (ie: Proper documentation via phpDoc methods, PHPUnit testing, adopting a coding standard - PEAR, Naming Conventions, etc.), but I now will be able to make the transition and "enforce" the use of these measures. I realize that many different developers try to convince others that they shouldn't have to follow one particular type or another, but I'm in agreement with Matthew O'Phinney and Mike Naberezny with if you use a pre-established standard, then the benefits that can be gained is that it's already written, and any new employees don't have to be trained on the standards if they've had experience with them before!

For the second tutorial, I opted for <strong>Extending PHP</strong>. I knew what I was getting myself into, considering that my first experience with an Extending PHP session didn't get me hooked like I was expecting it to - learning a subject which requires background C Programming and not having that background makes it very hard to learn. Getting more of an opportunity to see what it is that is supposed to happen (that and actually being awake for the session) led me to realize the true potential and power of writing Extensions for PHP. So, as stated in an earlier blog post, I intend to go back and learn C so that I can write some extensions. :-) And, eventually, probably contribute to the PHP development.

After a long day of learning about 2 specific branches of PHP, I rested up shortly and ran back down to the conference area to meet up with the Speakers and other ZCE's. There, as mentioned, I got to chat with Chris Shiflett, Paul Reinheimer, several guys from IBM, and many other great individuals. After a few beers (yet no buzz whatsoever), discovering that Corona is a damn good beer, and eating a few slices of some suprisingly good hotel pizza, I returned to my room to do some work and get rest for the next day. 

<strong>Tuesday</strong>: Sessions - Day 1

So, Tuesday was the first day of Sessions for the conference. The opening Keynotes were not without their mishaps (technical difficulties seemed to plague the conference), but once they were up and going, I hear of a few (interesting) new developments. The first of which was a cleverly decided partnership of Zend and Microsoft. Their intent is to finally bring PHP support on Windows platforms out of the dark ages and make it a stable language to host on IIS-based servers. We got to see one of the internal Microsoft developers whip out his Extreme Edition of Windows Vista on a Macbook Pro (wtf is the correct phrase at this point). I haven't been impressed by Vista at this point, as it really reminds me of a Windows knock-off of Mac OSX at this point, but that's out of the scope of this blog. The Microsoft guys were just doing some subliminal marketing. In addition to the Microsoft announcement, we hard other interesting things from Zend and saw some nice demos, such as Zend Studio supporting the Java-binding libraries for Code Completion, Zend Platform (interesting tool, don't know if I'd use it in production), as well as <a href="http://www.zendbox.com" target="zendbox">ZendBox</a>, a new completely monitored hosting solution with PHP5 support. One of their primary hosts is Rackspace, but we'll see how big that project takes off. Not too many people in the audience seemed enthusiastic about the announcement.

Oh, and for the Panel discussion, <em>How Do the Stacks Stack Up</em>, I didn't really pay much attention, but the basic gist from what I could gather was the different executives were in agreement that the "Stack" works so well because of a loose-coupling of open-source software that is available.

The sessions I went to were <a href="http://eliw.com/conference/zendcon-2006-high-perf.odp" target="hvpmst">High Volume PHP & MySQL Scaling Techniques</a>, <a href="http://www.redmonk.com/" target="redmonk">Do's and Don'ts With PHP in Corporate Web Applications</a>, <a href="http://ilia.ws/files/zend_security.pdf" target="security">Securing PHP Applications</a>, and <strong>Reporting with PHP and Eclipse BIRT</strong>. Overall, the sessions that were in the Development Track (High Volume PHP and Securing PHP Apps) were fairly useful. For the Do's and Don'ts with PHP in Corporate Web Apps, it was a "12 Step Program" to using PHP and not getting dead-set on using PHP for everything, even when something else would handle it better. Overall, I thought this session was (almost) a complete waste of my time. I was zoned out half-way through the presentation. The <strong>Reporting with PHP and Eclipse BIRT</strong> was interesting, and is actually something I will look into for one of the Texas A&M projects as a method of trying to implement better reports. 

After lunch, I got to listen to Chris Anderson, Editor of Wired Magazine, give a Keynote on The Long Tail of Software. Everyone at the conference got a free copy of his book, <em>The Long Tail</em>. His Keynote was rather interesting on how trends are shifting in the way things are purchased. People are finally starting to wake up and deviate from the "norm" of things and buying the "hits". They are finally becoming individualized! On my flight back home, I got about 45 pages into <em>The Long Tail</em> and am HIGHLY intrigued. "Hits are out. Everything else is in." is the theme, essentially. <em>The Long Tail</em> of purchases are going to show that everything rather than the hits that are being purchased is starting to account for a significant percentage of sales for companies that actually provide the non-hits. For anyone who's slightly intrigued by this, I suggest you <a href="http://www.amazon.com/Long-Tail-Future-Business-Selling/dp/1401302378/sr=8-1/qid=1162679660/ref=pd_bbs_sr_1/002-4532273-3600011?ie=UTF8&s=books" target="amazon">pick up a copy of his book</a>. You won't be disappointed. 

As far as the evening activity (Facebook Lounge), I was regrettably unable to attend due to a pressing issue with one of our clients needing an OS reload that evening. So, I was busy handling it for most of the evening before trailing off to bed. *shakes fist at CyberSource for causing so much grief*

<strong>Wednesday</strong>: Session Day 2

Attended sessions as follows:
<ul><li>Moving to PHP5 With Style</li><li>Efficient development using PHP, JSON, and AJAX</li><li>Caching Systems</li><li>PHP Data Objects</li><li>Querying XML - It's just data after all...</li></ul>
Everything listed above was in the PHP Developer block. I guess I got burnt out on the Management and hadn't been too interested in the web services track. Overall, everyone of these sessions were good. PHP Data Objects was an introduction to using PDO, but sufficient enough to build your own queries. The Querying XML presentation was by IBM and was more of a front for their DB2 9 database, which is free to use. You can query and get XML straight from the database, or send XML into the database in a query form and get XML back. Very intriguing. 

For the evening festivities, I went down to the Exhibitor hall and had a glass of Merlot and proceeded to meet a Software Engineering and CTO of <a href="http://www.facebook.com" target="facebook">Facebook</a>. These guys were only a few years older than me, but their presentation was exciting and the guys were full of life. I got to chat with them after their presentation on the <a href="http://developer.facebook.com" target="facebookdeveloper">Facebook Development API</a>. 

Afterwards, I was so tired from everything that I, sadly, went back to my room. After hearing about all the fun people had downstairs, I probably should have gone. But, not so disappointingly I was able to talk with my fiancee on the phone for the remainder of the evening. It was more than welcome company. Any other conferences I go to, I admit I'll probably be bringing her along as we have a hard time being apart from one another for extended periods of time (yes, >2 days constitutes an extended period of time). 

<strong>Thursday</strong>: Sessions & Conference Final Day

Found out that Chris (enygma) and his wife are expecting. I extend my congradulations to him and her. I attended the following sessions:
<ul><li>Fully Fletched Web Services with PHP by WSO2</li><li>Testing PHP Applications with PHPUnit</li><li>Create a Sophisticated Web Application in 45 minutes - Using the Zend Framework</li></ul>
All of these sessions were pretty good, though I had a hard time understanding Don Samisa in the Fully Fletched Web Services. He basically gave a brief introduction into the new SOAP extension and the <a href="http://www.wso2.net/projects/wsf/php" target="wso2">WSO2 Web Services Framework for PHP</a>. I figured that since I hadn't been to a Web Services talk yet, I should attend at least one. I was pleased by it. Additionally, the PHPUnit talk was absolutely necessary and I plan on using it for each project I'm a part of (A&M, Cerberus, and others). I think several people were kina PO'ed at Sebastian for going WAY over time during his PHPUnit talk, though, as it cut into the Zend Framework and sophisticated web application talk, which admittedly was getting to be very cool. I got the basics out of it, and plan to look into using the <a href="http://framework.zend.com">Zend Framework</a> very soon.

The closing Keynote was very interesting, as r0ml's typically are. His Keynote was dubbed <em>From Launcelot to Lovelace, and beyond</em>. He started by building up the basis for what is literacy, reading, etc. He showed statistics of how slowly reading and writing was to adapt prior to the 18th centuries and then how it accelerated during the 18th and 19th centuries. An interesting thing to point out was that for those who could read any write, they were typically "specialists" (called Scribes) who were paid a lot of money to do that work because nobody else cared to do it. Today, most people can read and write. However, how this compares to programming is rather astonishing. Less than 1% (?) of the population on earth can program, which puts us programmers at around 900 BC, and we're all scribes. r0ml left us to think about where programming will be in 2400 AD, considering the rapid evolution and mega-stages of learning to read, and left us to inquire about what it would take for us to start educating the public to be able to read and write programs. The literacy rate with respect to programming is drastically low, and r0ml is encouraging us to advance and help improve the rate. 

<strong>After the Conference</strong>

I went across the street to a Sushi place and had a Soba tempura bowl with a few pieces of sushi on the side. It was the best damn sushi I've ever had (remember: haven't been to Japan yet). Texas sushi pales in comparison to this stuff. I returned for dinner in the evening and had just sushi for dinner and was thoroughly pleased. The tuna wasn't fake, which is what I think it is here in Texas, the Eel was of a significant size and the tenderest I've ever had, and the Salmon had so much flavor I should have ordered more. 

<strong>What will I do now?</strong>

1) irc.freenode.net #phpc :-P Thanks go to CalEvans for making the #phpc shirts and advertising it to everyone. 
2) Update my damn applications with all the stuff I learned.
3) Continuing to advance my PHP knowledge, experience, and best practices.
4) Become an active contributor to the PHP community, however I may be able to.
5) Eat a pizza.
6) Write a book.
7) Drink some beer. 

I hope everyone enjoyed my recap of the conference. I know this is a lot to read, but it's the best impression of what I can give to those who weren't at the conference. Send me an <a href="mailto:chris@chrisweldon.net">email</a> if you have any other questions. 
