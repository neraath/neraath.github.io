---
comments: true
date: '2009-05-03 18:36:39'
layout: post
slug: reducing-memory-consumption-in-firefox-3
status: publish
title: Reducing Memory Consumption in Firefox 3
wordpress_id: '215'
categories:
- systems administration
tags:
- firefox
- gentoo
- memory
- Systems Administration
---

When Mozilla Firefox was still in Beta stages (e.g. pre-1.0), I fell in love with it. The browser was light-weight, standards-compliant, and much more secure than Internet Explorer. Ultimately, the thing that won me over was the fact that the browser had multiple tabs to allow me to browse multiple web sites without having to open a dozen different windows, yet still consumed very little memory. 

Flash forward to today and we find that Firefox 3 is a bloated monster, especially on anyone's computer that has more than 2GB of RAM. Why? Well, everything points to the caching that Firefox does behind the scene's to make it have accellerated performance. However, after a certain point, this performance drops not just the browser, but the entire system. The caching algorithms by default use a percentage of total memory. Thus, the more memory you have, the greater initial percentage taken up by the caching system. So, on a system with 4GB of RAM (such as mine), I easily see Firefox consuming > 1GB of RAM - even with only 12 or so tabs open and things like Flash blocked. 

I believe I have found a Firefox plugin that has managed to bring that memory bloating under control. The plugin is called <a href="https://addons.mozilla.org/en-US/firefox/addon/5972">RAMBack</a>. So far on my Linux system, Firefox has gone from consuming ~25% of memory (~1GB) to just 4-6% (roughly between 175MB and 225MB). I'm going to try this plugin out on different platforms and see how it compares, and I encourage anyone else to do the same if they want to see immediate performance. 
