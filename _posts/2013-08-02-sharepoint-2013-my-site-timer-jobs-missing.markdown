---
layout: post
title: "SharePoint 2013 My Site Timer Jobs Missing"
date: 2013-08-02 15:07
description: "This post discusses how to re-create the timer jobs used for My Site creation in SharePoint 2013."
keywords: "sharepoint,2013,powershell,mysites,social,timer jobs"
comments: true
external-url: 
categories: 
- systems administration
- software development
tags:
- SharePoint
- 2013
- powershell
- mysites
- social
- timer job
---
The way My Sites are created in SharePoint 2013 is vastly different from SharePoint 2010, but for good reason. I won't go into the details of how it's changed, as Wictor Wilen has done an *excellent* job of this already in his blog post [SharePoint 2013: Personal Site Instantiation Queues and Bad Throughput](http://www.wictorwilen.se/sharepoint-2013-personal-site-instantiation-queues-and-bad-throughput). I encountered problems with a new development workstation not setting up My Sites for users appropriately - blocking us from testing our solution, which was dependent upon a user having a My Site. In looking online (and in Wictor's blog post), everything was pointing to checking the following three timer jobs:

 * My Site Instantiation Interactive Request Queue
 * My Site Instantiation Non-Interactive Request Queue
 * My Site Second Instantiation Interactive Request Queue

The problem is, those timer jobs were missing from my server!
<!--more-->
I checked for the timer jobs first through Central Administration, and then subsequently thru PowerShell. The following are the results I found:

```
Get-SPTimerJob | sort Name | ft Name
```

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/01-missing-timerjobs.png" alt="Timer Jobs Missing" />

I decided to check for the My Site timer jobs on a know working SharePoint 2013 farm. Sure enough, they were there:

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/02-present-timerjobs.png" alt="Timer Jobs Present on Farm" />

I wanted to look for a way to re-register timer jobs. There should be no reason for me to do something drastic like uninstall/reinstall the User Profile Service just to get the timer job re-registered. This timer job, as expected, was in the ``Microsoft.Office.Server.UserProfiles`` assembly:

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/03-timerjob-definition.png" alt="Timer Jobs Definition" />

So, I cracked open dotPeek and decided to hunt for that timer job definition and find who was using it. It turns out, there's a web application-level feature (``MySiteInstantiationQueuesFeatureReceiver``) which registers these timer jobs:

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/04-featurereceiver.png" alt="Timer Job Feature" />

There is a public static method inside that feature receiver used for registering the timer jobs. 

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/05-methodtoregistertimerjobs.png" alt="Method to Register Timer Jobs" />

So, I had one of two options: invoke the static method directly, or simply toggle the feature. I opted to toggle the feature:

```
$feat = Get-SPFeature 65B53AAF-4754-46D7-BB5B-7ED4CF5564E1
Disable-SPFeature $feat -Url http://webapp
Enable-SPFeature $feat -Url http://webapp
```

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/06-toggle-feature.png" alt="Toggle Feature" />

Finally, I double checked and verified the timer jobs were now present!

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/07-timerjobspresent.png" alt="Timer Jobs Present" />

I then went to the My Site host URL and got into the queue for provisioning. Within 5 minutes, my personal my site was provisioned!

<img style="float:center" src="/images/posts/2013-08-02-sharepoint-2013-my-site-timer-jobs-missing/08-mysite-provisioned.png" alt="My Site Provisioned" />
