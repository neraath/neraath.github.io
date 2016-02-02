---
comments: true
date: '2009-01-31 10:25:18'
layout: post
slug: mocking-zend_db-classes
status: publish
title: Mocking Zend_Db Classes
wordpress_id: '120'
categories:
- software development
tags:
- php
- code
- abstraction
- best practices
- unit testing
- zend framework
---

I have been working on another <a href="http://framework.zend.com/" target="_blank">Zend Framework</a> project at work and stumbled upon an interesting problem while trying to unit test with <a href="http://www.phpunit.de/" target="_blank">PHPUnit</a>. The Zend_Db_Table_Abstract and Zend_Db_Adapter_Interface wouldn't mock and would throw really weird and convoluted error messages. This continued to occur despite the fact that I've divided my application into several layers for maximum abstraction. Read on for how I went about fixing the problem.

<!--more-->

<h3>Why Not Exclusively the Zend Framework?</h3>

The Zend development team has done an exceptional job in developing a framework implementing the Model-View-Controller concept in order to help speed up the development time for PHP developers. However, while their framework is developed with maximum reuse and best practices in mind, developing your own applications with reuse and extensibility in mind is not clear or straight-forward when using the Framework. 

Furthermore, I'm still weary of whether or not Zend_Db's mechanism for database access is truly the way I want to go, or if I want something more Hibernate-ish. As such, I wanted to develop my application in such a way that the core of the application logic doesn't have to be modified if I do indeed want to go to something like <a href="http://www.doctrine-project.org/" target="_blank">Doctrine</a> for my Data Access mechanism. Furthermore, I wanted to develop it in such a way that if I wanted to pull away from the Zend Framework and move over to something like <a href="http://www.cakephp.org/" target="_blank">CakePHP</a>, I could. This, in essence, is good practice as it ensures loose-coupling of application logic - giving the programmer the flexibility to do what he/she needs to without making too much work. 

Furthermore, the first couple of applications I have built using the Zend Framework don't play too kindly with PHPUnit. I couldn't spool up my application logic that resided in the logical place (the Controller) without having to spool up countless other dependencies. When it was all said and done, I realized that all I want to test is application logic, and if I could get away with not having to load an excessive number of dependencies at the startup of each unit test suite, I would.

<h3>What's a Mock</h3>

So, those who have done unit testing for a long time have undoubtedly used mocks and stubs when unit testing their applications. It's almost required that they do so when they want to fully ensure the stability and integrity of their applications. Why? In my particular case, without mock objects, I would have to make sure that my database is setup, accessible and usable, prepared with the default schema and table structures, and populated with all initially necessary data before executing my unit tests. Furthermore, each time I run my unit tests, I have to make sure to empty the data that shouldn't have been left over, else my unit tests will fail unexpectedly. If any of the initial preparations are not 100% correct, then my unit tests will also fail, and oftentimes I would have to debug my application manually to find the failing point, fix it, then run again. This is not unit testing, and honestly adds unnecessary time to the development process. 

Other examples of why mocking is important include your application code needing to access hardware, but the hardware is not implemented yet. Another example is that you need to access a web service online, but the service contract only allows your production system to access it. You can program your mocks to return expected data and act like the actual piece you are needing to access, without truly accessing it. 

When unit testing,  you want to test as much of your code as possible. But to ensure that it is validly tested 100% of the time, reducing or eliminating dependencies or other logic is important. For my application, I didn't want to test the Zend_Db framework (I leave that responsibility to Zend). I just wanted to test my Data Access Logic to ensure that it is acting as I expected it to.

<h3>Mocking Problem</h3>

My Data Access logic accepts an object of type Zend_Db_Table_Abstract and proceeds to execute data requests against the object. Unfortunately, that object requires an object that implements Zend_Db_Adapter_Interface. Both of these objects have several dependencies (mostly the table has dependencies on the adapter), and surprisingly are present at construction time. I mean specifically that the table actually preloads much of the necessary logic (first through cache, then through the adapter if not available via the cache). 
