---
comments: true
date: '2011-07-10 18:53:27'
layout: post
slug: installing-the-oauth-pecl-extension-on-mac-os-x-with-zend-server-community-edition
status: publish
title: Installing the oAuth pecl extension on Mac OS X with Zend Server Community
  Edition
wordpress_id: '299'
categories:
- software development
- systems administration
tags:
- php
---

I'm running Zend Server Community Edition on Mac OS X. I attempted to install the PECL oAuth extension by using the simple command:

{% highlight text %}
sudo pecl install oauth
{% endhighlight %}

The installation went fine, but when I attempted to find pecl in my modules list, it wasn't present. When I checked <code>/usr/local/zend/var/log/php.log</code>, I got the following error message:

{% highlight text %}
[11-Jul-2011 00:19:32] PHP Warning:  PHP Startup: Unable to load dynamic library '/usr/local/zend/lib/php_extensions/oauth.so' - dlopen(/usr/local/zend/lib/php_extensions/oauth.so, 9): no suitable image found.  Did find:
/usr/local/zend/lib/php_extensions/oauth.so: mach-o, but wrong architecture in Unknown on line 0
{% endhighlight %}

It turns out the reason for this is that Snow Leopard builds the pecl extension, it's doing so as a 64-bit binary. However, Zend Server community edition is compiled using 32-bit. I found a <a href="http://www.worldgoneweb.com/2011/zendserver-community-edition-on-mac-os-x-compiling-php-extensions/">blog post</a> which explains exactly how to compile the PECL module. The solution worked out <em>perfectly</em>.
