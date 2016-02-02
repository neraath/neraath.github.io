---
comments: true
date: '2006-09-15 23:21:21'
layout: post
slug: gateway-technical-support
status: publish
title: Gateway Technical Support
wordpress_id: '34'
categories:
- personal
---

Gateway (business) technical support has really pissed me off from the get go. Not only does their website not provide any half-way decent support documents on several different trouble cases, but it also fails via the phone for the following reasons:
<ul><li>They make accusations of things you didn't ever say you did.</li><li>They won't support something they post on their own website.</li><li>They don't even give you the time of day or try to thoroughly look into a problem you have.</li></ul>

<!--more-->
<h2>First - The Delimma</h2>
I'm installing Linux (yes, back to the Gentoo reinstallation) and the last time I was <strong>hopefully</strong> going to reinstall the operating system, upon reboot my computer is hanging at the BIOS screen (gateway logo screen). I try powering off, rebooting, doing everything but the system enters a hung state that I can't get past. It hangs so early in the stage that I can't even try booting to a CD, floppy or anything. The only solutions are:

<ul><li>Unplug the harddrive.</li><li>Boot the hard drive in another system and wipe out all partitions.</li></ul>
Well, neither of these solutions offer me much in the way of doing anything with the computer. So, after struggling with it yesterday for about 5 hours in the evening, I give up and let our hardware maintenance group deal with it. They replace the hard drive and send it back to me. Cool.

<h2>New Harddrive - Same Ol' Problem</h2>
So, thinking that this was going to fix the problem was yet another mistake on my part. The second I partition the computer and reboot, we end up back at the same damn problem. The system becomes unresponsive when trying to go through BIOS. The system never finished POST. The next solution that I think of is flashing the bios. 

This is the <a href="http://support.gateway.com/support/drivers/getFile.asp?id=20323&uid=135374235" target="new">link</a> I found for a BIOS update. I download it and follow the instructions diligently. Windows 98 boot disk - check. Download the file and copy the contents to the disk - check. Unplug the hard drive and boot from the floppy disk - check. Run iflash.exe - failure. I get the following error message:

{% highlight text %}
This system does not support flash memory.
{% endhighlight %}

Huh? Okay, there's gotta be a reasonable explanation for this. In the readme? Nope. In the support page? Nope. In the FAQ? Nope. Great - I'll just have to call tech support. 

<h2>The Dreaded Call</h2>
Lo and behold, once I do, the guy gets the information then puts me on hold for about 10-15 minutes, then comes back online to tell me that they don't support flashing the bios. I quickly check the pages to verify I don't see any information like that - which I don't - and ask both why and that if they won't that they should post that on their website and the README's.

So, keep in mind that I haven't flashed the bios yet. I can't get past this error.

The guy on the phone puts me on hold for another 5 minutes only to tell me that the reason is that I have flashed the BIOS and that since I messed up the computer it has to be sent in for Out-of-warranty repairs (which, mind you, the system still has 140+ days left on its warranty). So, I don't know where he got this hair-brained idea that I HAD flashed the BIOS, so I informed him nicely that I hadn't flashed the BIOS because of this error that THEIR program is producing for me. 

Hold again for 10 minutes. This guy obviously doesn't know jack shit and is having to ask other employees...

Verdict? Nope - still has to be sent in for out-of-warranty repairs because they can't support this error message. My solution: I'm just going to send it back to the hardware maintenance people since they have licenses with Gatway to support this.

<h2>What to think of Gateway?</h2>
F*ck 'em. Their products have been shit in the past, are shit now, and will continue to be shit. And as long as they continue providing the same bullshit service that they are right now, I'm sure they'll go down the tube much like Dell is right now. :-D
