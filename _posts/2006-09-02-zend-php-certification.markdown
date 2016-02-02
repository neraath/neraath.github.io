---
comments: true
date: '2006-09-02 08:17:27'
layout: post
slug: zend-php-certification
status: publish
title: Zend PHP Certification
wordpress_id: '28'
categories:
- software development
tags:
- php
- certification
---

Well, yesterday was the dreaded changed day for my Zend PHP certification, and I could put in no more study time for it - I had already spent several days taking training courses, then several days reviewing the materials taught there, followed by Wednesday and Thursday (practically all-day), so anymore would have done nothing but possibly confuse me and/or just be a waste. I had been over the material presented to me through the Zend PHP Certification training AND I purchased a book 2 days before the Certification, the <a href="http://www.phparch.com/shop_product.php?itemid=73" target="new">Zend PHP Certification Practice Test Book</a>, available through php | architect.

After thoroughy going over the materials from the <a href="http://www.zend.com/store/zend_php_training/zend_php_certification_training"  title="Zend PHP Certification Training">Zend PHP Certification Training Course</a>, I felt reasonably assured that there would be materials on the test that covered functions, OOP, and other things that I hadn't touched in PHP. As a result, a lot of things I had to go play with to experience on my own so I could at least know how to answer the questions...

<!--more-->
Well, I can say that I did officially pass the exam, making me a Zend Certified Engineer. :-) Funny enough, I get to take the exam again for free at the end of October as I will be attending the <a href="http://zendcon06.kbconferences.com/">Zend / PHP Conference & Expo</a> which will be giving everyone the ability to try their hands on the Zend PHP Certification - though I hope they'll actually have the PHP 5 Certification there. 

I had actually taken the PHP 4 Certification, and with the industry moving towards PHP 5, that will be the next certification that I should get, thus "proving" my capabilities with both versions (which are quite different as it is). 

Nevertheless, I probably should go into some of the details (without spilling some of the questions) as I have seen on many other blogs. I'll try to give my best opinion of what you should do to study for it - but keep in mind that everyone has their best study habits so don't take my word as the "de facto" standard of what you should do - it's only what I did to pass the exam.

<strong>PHP Experience</strong>

Before I begin talking about what I did to study for the exam, I would like to let everyone know about my personal experience with PHP and give you a feel for what would be necessary to be able to pass this exam. 

To begin, I've been playing with computers since '91, when I was roughly 6 years old. This is not as many years as compared to the old fogeys that have been around them since the 70's and 80's. Nevertheless my interest in computers soared and I was heavily involved with working on them, figuring out how they work, etc. At 16 and 17 I got my CompTIA A+ and N+ certifications, respectively, which showed my competence with Computer Maintenance and how networks work. 

At 18 I began my work as a PHP developer. I first got into programming with a C++ class at Texas A&M (taught by Bjarne Stroustroup himself, coincidentally - he's an okay teacher, compared to what everyone says about him). After that class, I was easily able to pick up PHP as many of the same concepts from C++ carried over into PHP4, with the exception of a lot of the OOP methods that were used in C++. With that, I was able to build my own blogging site, rebuild the IEEE Texas A&M chapter website, and been doing work for my company <a href="http://www.cerberusonline.com" target="new">Cerberus</a>. These projects allowed me to regain my knowledge of HTML, XHTML, and CSS standards that I had forgotten so long ago (btw, they are important to know on the exam!). They also allowed me to figure out my own style of coding and test best practices. 

After a couple of years, I transferred (or was re-hired - I can't remember how it actually went) into the Operations - Applications group of <a href="http://cis.tamu.edu" target="new">Computing & Information Services</a> to do development work on Keystone, the problem tracking system for CIS. This experience gave me the opportunity to try going through and debugging other's code. It helped that past developers were compentent in their programming and wrote "clean" code, but sometimes the methodology was totally messed up. Then, once I had thoroughly figured out the guts of the application, I was able to write code that settled nicely with the rest of the code. 

So, to sum up, I've had almost 4 years of experience in programming now, 3.5 being PHP. PHP is used in EVERY DAY activities for me, so it's always fresh in my mind. I have a tendency to resuse a lot of common PHP functions, and don't venture off the path of the main branch very often (by using the GD libraries, gzip, etc.). My recommendation is that you should probably have 2+ years of experience developing PHP in almost day-to-day activities, else you will not be able to pass this exam (unless you can cram all the different PHP functions, operator precedence, and other PHP practices and retain it long enough to pass the test - then by all means, go right ahead). But, if you've had 2 years of experience, but only pick up or modify PHP once a month, I would seriously suggest starting a side project of your own and working on it for a few hours a night (or join an existing project at sourceforge.net!) for a couple of months to really beef up your experience with PHP. 

<strong>Certification Training</strong>

Okay, being an employee of the <a href="http://cis.tamu.edu"  title="Computing and Information Services">Texas A&M University</a> has it's perks. One of which being that they pay for my training, conferences, etc. And normally, the stuff that they can / will send us to is high quality. So, I opted for the Online Zend PHP Certification as it is reasonably priced AND lets me work at my own pace if I want to. The system is setup in a webcast form, only no video - just a chat box, the instructor's voice, and a powerpoint presentation playing as the main window. So, at least during the live webcast you can ask others questions including the instructor. The webcasts are recorded and put on a webpage (which I cannot give out here) so I can review them whenever I want to - though I think after 6 months they take it down.

<a href="www.preinheimer.com" target="new">Paul Reinheimer</a> was our instructor, and he did a damn awesome job. He is quite knowledgable in PHP and just published his first book. I haven't had a chance to take a peek at his book yet. 

Many of you might inquire as to why you would want to take this training, and my answer is rather simple: The PHP Certification Training course allows you to get a thorough understanding of the different topics and areas that the certification does cover. I believe this is the official list on what they test you on:

<ul><li>Arrays</li><li>Dates & Times</li><li>Database Programming w/ PHP </li><li>Debugging and Performance</li><li>E-Mail</li><li>File Management & Manipulation</li><li>OOP</li><li>Regular Expressions in PHP</li><li>Security</li><li>Stream and Network Programming</li><li>Strings & Operators</li></ul>

A more official list can be obtained <a href="http://www.zend.com/education/zend_php_certification/exam_objectives" title="Exam Objectives" target="new">here</a>. The Zend PHP Certification Training did cover every aspect of that, albeit not to the fullest extent that I would have liked. There is another training material that I would recommend others get (keep on reading) that will start covering more of the thorough aspects than this (or maybe it was just that it was from a different approach). 

Nevertheless, not only did the training help me get ready for the certification exam, I also learned several very important aspects of PHP and methods of programming within PHP. In particular, safety issues were at the front of one of the last training course, and I had never really paid much attention to security, until after I found out that one of my scripts was being exploited by spammers. Now, I really advocate secure code in any application I develop and recommend that any PHP developer to make sure to thoroughly test their code and above all, filter user input! 

<strong>Training Material 2 - Books</strong>

There was only one book that I obtained for this, and it was the <a href="http://www.phparch.com/shop_product.php?itemid=73" target="new">Zend PHP Certification Practice Test Book</a>. This book was a wonderful suppliment to the Zend PHP Certification training as it took a totally different approach to preparing you for the exam. It uses the test first, correct later method. Each chapter has an introductory couple of paragraphs that talks about the upcoming section and then it throws you right into questions as they would be worded on the exam. It was really quite intriguing, and tough! The book made me think that I was in no way going to pass the exam, because after the PHP Cert Training, I missed roughly 1/4 of the questions posed in the book the first time around! 

But, studying the book really gave me a great understanding of the format of the questions on the exam - and come to find out that the formats were essentially mirrored on the exam. Some of the questions from various chapters did appear on the exam (though not exactly the same). The reason this happens is that the authors of the book sit on the Zend Education Advisory Board who oversees the PHP Certification Exam. Thus, they would be the best ones to be writing a book to get people ready for the exam. 

All in all, I give many kudos to the authors of the book, and highly recommend it to anyone - especially as a last couple of days cram study guide. Don't worry about getting overnight shipping on the book - once you purchase a physical copy, php | architect gives you access to the book immediately in PDF form so you can go right into studying.

<strong>Weight of Questions</strong>

So, one question people might wonder is what the actual weight or percentage of questions from each respective part appeared on the exam. There are 70 questions on the exam. The majority of questions were single choice multiple choice, but the second most common was multi-choice multiple choice (ie: select 2-4 of the following that match this case). There were also a couple of fill-in-the-blank questions. All in all, here's how I would categorize the weights of the sections of questions:

<ul><li>Arrays - 15%</li><li>Dates & Times - 6%</li><li>Database Programming w/ PHP - 6%</li><li>Debugging and Performance - 8%</li><li>E-Mail - 12%</li><li>File Management & Manipulation - 13%</li><li>OOP - 6%</li><li>Regular Expressions in PHP - 5%</li><li>Security - 10%</li><li>Stream and Network Programming - 8%</li><li>Strings & Operators - 12%</li></ul>

Sorry for not having a "graph" so to speak. Now, this is respective of my exam, as these testing centers usually change up the percentage of questions randomly for everyone. But, this percentage setup is supposed to give you an idea that the questions are spread out all over the place. They're also only kinda lumped together - ie: Most of the time I would answer a few questions that would stem from a particular topic, then move on to the next topic, but occasionally they would through another question from two or three topics back. 

The easiest questions probably had to deal with arrays as it was mainly trying to get you read through code samples and figure out the final result or output. Some of them were, admittedly, pretty obscure and I don't think they would ever show up in a real world situation - but you never know with programmers. Other questions about arrays did show up such as different function calls how to manipulate arrays.

The weirdest questions for me had to deal with options that are passed to functions (options or modifiers that change the default behavior of a function). The reason for this is I hardly deal with those, so that would be the reason they tripped me up a lot. A lot of other tricky items for me included other functions I had never used before (much less even heard about) and weird ways to get errors to be thrown (especially when all of the answers seem valid and won't throw errors).  

<strong>Have fun!</strong>

Well, I feel that I've ranted long enough about the PHP certification. With that, I shall depart and wish any of you who want to take the certification exam the best of luck, and don't hesitate to ask me questions (though not asking for questions on the test - as I can't do that legally). 
