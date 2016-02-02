---
comments: true
date: '2008-12-23 01:09:01'
layout: post
slug: flexible-and-pragmatic-automated-php-development
status: publish
title: Flexible and Pragmatic Automated PHP Development
wordpress_id: '118'
categories:
- software development
tags:
- php
- automation
- code sniffer
- continuous integration
- PHP
- phpUnderControl
- phpunit
---

The last year or so I have dabbled in C# .Net development, which was quite a bit different from PHP development. The .Net Framework is absolutely huge, the capabilities are endless, and the tools to help me develop faster far outnumber those of PHP. Furthermore, there are many within the community that work like true pragmatic developers (<a href="http://www.jpboodhoo.com" target="_blank">J.P. Boodhoo</a> is one). These developers think about how best to organize your application and help to bring true automation to a project. Further, they work to eliminate conflict from workstation to workstation. In short, I'm talking about organization and management of code for rapid and agile development no matter who is on the team or how those team member's workstations are setup. When moving back from .Net development to PHP, though, this type of mentality hasn't quite made it. 

<!--more-->

When I mean that this mentality doesn't quite exist in the PHP community, there are several areas in which I base this case. It reaches from the lack of flexibility in the various Frameworks and tools I use to develop applications (<a href="http://framework.zend.com/" target="_blank">Zend Framework</a>, <a href="http://www.phpunit.de/" target="_blank">PHPUnit</a>, etc.) all the way
to PHP Core itself. 

<h2>PHP Core Shortcomings</h2>

I don't know whether to state this is a shortcoming of PHP core or if this is an unintended side effect of programming in a non-native language. Nevertheless, there have been several problems that I've encountered while trying to develop on PHP across a number of different platforms, particularly
on <a href="http://www.apple.com/" target="_blank">Apple</a> MacOS. 

MacOS is a great operating system, and I actually prefer it to Linux these days for daily work. However, Leopard (OSX.5, the latest version of MacOS) ships standard with PHP, and it doesn't seem to get upgraded that often. Additionally, I have yet to find a way to uninstall it or even manually
upgrade it. Thus, the only way for me to get the latest version of PHP (which typically is a couple of minor revisions behind mainstream) is <a href="http://www.mamp.info" target="_blank">MAMP</a>. 

MAMP's core concept is really cool - bundle everything into a simple drop-in and hit the ground running with everything you need for PHP/Perl apps development. It just suffers from one tiny, insignificant flaw: it wasn't developed with multi-user dev environments in mind. If one user
installs it centrally, then another user (who has administrative privileges, mind you) comes in later and tries to use it, it fails, complaining about permissions errors. 

Furthermore, when using Eclipse and configuring the environment against the centrally installed copy of MAMP, permissions errors cause convoluted and incomprehensible error messages. 

So, this probably has you questioning why I'm blaming PHP Core right now. The nature of PHP is built upon the availability to compile-in the packages of your choice, rather than installing a bloated and sluggish mess of software. This is my love/hate relationship with PHP Core. It's beautiful as on certain distros (<a href="http://www.gentoo.org/" target="_blank">Gentoo</a>, my favorite), you really do compile only the modules you want/need from scratch, and it works beautifully. However, when you're on a dev box, one can really care less about extracting maximum performance - it's important to be able to hit the ground running with development, and ensure that you can switch from workstation to workstation without having to ensure that there's some subsystem requirement you forgot to install.

PHP, and the plethora of distros and OSes that provide it, do not make this easy.

Finally, this isn't a feature of PHP Core, but something spawned as a result of some PHP developer thinking PHP is something akin to that of Perl, which it is certainly not. Nevertheless, the satan spawn today we call <strong><a href="http://pear.php.net/" target="_blank">PEAR</a></strong> is something I dread. The reason is that it helps to cause programmatic nightmare when relying on certain features or packages that may be included in the PEAR package manager. 

What, might you ask, could be distributed by PEAR? How about many of the tools I use for testing and automation (PHPUnit, PHPdocumentor, etc.). These tools can be installed and used with in a project without installing through the PEAR package manager, but when they are, all hell breaks loose when PHP is trying to resolve what package to use. Normally, a problem might not occur if the packages are the same version. However, frequently is the case where the packages are not the same and unexpected consequences can (and do) occur. 

I (and many other developers) have made this plea to the PHP Core Dev Team: Get rid of PEAR. 

<h2>Frameworks and Tools</h2>

I am pleased by the progress of the <a href="http://framework.zend.com/" target="_blank">Zend Framework</a> in terms of being flexible, modular, and an all around good framework to use for software development. The Zend Framework also practices good software development in that they unit test the heck outta their own code and have strict standards for allowing code to be committed into the repository. 

However, the one thing they are lacking in (at least a month ago, and probably still to this day) is a lack of unit testing helper classes and methods to aid in unit testing <strong>my</strong> software development. I encountered numerous problems the other day when trying to unit test my data access layer in my applications. I would typically mock my real DAO (in this case, my *Zend_Db_Table* object) to be able to test the logic I wrote. I trust that the Zend FX dev team has appropriately unit tested the *Zend_Db_Table* code, so I should only care about testing my code. 

This is where my problems came in, though. When I would attempt to mock a *Zend_Db_Table* object, the PHPUnit tests would throw odd exceptions which boiled down to the fact that the *Zend_Db_Table* object, upon instantiation, would try to connect and collect metadata from the database. This is backwards from most data access mechanisms that I've used, where connection and metadata retrieval only occurs upon use, not upon instantiation. 

Now, after Googling for an hour or so, I found that a later version of the Framework has created a package called Zend_Test, which was a testing framework useful for helping developers unit test their ZF applications. However, at the time of writing, this package was rather dismal in terms of its features and capabilities. This is one of the reasons why I partially blame the Zend Framework for its hinderance to allowing myself and my team to develop in a pragmatic fashion. 

Finally, to go back to the PEAR and other tools problems, I blame not only the PHP Core Dev team for coming up with PEAR, but I also blame any developer(s) who decide to develop a package with the intent on distributing mostly through PEAR. I say this because their contribution to the PEAR package database only furthers the need to not discontinue the package management system. Furthermore, PEAR's requirements for contribution to the package database mean that any scripts necessary to the running of the package (again, I go back to PHPUnit or phpDocumentor) require that I add to my build process additional steps that will convert all "variable" entries looking like <code>@php_bin@</code> to get the build working properly. 

I'm tired of workarounds. 

<h2>Summary</h2>

Over the next couple of months, I plan on making several contributions to this blog with serious recommendations to the entire PHP development community on how to currently do pragmatic programming in PHP given the lack of good support for doing so. Additionally, I'll make recommendations on how the PHP community can turn these things around to enable developers to be more pragmatic. 
