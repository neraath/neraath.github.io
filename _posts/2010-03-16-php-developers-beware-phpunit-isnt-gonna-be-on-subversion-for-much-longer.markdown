---
comments: true
date: '2010-03-16 19:05:50'
layout: post
slug: php-developers-beware-phpunit-isnt-gonna-be-on-subversion-for-much-longer
status: publish
title: PHP Developers Beware - PHPUnit isn't gonna be on Subversion for Much Longer
wordpress_id: '268'
categories:
- software development
tags:
- php
- phpunit
- rant
---

<a href="http://sebastian-bergmann.de" target="_blank">Sebastian Bergmann</a>, lead developer of the PHPUnit testing framework, has decided to <a href="http://sebastian-bergmann.de/archives/876-PHPUnit-Development-Moved-to-GitHub.html">switch PHPUnit from subversion to Git</a>. I wouldn't normally have a problem with this, especially if he were to follow all of the other mainstream projects that choose to keep backwards-compatibility with Subversion by keeping Subversion and Git in sync. However, he's chosen to go strictly the route of Git and not bother keeping a subversion repository in sync. 

Why do I have such a significant problem with this? I don't do <strong>anything</strong> in Git right now. Everything of mine is still in Subversion, and quite frankly, I intend to continue using Subversion for quite some time as it works well for my group and I'm too overwhelmed with learning other technologies to learn yet another source code control system. 

So, please Sebastian, at least keep subversion around and sync it with Git. All of us Subversion developers that use your repository to fetch PHPUnit from there (instead of using the PHP un-best practices way of installing through PEAR) would greatly appreciate it. 
