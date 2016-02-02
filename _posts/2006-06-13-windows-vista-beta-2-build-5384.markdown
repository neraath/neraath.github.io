---
comments: true
date: '2006-06-13 13:04:55'
layout: post
slug: windows-vista-beta-2-build-5384
status: publish
title: Windows Vista Beta 2 Build 5384
wordpress_id: '8'
categories:
- systems administration
tags:
- windows
---

Well, I'm officially demoing Windows Vista Beta 2 and it was a serious pain to install on VMWare 5.0. For starters, when I initially finished the installation, there were not graphics drivers loaded, so it used its standard, which maxes out at 800x600 and 4-bit resolution - talk about yucky. Also, there were several other drivers missing, including ethernet, sound, and the aforementioned video drivers. 
<!--more-->
<h2>Solution</h2>
I tried installing the VMWare tools set, but had problems. I found a website online (access it <a href="http://www.theeldergeekvista.com/vista_00015b.htm" title="Elder Geek on Windows Vista">here</a>) that talked about a workaround, only to figure out the reason the tools were not installing were because I had a CD in my drive already. Aparrently, VMWare loads a CD into the drive if you try to install VMWare Tools, but if there's already a CD in your physical drive (or if you have an ISO loaded), then it doesn't start the installation. So, after I removed the CD from the drive and verified that I wasn't using an ISO, I shut down Vista, closed VMWare, then started the entire thing back up again. Once I logged in and closed all extraneous windows, I finally was able to get the drivers installed and batabing bataboom - the usual Windows interface we're so used to. 

<strong>Anti-Virus for Vista:</strong>
Now I'm currently installing antivirus. McAfee doesn't have a solution available yet, but Trend Micro has partnered with Microsoft to provide BETA Virus Scan software, though I'm not too terribly concerned about viruses since this is supposed to be a new codeset and invulnerable to many viruses on the internet today - we'll see how well that holds up. The download for the Trend Micro BETA can be found <a href="http://betadownload.trenmicro.com/pc_cillin/PCC14.55EN_VistaBeta2.exe"  title="Trent Micro Vista Beta Download">here</a>.

Graphically, Vista seems very nice. I had originally thought that it was going to mock MacOS X, but it rather seems to have new eye candy while maintaining the original Windows XP look and feel. One of the things that is kind of upsetting me is that many of the usual properties tags have been renamed to things like 'Personalize', which throws me off. The configuration panels have all changed, but getting used to the new panels for a techy like me is not that hard at all. 

After getting vista installed completely (including drivers and antivirus) I started playing around with it. I got the sidebar installed, and it seems rather cool - only not. The idea of widgets was introduced back with MacOS X and it seems that Microsoft is trying to rip off the idea - only by not creating it in the "dashboard", but rather putting it on the side of the screen permanently. It doesn't get in the way because windows automatically maximize over it.

One thing that I find interesting is the fact that by default the Paint program now saves in png. :-) The new Windows Photo Gallery seems to be a nice program to combat the iPhoto program on MacOS X. 

More to come later.
