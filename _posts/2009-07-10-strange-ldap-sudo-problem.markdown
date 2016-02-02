---
comments: true
date: '2009-07-10 16:26:45'
layout: post
slug: strange-ldap-sudo-problem
status: publish
title: Strange LDAP & Sudo Problem
wordpress_id: '240'
categories:
- systems administration
tags:
- gentoo
- linux
- ldap
- sudo
- Systems Administration
---

After several updates of various systems software packages on my <a href="http://www.gentoo.org/">Gentoo Linux</a> servers, I began to notice a problem where I was being denied sudo access. The solution was amazingly simple, once I actually Googled to figure out what was going on. 
<!--more-->
To my surprise, a log entry was actually being generated which indicated what the problem was:

{% highlight text %}
Jul 10 16:39:17 confluence1 sudo: pam_unix(sudo:auth): authentication failure; logname=neraath uid=0 euid=0 tty=/dev/pts/1 ruser= rhost=  user=neraath
{% endhighlight %}

Thanks to <a href="http://www.sudo.ws/pipermail/sudo-users/2008-April/003536.html">this wonderful listserv post</a>, I finally was able to resolve the issue by adding the <code>sudoers:  ldap</code> line to my <code>/etc/nsswitch.conf</code> file. 
