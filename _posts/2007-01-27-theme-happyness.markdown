---
comments: true
date: '2007-01-27 17:23:09'
layout: post
slug: theme-happyness
status: publish
title: Theme Happyness
wordpress_id: '66'
categories:
- personal
tags:
- serendipity
---

Well, I just upgraded Serendipity to v1.1 . Additionally, I decided to pick a new theme which I'm pretty happy with. FINALLY, I figured out my problem with the code snippets causing code to spill outside the theme range...it was because of the bbcode module. 

For an others out there having this problem, open up the following file:

{% highlight text %}
serendipity_event_bbcode/serendipity_event_bbcode.php
{% endhighlight %}

and remove the one line that has &#160; in it. That replaces spaces with that code. The issue is that when code would normally wrap to multiple lines, this will force it outsdie the standard bounds of the block because it's all one nice long string. 
