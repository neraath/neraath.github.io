---
comments: true
date: '2006-08-27 23:36:49'
layout: post
slug: mysql-connection-problems
status: publish
title: MySQL Connection Problems?
wordpress_id: '27'
categories:
- systems administration
tags:
- linux
- sql
- mysql
---

If you are trying to use a program to connect to MySQL (in my case, <a href="http://www.twbsd.org/enu/bug_tracker/index.php">BugTracker</a>, and you encounter the following problem:

{% highlight text %}
Host 'localhost.localdomain' is not allowed to connect to this MySQL server.
{% endhighlight %}

This means that the program is trying to use TCP connections rather than sockets, despite using localhost as a configuration option. This is ridiculous, especially in a PHP environment, but we can easily get past it.

In the /etc/hosts file, make sure you have the following line:

/etc/hosts
{% highlight text %}
127.0.0.1    localhost
{% endhighlight %}

It CANNOT be:

{% highlight text %}
127.0.0.1    localhost.localdomain    localhost
{% endhighlight %}

This fixed my problem. 
