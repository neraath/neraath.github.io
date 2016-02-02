---
comments: true
date: '2006-09-08 19:43:21'
layout: post
slug: getting-the-last-inserted-row
status: publish
title: Getting the last inserted row
wordpress_id: '31'
categories:
- software development
tags:
- sql
- mysql
---

Okay, I feel silly for writing this post, but as many of you know, this blog is not only for other's enrichment, but for me document what I find for my own purposes and future uses. It also helps me to remember things I find cool, interesting, highly important, etc.

Well, for those of you who use databases (particularly MySQL) and don't have as vast of a background as you'd like to have (like myself), you find yourself writing ridiculous queries to obtain the previous row of data you inserted into a table.

For example:

{% highlight mysql %}
mysql> INSERT INTO users (name, email, phone) 
       VALUES
       ("Chris Weldon", "chris@chrisweldon.net", "232-353-4544");
Query OK, 1 row affected (0.01 sec)

mysql> SELECT id FROM users 
       WHERE name = "Chris Weldon" 
       AND email = "chris@chrisweldon.net" 
       AND phone = "232-353-4544";
+------------------+
| id               |
+------------------+
|            12373 |
+------------------+
1 row in set (0.03 sec)
{% endhighlight %}

Well, with what I have finally found by purusing the <a href="http://dev.mysql.com/doc/refman/5.0/en/" target="new">MySQL Reference Manual</a> - you no longer have to write that second assinine query which could potentially take a while to retreive the data, especially if the users table (or whatever table in question is being queried on) is large and could potentially have fields that are not indexed.

Here's your nice solution:

{% highlight mysql %}
mysql> INSERT INTO users (name, email, phone) 
       VALUES 
       ("Chris Weldon", "chris@chrisweldon.net", "232-353-4544");
Query OK, 1 row affected (0.01 sec)

mysql> SELECT last_insert_id();
+------------------+
| last_insert_id() |
+------------------+
|            12373 |
+------------------+
1 row in set (0.00 sec)
{% endhighlight %}

All I can say about this is "Where have you been all my life?". 
