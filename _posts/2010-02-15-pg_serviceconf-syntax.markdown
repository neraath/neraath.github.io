---
comments: true
date: '2010-02-15 12:37:04'
layout: post
slug: pg_serviceconf-syntax
status: publish
title: pg_service.conf Syntax
wordpress_id: '262'
categories:
- systems administration
tags:
- linux
- postgresql
- Systems Administration
---

I am setting up monitoring for my PostgreSQL database server, and ran across a cool way to get around specifying the username/password via the command-line every time the checks are run: pg_service.conf. Unfortunately, there is <strong>very</strong> little <a href="http://www.postgresql.org/docs/8.2/static/libpq-pgservice.html">documentation</a> on the config file. As best as I can figure out, if you are connecting to a remote host, your definitions should look as follows:

{% highlight text %}
[service.name.here]
dbname=db.name.here
user=user.name.here
host=host.name.here
password=password.here
{% endhighlight %}

On a Gentoo Linux server with PostgreSQL 8.4 installed, this file will need to be placed at <code>/etc/postgresql-8.4/pg_service.conf</code>. Then, to reference it, simply export the <code>PGSERVICE</code> environment variable with the value of the name of the service in brackets. 
