---
comments: true
date: '2007-08-13 10:43:45'
layout: post
slug: examine-public-ssl-certificate-keys
status: publish
title: Examine Public SSL Certificate / Keys
wordpress_id: '91'
categories:
- systems administration
tags:
- linux
- ssl
- ldap
---

So, in trying to figure out the LDAP issues that I had earlier, I needed to check the public key that was returned by the LDAP server when using SSL / TLS. The problem was that I had the damndest time trying to figure out the command necessary to open up and examine SSL certificates on non-standard ports (ie: anything but HTTPS, IMAPS, POP3 over SSL, etc.). Finally, I found on the <a href="http://confluence.atlassian.com/display/JIRA/Connecting+to+SSL+services">Atlassian Confluence</a> website the exact command I needed:

{% highlight bash %}
openssl s_client -connect host.example.com:ldaps
{% endhighlight %}

This displayed everything I needed to know, including the PEM formatted public key / certificate as well as the Certificate Chain (ie: who was the Certificate Authority for the certificate).
