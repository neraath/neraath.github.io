---
comments: true
date: '2008-03-27 10:14:02'
layout: post
slug: caching-problem
status: publish
title: Caching Problem
wordpress_id: '110'
categories:
- software development
tags:
- php
- wordpress
---

Howdy all,

I made a post below relating to PHP, and the caching engine is not deleting the cache, so the post is showing up with &lt; and &gt; characters as literals, thus showing text boxes and other things that's supposed to be straight code. Give it about 24 hours, and if it isn't fixed, I'll look into what's causing the problems. 

<strong>Update (3/28/2008)</strong>: I thought it was a problem with wpsupercache, but in fact it wasn't. It was a problem with the Wordpress plugin Google Code Prettify and/or something internal to Wordpress. I say this because my code snippets, which originally had &lt; and &gt; characters inline were rendering the HTML as literal HTML - not what I wanted. But when I figured that I'd change the snippets to use &amp;lt; and &amp;gt; instead, it _still_ got rendered as literal &lt; and &gt; characters. Weird - no? Well, check out the most previous post prior to this, and I'll (hopefully) update my archives with the syntax used in the wp-syntax plugin. 
