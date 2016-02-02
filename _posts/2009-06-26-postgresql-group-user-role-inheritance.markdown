---
comments: true
date: '2009-06-26 20:50:28'
layout: post
slug: postgresql-group-user-role-inheritance
status: publish
title: PostgreSQL Group & User Role Inheritance
wordpress_id: '236'
categories:
- systems administration
tags:
- postgresql
- sql
---

As I'm trying to finish up one of my consulting projects (and enhance other active projects), I decided to take a nice long hard look a PostgreSQL permissions - the correct way of doing it. PostgreSQL applies the commonly accepted principle of assigning permissions to resources. They're moving away from the concept of users and groups and more to roles. As of PostgreSQL 8.3, the primary command to create new users OR groups is <code>CREATE ROLE</code>. The existing <code>CREATE USER / CREATE GROUP</code> commands still exist, but are becoming non-existent in hopes of replacing the user / group permissions model with a strictly role-based model. 

In an attempt to move my projects towards this model, I ended up running into several problems.
<!--more-->
You assign "users" to "groups" by doing the following:
{% highlight sql %}
GRANT role_group TO role_user;
{% endhighlight %}
Where <code>role_group</code> is the name of the group role and <code>role_user</code> is the name of the user role. 

The assignment of "users" to roles plays a particular importance in permissions assignment. Typically, the webapp model has been such that it connects as one user to the database to perform <code>SELECT, INSERT, UPDATE, and DELETE</code> queries. Thus, it was easy enough to simply:

{% highlight sql %}
GRANT SELECT, INSERT, UPDATE, DELETE ON table TO user;
{% endhighlight %}

With PostgreSQL, you have to execute the above command for each table, sequence, and other object type in order to grant access to your tables. If you have 50 tables, that's not a tedious task, but it's certainly annoying. Now envision you need to grant access to your developers and/or analysts to be able to perform the same queries. Share the username and password of the webapp? This violates a lot of industry practices and will be very difficult to trace back which user accidentally (or maliciously) mucked with the data in an inappropriate fashion. 

So, you're stuck executing the same 50 queries however many times you need to grant access to the database. Now it's laborious and you start asking "What's the better way to do this?". Roles. If you executed the same 50 queries above on the "group" role, then to grant another user access to those same tables, you execute only the single query to add them to the role and BAM! They have access....or so you thought.

This is ultimately what this post was about. The PostgreSQL <code><a href="http://www.postgresql.org/docs/8.3/static/sql-grant.html">GRANT</a></code> documentation doesn't include anything indicating that there's a bit of a caveat with <code>GRANT</code>ing access to group roles. 

When you implement the solution above, you may find yourself scratching your head when your user, a member of a group that has access to the schema and table you're trying to query, receives the following error message:

{% highlight text %}
ERROR: permission denied for schema cfegroup
{% endhighlight %}

Where <code>cfegroup</code> is the name of the schema; or, you get the following error message:

{% highlight text %}
ERROR: permission denied for relation agency
{% endhighlight %}

Where <code>agency</code> is the name of the table, then you have stumbled upon the same problem I had. Eventually, I found the answer still on the PostgreSQL documentation, but not in the <code>GRANT</code> section. Rather, the problem is indeed a permissions problem because your user is not acknowledging the role permissions. According to the <code><a href="http://www.postgresql.org/docs/8.3/static/sql-createrole.html">CREATE ROLE</a></code> documentation:

{% highlight text %}
These clauses determine whether a role "inherits" the privileges of roles it is a member of. 
A role with the INHERIT attribute can automatically use whatever database privileges have 
been granted to all roles it is directly or indirectly a member of. Without INHERIT, membership 
in another role only grants the ability to SET ROLE to that other role; the privileges of the 
other role are only available after having done so. If not specified, INHERIT is the default. 
{% endhighlight %}

Thus, you simply need to make sure that your database "user" role has <code>INHERIT</code> on it. Once you have verified this is the case, the user should not have a problem accessing your objects. 
