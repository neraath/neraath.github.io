---
comments: true
date: '2007-01-19 12:56:26'
layout: post
slug: xorg-71-and-evdev-problems-solved
status: publish
title: Xorg 7.1 and evdev problems - [Solved]
wordpress_id: '60'
categories:
- systems administration
tags:
- linux
- xorg
- evdav
---

Currently I'm encountering problems with Xorg 7.1, evdev, and my Microsoft IntelliMouse Optical. The issue is that when I run 'startx', I get the following:

{% highlight text %}
(EE) evdev brain: Unable to initialize inotify, using fallback. (errno: 38)
(EE) evdev brain: Unable to initialize inotify, using fallback. (errno: 38)
(EE) evdev brain: Unable to NONBLOCK inotify, using fallback. (errno: 9)

Fatal server error:
bogus pointer event from ddx
XIO:  fatal IO error 104 (Connection reset by peer) on X server ":0.0"
         after 0 requests (0 known processed) with 0 events remaining. 
{% endhighlight %}

I have had Xorg 7.1 compiled for a long time, no recent updates. However, I changed my /etc/X11/xorg.conf file as such:

{% highlight text %}
...
Section "InputDevice"
    Identifier "Mouse0"
    Driver "evdev"
    Option "Protocol" "auto"
    Option "evBits" "+1-2"
    Option "keyBits" "~272-287"
    Option "relBits" "~0-2 ~6 ~8"
EndSection
...
{% endhighlight %}

Will update when I figure this damned problem out. 

<!--more-->
Okay, many of you are going to find this funny, many interested, and many won't really call this a solution.

First, you need to make certain that evdev is compiled into your Kernel. As per the installation instructions at the <a href="http://gentoo-wiki.com/HOWTO_Advanced_Mouse"  title="Gentoo Wiki - Advanced Mouse HowTo">Gentoo Wiki - Advanced Mouse Howto</a>, you will need to:

{% highlight text %}
root%> cd /usr/src/linux
root%> make menuconfig

# Enable the following:
Device Drivers  --->
    Input Device Support  --->
        <*> Event Interface

    USB Support  --->
        <*> USB Human Interface Device (full HID) support
        [*] HID input layer support

root%> make && make modules && make modules_install
root%> # Do everything else you do to get your new kernel up and running.
{% endhighlight %}

Reboot into your new Kernel. Then, you need to do the following to your /etc/make.conf:

{% highlight text %}
INPUT_DEVICES="mouse keyboard evdev" # add evdev
{% endhighlight %}

If evdev wasn't there before and you added it, then recompile the following:

{% highlight text %}
root%> emerge -v xorg-x11 xorg-server xf86-input-evdev
{% endhighlight %}

All of those packages (especially <b>xorg-server</b>) will be recompiled with the evdev option to *hopefully* allow it to work. If you had evdev in your INPUT_DEVICES line already, but don't have xf86-input-evdev compiled, please compile it to see if it works.

Then, my /etc/X11/xorg.conf file:

{% highlight text %}
...
Section "InputDevice"
    Identifier "Mouse0"
    Driver "evdev"
    Option "Name" "Dell Premium USB Optical Mouse"
EndSection
...
{% endhighlight %}

Notice how it changed from the beginning...

After doing all this and issuing <b>startx</b>, everything was just fine. 

<h2>So what's weird?</h2>

Well, if you didn't notice it, at the VERY beginning, I referenced having a <b>Microsoft IntelliMouse Optical</b>. In the xorg.conf, I now have a <b>Dell Premium USB Optical Mouse</b>. THAT, my dear friends, was the solution.

Even after doing everything above, I was still getting the error message <b>bogus pointer event from ddx</b> with my Microsoft mouse. Here's some information about the device:

{% highlight text %}
root%> cat /proc/bus/input/devices
...
I: Bus=0003 Vendor=045e Product=0029 Version=0108
N: Name="Microsoft Microsoft IntelliMouse? Optical"
P: Phys=usb-0000:00:1d.0-1.2.1.4/input0
S: Sysfs=/class/input/input17
H: Handlers=mouse1 event4 
B: EV=7
B: KEY=1f0000 0 0 0 0 0 0 0 0
B: REL=103
...
{% endhighlight %}

Yes, forgive the messed up name...But what is up with the <b>?</b> after the IntelliMouse? Let's try something else:

{% highlight text %}
root%> less /proc/bus/input/devices
...
I: Bus=0003 Vendor=045e Product=0029 Version=0108
N: Name="Microsoft Microsoft IntelliMouse<AE> Optical"
P: Phys=usb-0000:00:1d.0-1.2.1.4/input0
S: Sysfs=/class/input/input17
H: Handlers=mouse1 event4 
B: EV=7
B: KEY=1f0000 0 0 0 0 0 0 0 0
B: REL=103
...
{% endhighlight %}

Ahah! There's a strange character that can't be read on the command line (and more than likely not processed by the config file). To save you the trouble, it was <b>&reg;</b>. If that doesn't show up on your browsers, think (R) - the registered copyright symbol. 

Trying to put this in the configs is difficult using a terminal on the computer in question. It's possible through SSH - but the config gets mucked really quickly and the problem is still there.

When I switched to the Dell mouse, my problems were solved because the Name line doesn't contain any characters that will garble config files. 

So, as stated, slightly resolved. Leave it to Microsoft to turn out a faulty product...stick with software, Microsoft. At least you'll have one (almost) forte.

<h2>Update - 10 Minutes after Solving</h2>

Okay, I solved the issue with the Microsoft mouse. Here's how I did it and what had happened before that made me think I wouldn't get it to work.

There's another string that <b>evdev</b> can use to identify something. This was the <b>Phys</b> string - which I believe is somehow identified as the Physical address string. That's what it looks like. I modified my /etc/X11/xorg.conf to look like:

{% highlight text %}
...
Section "InputDevice"
    Identifier "Mouse0"
    Driver "evdev"
    Option "Phys" "usb-0000:00:1d.0-1.2.1.4/input0"
EndSection
...
{% endhighlight %}

Thus, no random characters that will reak havoc in my config. However, the strange error messages I was getting on startup were the following:

{% highlight text %}
(**) Mouse0-usb-0000:00:1d.0-1.2.1.4/input0: 3 valuators.
(**) evdev_btn.c (81): Registering 7 buttons.
(II) Mouse0-usb-0000:00:1d.0-1.2.1.4/input0: Init
    xkb_keycodes             { include "xfree86+aliases(qwerty)" };
    xkb_types                { include "complete" };
    xkb_compatibility        { include "complete" };
    xkb_symbols              { include "pc(pc105)+us" };
    xkb_geometry             { include "pc(pc105)" };
(EE) evdev brain: Unable to initialize inotify, using fallback. (errno: 38)
(EE) evdev brain: Unable to initialize inotify, using fallback. (errno: 38)
(EE) evdev brain: Unable to NONBLOCK inotify, using fallback. (errno: 9)
(II) evdev brain: Rescanning devices (2).
(II) Mouse0-usb-0000:00:1d.0-1.2.1.4/input0: On
AUDIT: Fri Jan 19 16:05:11 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:13 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:15 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:17 2007: 14344 X: client 1 rejected from local host
(II) Mouse0-usb-0000:00:1d.0-1.2.1.4/input0: Off
AUDIT: Fri Jan 19 16:05:19 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:21 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:23 2007: 14344 X: client 1 rejected from local host
AUDIT: Fri Jan 19 16:05:25 2007: 14344 X: client 1 rejected from local host
(II) Mouse0-usb-0000:00:1d.0-1.2.1.4/input0: Off
FreeFontPath: FPE "/usr/share/fonts/misc" refcount is 2, should be 1; fixing.
{% endhighlight %}

The <b>AUDIT</b> goes on forever if you don't do anything. These are being logged in the background while you get an X for a cursor, a black background and NOTHING MORE. It stops loading.

The cause of the problem was me being foolish enough to do the following:

{% highlight text %}
neraath%> sudo startx
# after some time and breaking out of X as root
neraath%> startx
{% endhighlight %}

What happened was root dropped some <b>.Xauthority</b> files in my directory, and when *I* tried to log in and use X, I didn't have the permissions for the file! Check it out:

{% highlight text %}
neraath%> ll | grep Xauth
-rw-------   1 root    root     0 Jan 19 16:05 .Xauthority
-rw-------   2 neraath users    0 Jan 19 16:05 .Xauthority-c
-rw-------   2 neraath users    0 Jan 19 16:05 .Xauthority-l
{% endhighlight %}

Solution? 

{% highlight text %}
neraath%> sudo rm .Xauthority*
{% endhighlight %}

Running <b>startx</b> gets you working again with the new config! :-D

<h2>Final Notes</h2>

Microsoft still creates shitty products. :-D
