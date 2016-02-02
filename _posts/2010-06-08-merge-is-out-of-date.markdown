---
comments: true
date: '2010-06-08 22:59:09'
layout: post
slug: merge-is-out-of-date
status: publish
title: Merge is out of date?
wordpress_id: '277'
categories:
- software development
tags:
- development
- programming
- subversion
---

So, I encountered a weird problem earlier tonight while trying to merge changes from our trunk back into a branch I've been working on. The merge went successfully and I could see all the changes locally. However, when I attempted to check in the changes, I got the following error message:

{% highlight text %}
svn: File 'path/to/file' is out of date
{% endhighlight %}

This wasn't terribly unusual, with the exception of the case I <strong>just</strong> checked out the branch from the repository. When I performed an update, nothing was updated which further complicated the situation. When I used the <code>--force</code> switch, only then did one of my folders update and indicate that it was in a conflicted state. When I resolved the conflict and attempted to check back in, guess what? The same error message. 

This is when I started Googling to see if I could find someone else who had this problem, but alas found no answers. I then started trying to compare the differences between the versions, including what was available in the most recent trunk release and found something interesting. The most recent trunk <strong>didn't</strong> have any properties named <code>svn:mergeinfo</code>. This was despite multiple merges already taking place in the past. Yet, when I looked at the merge that I am attempting to perform, the following mergeinfo appeared:

{% highlight text %}
/branches/timelog-and-multi-speaker-ui:430-526
/trunk:532-533
{% endhighlight %}

I had specified only to merge versions 532-533 - nothing before then. Thus, the previous merge version was <strong>extremely</strong> unusual, and likely was what was causing the conflicts upon checkin. Sure enough, when I deleted that line in the <code>svn:mergeinfo</code> property, I was able to checkin successfully. 

So, the lesson to be learned is if you try to merge and find you're blocked because something isn't really out-of-date, check your <code>mergeinfo</code>.
