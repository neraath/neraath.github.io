---
comments: true
date: '2009-04-01 07:00:02'
layout: post
slug: fail2ban-add-server-hostname-to-e-mails
status: publish
title: fail2ban add server hostname to e-mails
wordpress_id: '174'
categories:
- systems administration
tags:
- linux
- e-mail
- fail2ban
- security
- ssh
- Systems Administration
---

I had been scouring the web this morning looking for a way to get the hostname of the server in my e-mails without hard-coding it into my <strong>action.d</strong> scripts (e.g. mail.conf, mail-whois.conf, etc.). The fail2ban wiki was not much help in this regard. In fact, somebody had posted this exact request on the community page, but it seems as though this request has not gone through. But, alas, I found a solution that's not ideal, but isn't the horrible must hard-code my hostname into every <strong>action.d</strong> script.
<!--more-->
Now, again, I mentioned this wasn't ideal. I still had to touch all of my mail-related <strong>action.d</strong> scripts. Notice the <code>&lt;host&gt;</code> entry.

{% highlight text %}
actionstart = echo -en "Hi,\n
              The jail <name> has been started successfuly.\n
              Regards,\n
              Fail2Ban"|mail -s "[Fail2Ban] <name> on <host>: started" <dest>
{% endhighlight %}

The default did not include the <code> on &lt;host&gt;</code>. So, this gave me the flexibility of defining the hostname this message was coming from. But, how do you do that? 

Sadly, it wasn't as simple as setting a global config variable of <code>host = _HOSTNAME_</code>. Instead, for every <strong>jail</strong> rule I had, I have to pass my host parameter to the <strong>action.d</strong> script. Again, this is not ideal as I'm still having to define my hostname in multiple places, but at least it's limited to one file:

{% highlight text %}
[ssh-iptables]

enabled  = true
filter   = sshd
action   = iptables[name=SSH, port=ssh, protocol=tcp]
           mail-whois[name=SSH, host=my.host.name, dest=myemail@example.com]
logpath  = /var/log/auth.log
maxretry = 5
{% endhighlight %}

lf I find a better solution, I'll post it online. That or I may just submit a patch to the lead developers for a better solution than this. 
