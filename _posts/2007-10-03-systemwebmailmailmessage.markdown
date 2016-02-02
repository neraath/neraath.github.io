---
comments: true
date: '2007-10-03 08:44:09'
layout: post
slug: systemwebmailmailmessage
status: publish
title: System.Web.Mail.MailMessage
wordpress_id: '93'
categories:
- software development
tags:
- c#
- code
- windows
---

This was a problem I had while trying to send email from my local workstation through a web application. The script would execute fine, but I wouldn't receive any email. Upon further investigation (which included walking through a debugging session to find out what was going wrong), I came across an exception when trying to use:

{% highlight vbnet %}
SmtpMail.Send(email)
{% endhighlight %}

The exception that was thrown have the following error message:

{% highlight text %}
**The message could not be sent to the SMTP server. The transport error code
was 0x800ccc15. The server response was not available **
{% endhighlight %}

After a couple of minutes of realizing that I was not using localhost as my SMTP server, I figured there was either a problem with my mail relay, or something wrong with my workstation. A couple of Google hits returned that the problem was a VirusScanner issue. Sure enough, when I took a look at my Access Protection settings in McAfee VirusScan Enterprise 8.0i, one of the ports that was being blocked from sending traffic was port 25. There were 3 possibilities that I could have taken to resolve this:

<ul><li>Disable port 25 blocking</li><li>Delete the port 25 block rule</li><li>Add both <strong>aspnet_wp.exe</strong> and <strong>w3wp.exe</strong> to the exclusion list.</li></ul>

All three of these solutions worked for about 5 minutes and allowed email to be sent through my application. However, after that 5 minute period, the rules were restored. I'm not entirely certain why they were restored despite my making sure that they were saved and took immediately after closing the VirusScan Console, but I'm in the process of figuring that problem out. 
