---
comments: true
date: '2009-12-06 22:20:31'
layout: post
slug: jira-failed-to-find-datasource
status: publish
title: JIRA Failed to Find DataSource
wordpress_id: '254'
categories:
- systems administration
tags:
- atlassian
- jira
- linux
- Systems Administration
- tomcat
---

If you were a luck systems administrator who followed the instructions for a Tomcat container installation using the EAR-WAR install when setting up Atlassian JIRA, then you may have been privileged to see the following error message in your log files:
{% highlight text %}
2009-12-06 22:56:25,762 main WARN     [core.entity.transaction.JNDIFactory] [ConnectionFactory.getConnection] 
Failed to find DataSource named java:comp/env/jdbc/JiraDS in JNDI server with name default. 
Trying normal database. javax.naming.NameNotFoundException: Name jdbc is not bound in this Context
{% endhighlight %}
If you'd like the solution on how to get rid of this error, please read on.
<!--more-->
Many EAR-WAR installs are lucky to not have this error, because they're likely installing their instance of JIRA at a URL like http://jira.example.com/. In my case(s), I always buy the suite of Atlassian products (JIRA, Confluence, Fisheye, Crowd, Bamboo) and would like to reference them through a single proxy instance (e.g. http://intranet.example.com/<product name>/). I put each instance in a separate virtual machine and use mod_jk through an Apache front-end proxy to accomplish this, this allowing me to have a single Tomcat container per application. 

My <code>jira.xml</code> file (used to) look as follows:

{% highlight xml %}
<Context path="/jira" docBase="/opt/atlassian/atlassian-jira-enterprise-4.0/dist-tomcat/tomcat-6/atlassian-jira-4.0.war" debug="0">

    <Resource name="jdbc/JiraDS" auth="Container" type="javax.sql.DataSource"
              username="jira"
              password="PASSWORD HERE"
              driverClassName="org.postgresql.Driver"
              url="jdbc:postgresql://pgsql1.example.com:5432/atlassian_jira_4.0" />

    <Resource name="UserTransaction" auth="Container" type="javax.transaction.UserTransaction"
    factory="org.objectweb.jotm.UserTransactionFactory" jotm.timeout="60"/>
    <Manager pathname=""/>

</Context>
{% endhighlight %}

The problem with this was that the referenced JDBC path is not in-fact <code>java:comp/env/jdbc/JiraDS</code>, but rather <code>java:comp/env/jira/jdbc/JiraDS</code>. This is due to how Tomcat handles contexts, and by placing our resource inside a nested context (re: <code>Context path="/jira"</code>), we have in effect changed what tomcat references that context as. So, one could choose to update the JDBC path, but I chose a different route - placing the resources in a global contexts. 

By moving the Resource definitions to <code>/var/lib/tomcat-6/conf/context.xml</code>:

{% highlight xml %}
<Context path="/" debug="0">
    <Resource name="jdbc/JiraDS" auth="Container" type="javax.sql.DataSource"
              username="jira"
              password="PASSWORD HERE"
              driverClassName="org.postgresql.Driver"
              url="jdbc:postgresql://pgsql1.example.com:5432/atlassian_jira_4.0" />

    <Resource name="UserTransaction" auth="Container" type="javax.transaction.UserTransaction"
    factory="org.objectweb.jotm.UserTransactionFactory" jotm.timeout="60"/>
    <Manager pathname=""/>
</Context>
{% endhighlight %}

Leaving my actual JIRA configuration instance at <code>/var/lib/tomcat-6/conf/Catalina/jira.example.com/jira.xml</code> to become:

{% highlight xml %}
<Context path="/jira" docBase="/opt/atlassian/atlassian-jira-enterprise-4.0/dist-tomcat/tomcat-6/atlassian-jira-4.0.war" debug="0">
</Context>
{% endhighlight %}

This didn't require me to change any of Atlassian JIRA's configuration files, and the error disappeared. 
