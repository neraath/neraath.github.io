---
comments: true
date: '2006-09-14 19:10:36'
layout: post
slug: gentoo-gensplash-woes
status: publish
title: Gentoo Gensplash Woes
wordpress_id: '33'
categories:
- systems administration
tags:
- gentoo
- gensplash
- linux
---

Okay, time to try this again and not sound pissed off, cause I just spend the past 10 minutes typing this thing up and managed to hit "Ctrl+R" - destroying my work....

Okay, so last week I had gotten fed up with Debian's lack of speed with regards to packages and lack of good support and stability with the testing distribution, so I decided that it had to go on my desktop. The decision was upon me to try to figure out which distribution I was going to go to next. FreeBSD was out of the question, and I really did not like the choice of Suse, RedHat, etc. So, I was stuck between the choice of Gentoo or Ubuntu. Eventually, my heart went back to Gentoo as I've had nothing but sheer happiness with that distro.

But alas, my reinstallation turned me from a happy gentle human to a truly crazy and perplexed human. Why? Because of one stupid little thing I probably should not have been working on, but did so because I have a tendency to track these things down until they are FIXED. The problem, was with gensplash.

For those who don't know, Gensplash is Gentoo's program that will create a graphical bootup splash screen much like Ubuntu, MacOS, and alas, Windows. This splash screen looks much prettier than the traditional text dump of the kernel loading to the screen.

Nevertheless, if you would like to read-on to see what I had to do in order to fix it, and the other complications that I came across along the way, please read on!

<!--more-->
So, I started this journey by following Gentoo's <a href="http://gentoo-wiki.com/HOWTO_fbsplash" target="new">fbsplash HOWTO</a> that was found on the <a href="http://gentoo-wiki.com" target="new">Gentoo Wiki</a>. The instructions are fairly straight-forward, but I will be inclined to update them in a few days to correct the issues that I encountered as a result of old instructions and to post other troubleshooting tips.

<h3>First Problem: Getting framebuffer support working</h3>
Framebuffer support was not working when I first built the kernel. I was getting some random error message on boot that resembled "You have selected an invalid resolution.". I verified with the <strong>vbetest</strong> program (obtained by emerging <strong>lmri</strong>) that I could use resolutions up to 1400x1050. I decided to stick with a 1280x1024 resolution, as it was the best step that I was comfortable with. After playing with this for about an hour, I found the solution. 

<strong>Solution:</strong> Don't compile nVidia framebuffer support at the same time as vesafb-tng support. Just rely on vesafb-tng support!

<h3>2nd Problem: Kernel Panics</h3>
Once I made it past that problem, and figuring it would be all downhill from there, I only found myself coming over the ridge and seeing a vertical cliff right in front of me. I started getting the most random kernel panics no matter what approach I was taking. The most frustrating part about it was the fact that the Kernel was okay, and it was the initramfs images that I was using, though I didn't know what specifically was messed up about them.

But, that knowledge aside, let's look at what the error messages were, etc. 

<h3>Manually-built Kernel</h3>
I manually built my Kernel, selecting my own options in <strong>make menuconfig</strong> and then running:

{% highlight text %}
root# cd /usr/src/linux
root# make
root# make modules_install
root# cp arch/i386/boot/bzImage /boot/kernel-2.6.17-gentoo-r7
root# cp System.map /boot/System.map-2.6.17-gentoo-r7
root# cp .config /boot/config-2.6.17-gentoo-r7
{% endhighlight %}

Following the build and install and reboot to verify the Kernel worked, I then executed the following code:

{% highlight text %}
root# cd /etc/splash
root# splash_geninitramfs livecd-2006.1 -g /boot/fbsplash-livecd-2006.1-1280x1024 -r 1280x1024 -v
{% endhighlight %}

This produced what I thought was to be a perfectly valid initramfs image. Rather, when I rebooted, I get the following message on bootup:

{% highlight text %}
VFS: Cannot open root device "hda3" or unknown-block(0,0)
Please append a correct "root=" boot option
Kernel panic - not syncing: VFS: Unable to mount root fs on unknown block(0,0)
{% endhighlight %}

*scratches head for a while* - Well, maybe it's a grub.conf error? Let's take a look at my grub.conf file:

/boot/grub/grub.conf:
{% highlight text %}
title=Gentoo Linux 2.6.15-gentoo-r1 - Manual
root (hd0,0)
kernel /kernel-2.6.15-gentoo-r1 root=/dev/hda3 video=vesafb:1280x1024-32@60,mtrr:3 splash=silent,theme:livecd-2006.1 console=tty1
initrd /fbsplash-livecd-2006.1-1280x1024

title=Gentoo Linux 2.6.17-gentoo-r7 - Manual
root (hd0,0)
kernel (hd0,0)/kernel-2.6.17-gentoo-r7 root=/dev/hda3 video=vesafb:1280x1024-32@60,mtrr:3 splash=silent,theme:livecd-2006.1 quiet CONSOLE=/dev/tty1
initrd /fbsplash-livecd-2006.1-1280x1024

title=Gentoo Linux 2.6.17-gentoo-r7 - Genkernel
root (hd0,0)
kernel (hd0,0)/kernel-genkernel-x86-2.6.17-gentoo-r7 udev root=/dev/ram0 init=/linuxrc real_root=/dev/hda3 video=vesafb:1280x1024-32@60,mtrr:3 splash=verbose,theme:livecd-2006.1 console=tty1
initrd (hd0,0)/initramfs-genkernel-x86-2.6.17-gentoo-r7 
{% endhighlight %}

Nope, everything in there is okay. I've already got it setup for Genkernel just in case I needed to build a Genkernel image. So, after playing with that for about an hour and a half, I decided to use <strong>genkernel</strong> to see if that would fix the problem. I executed the following command:

{% highlight text %}
root# genkernel --menuconfig --mrproper --gensplash=livecd-2006.1 all
{% endhighlight %}

I selected all the Kernel options again, and the installation went without a hitch. I rebooted, only to get a different error message:

{% highlight text %}
>> Loading modules
>> Activating devfs
mount: Mounting devfs on /dev failed: No such device
/init: /init: 216: devfsd: not found
>> Determining root device...
!! Block device /dev/hda3 is not a valid root device...
!! The root block device is unspecified or not detected.
   Please specify a device to boot, or "shell" for a shell...
{% endhighlight %}

<strong>WTF?!?! devfs!?!?</strong> Yep, you see it right. devfs is trying to be loaded by Gensplash. It's no wonder why it won't work - devfs support in the kernel I'm using is GONE. That's right, it's history. So, why on earth is it trying to load devfs? That beats the hell outta me. I get so tired and frustrated with it that I open a problem in the <a href="http://forums.gentoo.org/viewtopic-t-496845-start-0-postdays-0-postorder-asc-highlight-.html" target="new">Gentoo Forums</a> and call it a day. 

<h3>Thursday - Back at it Again</h3>
Today I decided to come back to it to see if I could resolve the problem. I think at this point my original intuition was pointing me to the fact that this was a <strong>splashutils</strong> error. But, just to make certain that it wasn't, I decided to try to use some of the other provided themes to see if I could get either of them to work.

{% highlight text %}
root# splash_geninitramfs emergence -g /boot/fbsplash-emergence-1280x1024 -r 1280x1024 -v
root# reboot
{% endhighlight %}

<strong>Alas! It works!</strong> The gensplash image came up and booted the progress bar and everything worked as it was supposed to. Conclusion: <strong>splash-themes-livecd</strong> is BAD! Or is it?

Upon further study, I notice that in /etc/splash/emergence/images, JPEG images are in the directory along with PNG images. In /etc/splash/livecd-2006.1/images, there were only PNG images. The same could be said for /etc/splash/livecd-2006.0/images - no JPEG images whatsoever. The one thing that pointed me in the direction of checking for JPEG images was the fact that when I tried to use the splash_manager to change the desktop splash screen, I got the following output:

{% highlight text %}
root# splash_manager --theme=livecd-2006.1 --cmd=set --tty=1
Not a JPEG File: starts with 0x89 0x50
{% endhighlight %}

Okay, trying a demo also produces:

{% highlight text %}
root# splash_manager -c demo -t livecd-2006.1 -m s --steps=100
Not a JPEG file: starts with 0x89 0x50 
{% endhighlight %}

So, missing JPEG files are the root cause of this? I begin to think that it can't be the only reason behind it and that I should try something else to verify that it isn't a problem with <strong>splashutils</strong>. Where's the first logical place to start? <em>/usr/portage/profiles/use.desc</em> of course! I need to check for PNG support and see if there is a flag for it. Lo and behold, there is. So, I added 'png' to the list of USE flags that I have and:

{% highlight text %}
root# emerge splashutils
root# splash_geninitramfs livecd-2006.1 -g /boot/fbsplash-livecd-2006.1-1280x1024 -r 1280x1024 -v
root# reboot
{% endhighlight %}

<h3>Success is Mine</h3>
I cannot believe that such a simple thing as a PNG use flag broke that entire thing. Nevertheless, now you know how to go about fixing the problem if you ever encounter this. 

Cheers.
