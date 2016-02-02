---
comments: true
date: '2006-09-06 17:21:10'
layout: post
slug: thunderbird-threads
status: publish
title: Thunderbird Threads
wordpress_id: '30'
categories:
- personal
tags:
- mozilla
- thunderbird
---

For those people who love their listservs, or like to talk to peeps a lot, sometimes it's just better to have threading enabled for their E-Mail client. One such email client that uses threading beautifully is Mozilla Thunderbird. Collapsable, mark all readable, etc. threads really makes my day (or at least reading email) go much smoother.

Alas, there is one problem that I've always had a problem with: enableing the threaded views. This article will quickly explain what is necessary to accomplish this. 

<!--more-->
First, we'll discuss simply enabling threaded views for one folder. Go to '<strong>View</strong>' > '<strong>Sort By</strong>' and select <strong>Threaded</strong>. If this is not available, try going to '<strong>View</strong>' > '<strong>Threads</strong>' and select <strong>All</strong>. 

Pretty simple, right? Well, now suppose you have 50 folders on one IMAP enabled server, followed by 30 on another, followed by....eh, you get the point. Well, as of current, Thunderbird doesn't support resetting your default sorting configuration? Why? *shrugs* I'm not on the development team - but you can go and update <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=86845">this bug</a> to make it a higher priority. I think, of all things, this should definitely be one to be configured through the standard chrome file. 

If they change it anytime soon, I'll post an update. 
