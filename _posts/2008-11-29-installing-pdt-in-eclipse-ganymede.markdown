---
comments: true
date: '2008-11-29 22:07:43'
layout: post
slug: installing-pdt-in-eclipse-ganymede
status: publish
title: Installing PDT in Eclipse Ganymede
wordpress_id: '124'
categories:
- software development
tags:
- php
- linux
---

For those Eclipse users who are PHP developers, getting the PDT Eclipse modules to install in a non-PDT distribution of Eclipse is <strong>extremely</strong> painstaking. This is compounded by the fact that x86_64 users don't get a PDT distrib from http://www.zend.com/pdt/. As a result, we have to fend on our own...

<!--more-->

After struggling to figure out what the hell to do to fix this, I have resolved that the <em>easiest</em> way to get this working is to simply
install Eclipse Ganymede to a location you prefer, and then copy everything from the <strong>features</strong> and the <strong>plugins</strong> folder in the PDT Linux distribution into that of the Ganymede installation. 

Should anyone decide to write a plugin that turns the Upgrade and Installation system in Eclipse into something akin to that of Debian's apt-get or dselect management interface, I will praise you as god. That or praise your coding prowsess.

For Zend, I seriously wish y'all would work on distributing an x86_64 version of Eclipse for Linux. It doesn't even have to be Ganymede, just at least x86_64. 
