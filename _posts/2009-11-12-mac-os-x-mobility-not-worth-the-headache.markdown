---
comments: true
date: '2009-11-12 10:51:36'
layout: post
slug: mac-os-x-mobility-not-worth-the-headache
status: publish
title: Mac OS X Mobility - Not Worth the Headache
wordpress_id: '250'
categories:
- systems administration
tags:
- apple
- mac os
- Networking
- snow leopard
- synchronization
- Systems Administration
---

I recently upgraded my student worker workstations up to Snow Leopard (Mac OS X.6) to take advantage of the better integration with Active Directory and Exchange. The primary reason: getting network home drives working correctly. We have a set schedule for them, but they may come in early or late depending on their school schedule. This introduces problems if someone is on a workstation that another typically uses. If all of their data were on a network server, there would be no cause for concern because they could use any workstation and still have access to all of their data. This blog represents my trials and failures with getting mobility synchronization to work properly. 
<!--more-->
A little bit of background on our environment: We are running an Active Directory enterprise (most of our users are Windows users) with an IBM N3600 Series Network Attached Storage (also known as a NetApp FAS3020 Filer). Our filer is attached to our AD environment with Kerberos trusts, and we share our data out to end-users via CIFS. I had all my student worker Mac OS X clients joined to Active Directory and set to use the network share specified in their AD account as their home directory. This would have been all fine and dandy, if the network / filer were faster. To illustrate how slow it was, if I went to Terminal and created a directory or file using mkdir or touch, respectively, then immediately checked the permissions on that folder or file, there would be <strong>no</strong> permissions. Instead, only on the second look at the contents did the correct permissions show up.

Several of the applications we use, such as subversion and Eclipse, expect immediate response time for permissions. Furthermore, the lack of thruput experienced over the network was apparent when we tried to do a subversion checkout of a repository on our network home. Previously, our 250M+ repository would take roughly 3 minutes to check out. With a network home drive, my student workers were complaining that it was taking in excess of 2 hours to check out. This was an unacceptable circumstance, and we needed to find a better solution so my employees could work at the pace they need to. 

I started by standing up a testing copy of Snow Leopard Server (OS X.6 Server). I then did some research into how to manage OS X desktop clients through the server, while still allowing clients to login using Active Directory credentials. This is where the <strong>Golden Triangle</strong> comes into play. OS X server allows administrators to bind the server to Active Directory (much like you can on an OS X client), and stand up a master <strong>OpenDirectory</strong> instance. In this fashion, the two directories really never talk to one another (except when you may use <strong>WorkGroup Manager</strong> to search for users and groups in AD to add to OD groups). The leverage of the <strong>Golden Triangle</strong> then becomes apparent at the client. You join the client to both the OD and the AD (in that order, or at least ensuring that that's the search order in the *Search Path*), and the OS X client can be managed by OD while allowing users to authenticate via AD. 

After joining the computers to OD and ensuring that settings were being pushed down via MCX, I started experimenting with <strong>mobility</strong>. I enabled it on my workstation group (so that I could get network syncing working), and logged in with my AD credentials. Sure enough, the settings took and the entire contents of my home directory started syncing down to the local disk. Well, almost started. Mac OS has this funny thing of having to scan the contents of both sides of the repository (local disk and network disk) in their entirety before performing the sync. While this is understandable as it's roughly equivalent to an rsync, it was very slow. In fact, it took a little over an hour to sync ~15G of data from my network share to my local disk. On a gigabit network, this is horrible thruput. 

The problems then began after the first initial sync. I had <strong>no</strong> data on local disk. Thus, everything from my network drive should have been pulled down without fail. Yet, 13 errors came about - all synchronization problems, and all within the ~/Library folder. All errors further indicated that the files were "open" and couldn't be accessed. I would think that before the user environment begins and synchronization is occurring that no files would be opened to ensure synchronization would complete successfully. This is the same understanding for the logout as well, which I was still having synchronization problems. 

When doing the analysis of all the errors received, almost all of them were preference files. While it would be nice to ensure that these are synced and maintained between sessions on different computers, they aren't critical to the operation of Mac OS. Thus, I figured that I would just suppress the errors received, against the better of my judgement. However, when I enforced the MCX policy to ignore all errors received at every stage of synchronization, I would still be prompted with the errors. I even went so far as to use <strong>System Profiler</strong> to verify that the preferences were being acknowledged by the clients, but not adhered to.

I then decided to ditch OS X Server in hopes that the mobility account creation in X.6 had been fixed. Thankfully, it had, as when I checked the box to create a mobile account for AD network users, the home sync icon appeared at the top of the window. Furthermore, manual sync appeared to work correctly. However, login and logout sync continued to fail, much to my dismay, leading me to finally decide that local disk access is the only way to go from here-on out. 

<h3>Side Problem</h3>

A side problem I encountered involved the inability to add Mac OS X clients to different computer groups in OD. In the <strong>WorkGroup Manager</strong>, when managing the members of a computer group, I would click the browse (button with ... ) to find the computers to add them to the membership list. A few of my computers were not on my same direct subnet, thus not allowing me to find them through the browser. Furthermore, despite me joining them to OD, I couldn't see them in the computer lists. This was because I had done an anonymous bind to the OD, as opposed to an authenticated bind. The only way that computers show up in the computer manifest in OD is if they are bound using an authenticated bind. 

I tried to do this in Snow Leopard, but I was never prompted for AuthN credentials, despite the server being setup to allow authenticated binding. Instead, I had to force authenticated binding to OD in order to get the prompt for credentials. Once I bound the computer to OD, I could see it in the computer manifest and add the computer to a computer group.

<h3>Summary</h3>

In short, if you are wanting to use Macs in an enterprise environment, you can still manage them well by using Mac OS X Server. Just like Microsoft has Group Policy Objects (GPOs) to manage its Windows clients, Mac OS X Server has preferences for computers and computer groups to manage its clients. However, if you want to give users the same ability such as roaming profiles or redirects with synchronization with Windows, give up while you still have a chance. While Apple seems to be heading in the direction of better support for the enterprise, they still have a <strong>long</strong> way to go. 
