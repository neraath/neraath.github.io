---
comments: true
date: '2009-05-02 12:18:29'
layout: post
slug: virtual-mail-individual-mailbox-filtering
status: publish
title: Virtual Mail - Individual Mailbox Filtering:q
wordpress_id: '210'
categories:
- systems administration
tags:
- gentoo
- linux
- mail
- maildrop
- postfix
- Systems Administration
---

So, one of the things I've been working on is getting a nice Virtual Mail system setup for Cerberus' Enterprise Hosting Solution. One of the things I've come to be really annoyed with is the lack of being able to apply procmail filtering to my mailbox (getting ~100+ e-mails from systems logs every day really makes my phone's battery drain trying to download them all). After scrounging around, I managed to find a nice solution for my virtual mail hosting.
<!--more-->
My system is setup has Postfix at the center. Before Postfix accepts any messages, it communicates with SQLgrey to greylist unknown hosts. This has resulted in a good bit (approximately 95% of spam) from being received. Once a mail message is delivered, I route to amavisd-new to check for SPAM and Viruses. Then, once it comes back to the Postfix server, it's delivered to the recipient. (A graphic will come soon.)

For reading e-mails, I use courier-imap and courier-authlib. They connect to a PostgreSQL server to check the table of virtual users to see where it should look for my maildirs. 

Now, the problem is it does virtual mailbox delivery. This bypasses any .forward files that might be in my virtual mailbox dir (e.g. /home/vmail/cerberusonline.com/cweldon/.forward does nothing) and just delivers straight into the maildir. According to <a href="http://www.google.com/url?sa=t&source=web&ct=res&cd=1&url=http%3A%2F%2Ftadek.pietraszek.org%2Fblog%2F2006%2F02%2F05%2Fpostfix-virtual-mailboxes-and-procmail-filtering%2F&ei=gnX8SfOkNJLItge2zf3DCg&usg=AFQjCNHxwvAhZXZaXXzdTI51zav40-JbRQ">Tadek's Blog</a>, he read that using <strong>Maildrop</strong> looked to be the best solution as it can interface with the database to find the <strong>home</strong> and <strong>mailbox</strong> directories. 

I came to find out that <strong>Maildrop</strong> is a subset of the <strong>Courier</strong> MTA. It's actually supposed to replace procmail, and although it is written in C++ and is larger in size than procmail, it's apparently more efficient at filtering and appropriately routing mail than procmail. The biggest problem I had though was there was little to no documentation on how to get procmail to lookup the user tables in Postgres and pick up the .mailfilter file appropriately. 

It turns out, that if you already have <strong>courier-authlib</strong> setup and running on your system, there is nothing you need to do in order to get Maildrop to use it (you can specify the alternate <strong>-a</strong> flag to force Courier-AuthLib, but in my case it was unnecessary). The catch is you have to understand how you've got your lookups going. If you follow the <a href="http://www.postfix.org/MAILDROP_README.html">PostFix maildrop readme</a>, you'll notice it states that using <strong>${RECIPIENT}</strong> works in most cases. In my setup, I'm doing lookups based on just username, which meant I had to use the following statement in my PostFix <strong>master.cf</strong> file:

{% highlight text %}
maildrop  unix  -       n       n       -       -       pipe
  flags=DRhu user=vmail argv=/usr/bin/maildrop -d ${user}
{% endhighlight %}

I found this out the hard way when I ran the following two commands on the command line:

{% highlight text %}
root # maildrop -V 7 -d cweldon@cerberusonline.com
Invalid user specified.

root # maildrop -V 7 -d cweldon
maildrop: authlib: groupid=5000
maildrop: authlib: userid=5000
maildrop: authlib: logname=cweldon, home=/home/vmail/cerberusonline.com/cweldon/, mail=/home/vmail/cerberusonline.com/cweldon/.maildir/
maildrop: Changing to /home/vmail/cerberusonline.com/cweldon/
{% endhighlight %}

Maildrop did the lookup via authlib, as indicated by the second entry. Using <strong>authtest</strong>, the results are mimicked:

{% highlight text %}
root # authtest cweldon@cerberusonline.com
Authentication FAILED: Operation not permitted
root # authtest cweldon
Authentication succeeded.

     Authenticated: cweldon  (uid 5000, gid 5000)
    Home Directory: /home/vmail/cerberusonline.com/cweldon/
           Maildir: /home/vmail/cerberusonline.com/cweldon/.maildir/
             Quota: (none)
Encrypted Password: NOT SHOWING
Cleartext Password: (none)
           Options: (none)
{% endhighlight %}

So, someone is likely asking how I have my <strong>maildroprc</strong> file setup. It's rather simplistic:

{% highlight text %}
# Global maildrop filter file

#DEFAULT="$HOME/.maildir/"

# Define variables
SHELL="/bin/bash"
#DEFAULT = "$HOME/.maildir"
#MAILDIR = "$HOME/.maildir"

#
# Logfile destination
# 
logfile "${HOME}/.maildrop.log"

`test -r $HOME/.mailfilter`
if( $RETURNCODE == 0)
        {
        log "(==) Including $HOME/.mailfilter"
                exception {
                        include $HOME/.mailfilter
                }
        }
{% endhighlight %}

What this does is use the <strong>$HOME</strong> as returned by Courier-AuthLib to check if I have a <strong>.mailfilter</strong> in <strong>my</strong> virtual home directory. If I do, it includes that before dropping my mail into my maildir. 
