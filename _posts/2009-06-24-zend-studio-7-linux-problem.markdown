---
comments: true
date: '2009-06-24 20:32:41'
layout: post
slug: zend-studio-7-linux-problem
status: publish
title: Zend Studio 7 Linux Problem
wordpress_id: '230'
categories:
- systems administration
tags:
- gentoo
- php
- linux
- zend studio
- Systems Administration
---

I seem to be surrounded by problems these days. <a href="http://www.zend.com/">Zend</a> has announced that Zend Studio 7 is now in Beta, so I figured I'd go give it a try since I was having so many problems with Eclipse being sluggish and overall a piece of junk. Yes, I know Zend Studio 7 is based on Eclipse, but I can't help but think that the slowness is a part of the PDT plugin I use for PHP development. 

I'm running <a href="http://www.gentoo.org/">Gentoo</a> Linux AMD64 on a dual-screen monitor utilizing Xinerama. I ran into a problem when trying to start the installer for Zend Studio.
<!--more-->
{% highlight text %}
Preparing to install...
Extracting the JRE from the installer archive...
Unpacking the JRE...
Extracting the installation resources from the installer archive...
Configuring the installer for this system's environment...

Launching installer...

'SWING' UI not supported by VM.  Reverting to AWT.
Invocation of this Java Application has caused an InvocationTargetException. This application will now exit. (LAX)

Stack Trace:
java.lang.ArrayIndexOutOfBoundsException: 1
	at sun.awt.X11GraphicsEnvironment.getDefaultScreenDevice(Unknown Source)
	at java.awt.Window.init(Unknown Source)
	at java.awt.Window.<init>(Unknown Source)
	at java.awt.Frame.<init>(Unknown Source)
	at java.awt.Frame.<init>(Unknown Source)
	at com.zerog.ia.installer.LifeCycleManager.g(DashoA8113)
	at com.zerog.ia.installer.LifeCycleManager.h(DashoA8113)
	at com.zerog.ia.installer.LifeCycleManager.a(DashoA8113)
	at com.zerog.ia.installer.Main.main(DashoA8113)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
	at java.lang.reflect.Method.invoke(Unknown Source)
	at com.zerog.lax.LAX.launch(DashoA8113)
	at com.zerog.lax.LAX.main(DashoA8113)
This Application has Unexpectedly Quit: Invocation of this Java Application has caused an InvocationTargetException. This application will now exit. (LAX)
{% endhighlight %}

Some initial Googling indicated that I needed to install i386 compatible libraries. The odd thing about it was I had done so - probably several months ago in fact. However, I ultimately managed to find the temporary solution on the <a href="http://bugs.sun.com/view_bug.do?bug_id=6604044">Sun web site</a>, in that this was a Java bug relating to Xinerama. Basically, try running the installer on screen 0:0 instead of 0:1. 
