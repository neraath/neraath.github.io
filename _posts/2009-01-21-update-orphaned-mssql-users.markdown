---
comments: true
date: '2009-01-21 11:46:00'
layout: post
slug: update-orphaned-mssql-users
status: publish
title: Update Orphaned MSSQL Users
wordpress_id: '142'
categories:
- systems administration
tags:
- security
- sql
- stored procedures
- mssql
- windows
---

I've been moving the databases at work from one <a href="http://www.microsoft.com/sqlserver/" target="_blank">Microsoft SQL 2005</a> server to another SQL 2005 Server. When the databases grant security to non-domain users, they have a tendency to not be attached / accessible on the new server. What you have to do is reattach / rejoin the orphaned security authorization to the credential that you reestablish on the new SQL Server. This is done with the following pl_Sql command:

{% highlight sql %}
sp_change_users_login 'Auto_Fix'
sp_change_users_login 'Update_One', 'old_username', 'new_username'
{% endhighlight %}

<strong>Auto_Fix</strong> can only be used if the <strong>old_username</strong> and the <strong>new_username</strong> are the same. 
