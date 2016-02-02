---
comments: true
date: '2008-05-29 14:23:48'
layout: post
slug: solaris-10-and-nfs
status: publish
title: Solaris 10 and NFS
wordpress_id: '113'
categories:
- systems administration
tags:
- linux
- nfs
- solaris
---

I've been getting our Solaris environment setup in the College of Architecture, and one of the things I quickly realized with zones is that I'm going to need to setup LDAP to have any sort of efficient way of managing user accounts. Once this was setup, I quickly realized the need for NFS to be setup and thought that it'd be fairly straight-forward to setup (like it is on Linux). This turned out to not be the case.
<!--more-->

I followed the instructions on several different sites, including sites talking about <a href="http://www.brandonhutchinson.com/Solaris_JumpStart_notes.html">setting up Solaris Jumpstart servers</a>. One of the first things I realized was that I needed to get a copy of the Solaris 10 software so I can install packages. We were <em>lucky</em> enough to have friends over in the Department of Computer Science use their jumpstart servers to setup our servers, so I didn't quite have media available.

I went on Sun's web site, downloaded the DVD and burned it to disk. Then I found out that some of the automounting functions on our Solaris boxes were not installed, thus forcing me to go through the rigarmarole of trying to mount a DVD to be able to access it. In short, the command is:

{% highlight text %}
mount -F hsfs /dev/dsk/c0t0d0s2 /mountpoint
{% endhighlight %}

Note that <code>-F hsfs</code> is required for it to mount right. The actual disk (in my case, <code>/dev/dsk/c0t0d0s2</code>) will differ from server to server, but you can find where your DVD drive is located by using:

{% highlight text %}
:: iostat -En
c1t0d0           Soft Errors: 2 Hard Errors: 0 Transport Errors: 0 
Vendor: MegaRaid Product: PERC 3/DC Revision: 199A Serial No:  Size: 36.36GB <36364615168 bytes>
Media Error: 0 Device Not Ready: 0 No Device: 0 Recoverable: 0 
Illegal Request: 2 Predictive Failure Analysis: 0 
c1t1d0           Soft Errors: 2 Hard Errors: 0 Transport Errors: 0 
Vendor: MegaRaid Product: PERC 3/DC Revision: 199A Serial No:  Size: 293.39GB <293391564288 bytes>
Media Error: 0 Device Not Ready: 0 No Device: 0 Recoverable: 0 
Illegal Request: 2 Predictive Failure Analysis: 0 
c0t0d0           Soft Errors: 6 Hard Errors: 0 Transport Errors: 0 
Vendor: HL-DT-ST Product: DVD-ROM GDR8081N Revision: 0208 Serial No:  
Size: 2.26GB <2259353600 bytes>
Media Error: 0 Device Not Ready: 0 No Device: 0 Recoverable: 0 
Illegal Request: 6 Predictive Failure Analysis: 0 
{% endhighlight %}

You can see my DVD drive based on the output above.

Anywho, once it was mounted up, I followed the instructions to install the following packages:

{% highlight text %}
SUNWnfssu     Network File System (NFS) server support (Usr)
SUNWnfssr     Network File System (NFS) server support (Root)
SUNWnfsskr    Network File System (NFS) server kernel support (Root)
{% endhighlight %}

But, when this was installed and I setup my dfstab correctly, when I did shareall, I still got the following error message:

{% highlight text %}
:: shareall
share_nfs: /home: Unknown error
{% endhighlight %}

I scratched my head, and Google yielded no valuable answers for me because it is obviously a vague error message. Only when I actually when to the server console (or checked /var/adm/messages) did I find out what was going wrong:

{% highlight text %}
May 29 12:05:00 sql3 genunix: [ID 819705 kern.notice] /kernel/misc/nfssrv: undefined symbol
May 29 12:05:00 sql3 genunix: [ID 826211 kern.notice]  'nfs_getflabel'
May 29 12:05:00 sql3 genunix: [ID 819705 kern.notice] /kernel/misc/nfssrv: undefined symbol
May 29 12:05:00 sql3 genunix: [ID 826211 kern.notice]  'do_rfs_label_check'
May 29 12:05:00 sql3 genunix: [ID 472681 kern.notice] WARNING: mod_load: cannot load module 'nfssrv'
{% endhighlight %}

Googling these error messages yielded no answer, solution, or even indicated that someone out there may have the same problem as me. When I consulted with the guys in Computer Science, they indicated that they were using Solaris 10 revision 4, not revision 5. Given the date that I downloaded the software (approximately May 27th), I quickly realized that I have revision 5. They sent me over the software for revision 4, I uninstalled the packages above and installed the older packages, and everything worked just peachy. :-)
