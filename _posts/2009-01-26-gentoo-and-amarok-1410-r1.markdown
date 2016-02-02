---
comments: true
date: '2009-01-26 06:23:31'
layout: post
slug: gentoo-and-amarok-1410-r1
status: publish
title: Gentoo and Amarok 1.4.10-r1
wordpress_id: '144'
categories:
- systems administration
tags:
- linux
- amarok
- build
- gentoo
- kde
- linux
- path
---

I had been in the market for a new music player, and <a href="http://www.songbird.org/" target="_blank">Songbird</a> wasn't really cutting it for me. They didn't have keyboard support built-in yet, and the application was bloated as hell (it took several hundred megs of memory - way more than a music player should). XMMS was out of the question because <a href="http://www.gentoo.org/proj/en/desktop/sound/xmms.xml" target="_blank">Gentoo removed it</a>. So, I turned to a KDE app called <a href="http://amarok.kde.org/" target="_blank">Amarok</a>. It was getting good reviews on sites I read, so I attempted to install it - and almost never made it past that point.

<!--more-->

After emerging with Gentoo and trying to run the app, i was getting the following error message:

{% highlight text %}
Amarok could not find any sound-engine plugins. Amarok is now updating the KDE configuration database. Please wait a couple of minutes, then restart Amarok.

If this does not help, it is likely that Amarok is installed under the wrong prefix, plese fix your installation using:

$ cd /path/to/amarok/source-code/
$ su -c "make uninstall"
$ ./configure --prefix=`kde-config --prefix` && su -c "make install"
$ kbuildsycoca
$ amarok

More information can be found in the README file. For further assistance join us at #amarok on irc.freenode.net. 
{% endhighlight %}

I tried the obvious solution, which was waiting and then restarting Amarok, to no avail. Additionally, I could not find the <strong>kbuildsycoca</strong> application on my path, so I figured that I should rebuild Amarok with the <strong>kde</strong> use flag enabled (I don't use KDE by default). This also, failed to help. I tried to run amarok from the command line and got the following output:

{% highlight text %}
$ amarok
Amarok: [Loader] Starting amarokapp..
Amarok: [Loader] Don't run gdb, valgrind, etc. against this binary! Use amarokapp.
kbuildsycoca running...
kio (KMimeType): WARNING: KServiceType::offers : servicetype Amarok/Plugin not found
kio (KMimeType): WARNING: KServiceType::offers : servicetype Amarok/Plugin not found
/bin/sh: kbuildsycoca: command not found
{% endhighlight %}

So I'm starting to think that maybe it had something to do with paths and the KDE environment. I managed to find <strong>kbuildsycoca</strong> under /usr/kde/3.5/bin, and upon running it, I recieved the following output:

{% highlight text %}
kbuildsycoca running...
Reusing existing ksycoca
kbuildsycoca: WARNING: '/usr/share/applications/gnucash.desktop' specifies undefined mimetype/servicetype 'application/x-gnucash'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/htmlh'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-authors'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-copying'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-credits'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-csharp'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-dtd'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-fortran'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-gettext-translation-template'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-gettext-translation'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-gtkrc'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-haskell'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-idl'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-install'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-js'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-ksh'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-ksysv-log'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-literate-haskell'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-msil'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-nemerle'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-patch'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-readme'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-scheme'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-setext'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-sql'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-texinfo'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-troff-me'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-troff-mm'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-troff-ms'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-uil'
kbuildsycoca: WARNING: '/usr/share/applications/gvim.desktop' specifies undefined mimetype/servicetype 'text/x-vb'
kbuildsycoca: WARNING: '/usr/share/applications/AdobeReader.desktop' specifies undefined mimetype/servicetype 'application/vnd.fdf'
kbuildsycoca: WARNING: '/usr/share/applications/AdobeReader.desktop' specifies undefined mimetype/servicetype 'application/vnd.adobe.pdx'
kbuildsycoca: WARNING: '/usr/share/applications/AdobeReader.desktop' specifies undefined mimetype/servicetype 'application/vnd.adobe.xdp+xml'
kbuildsycoca: WARNING: '/usr/share/applications/AdobeReader.desktop' specifies undefined mimetype/servicetype 'application/vnd.adobe.xfdf'
kbuildsycoca: WARNING: 'kcertpart.desktop' specifies undefined mimetype/servicetype 'application/binary-certificate'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/arj'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/x-bzip-compressed-tar'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/zip'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'multipart/x-zip'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/x-7z-compressed'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/x-compressed-tar'
kbuildsycoca: WARNING: '/usr/share/applications/xarchiver.desktop' specifies undefined mimetype/servicetype 'application/x-bzip2-compressed-tar'
kbuildsycoca: WARNING: '/usr/share/applications/vmware-player.desktop' specifies undefined mimetype/servicetype 'application/x-vmware-vm'
kbuildsycoca: WARNING: '/usr/share/applications/Thunar-folder-handler.desktop' specifies undefined mimetype/servicetype 'x-directory/gnome-default-handler'
kbuildsycoca: WARNING: '/usr/share/applications/Thunar-folder-handler.desktop' specifies undefined mimetype/servicetype 'x-directory/normal'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-impress.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-impress.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-powerpoint.presentation.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-impress.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.presentationml.template'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-impress.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-powerpoint.template.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.oasis.opendocument.text-web'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.oasis.opendocument.text-master'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.sun.xml.writer.global'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/x-doc'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/rtf'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.wordperfect'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-word.document.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-writer.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-word.template.macroenabled.12'
kbuildsycoca: WARNING: 'katepart.desktop' specifies undefined mimetype/servicetype 'text/x-fortran'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-calc.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-calc.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-excel.sheet.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-calc.desktop' specifies undefined mimetype/servicetype 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-calc.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-excel.template.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-calc.desktop' specifies undefined mimetype/servicetype 'application/vnd.ms-excel.sheet.binary.macroenabled.12'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-base.desktop' specifies undefined mimetype/servicetype 'application/vnd.oasis.opendocument.database'
kbuildsycoca: WARNING: 'knotify.desktop' specifies undefined mimetype/servicetype 'KNotify'
kbuildsycoca: WARNING: '/usr/share/applications/mozilla-firefox-3.0.desktop' specifies undefined mimetype/servicetype 'text/mml'
kbuildsycoca: WARNING: '/usr/share/applications/openoffice.org-math.desktop' specifies undefined mimetype/servicetype 'application/vnd.sun.xml.math'
kbuildsycoca: WARNING: '/usr/share/applications/dia.desktop' specifies undefined mimetype/servicetype 'application/x-dia-diagram'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'application/sdp'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'application/x-smil'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'application/streamingmedia'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'application/x-streamingmedia'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'application/vnd.rn-realmedia-vbr'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-aac'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/m4a'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-m4a'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/mp1'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-mp1'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/mp2'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/mp3'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-mpeg'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/mpg'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-mpg'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/rn-mpeg'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/scpls'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/wav'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-pn-windows-pcm'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-realaudio'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'audio/x-pls'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-mpeg'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-mpeg2'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/msvideo'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-ms-afs'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-ms-wmx'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-ms-wvxvideo'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-avi'
kbuildsycoca: WARNING: '/usr/share/applications/mplayer.desktop' specifies undefined mimetype/servicetype 'video/x-fli'
kbuildsycoca: WARNING: '/usr/share/applications/vmware-workstation.desktop' specifies undefined mimetype/servicetype 'application/x-vmware-vm'
kbuildsycoca: WARNING: '/usr/share/applications/vmware-workstation.desktop' specifies undefined mimetype/servicetype 'application/x-vmware-team'
{% endhighlight %}

This was really starting to frustrate me, until I finally spent enough time on Google and found this <a href="http://bugs.gentoo.org/show_bug.cgi?id=236767" target="_blank">Gentoo Bug</a>. In essence, Amarok seems to depend on some environment variables being set appropriately (namely KDEDIRS). If it's not, then Amarok won't run. The simplest solution is to logout and log back in. However, if you're impatient (like me), just simply run:

{% highlight text %}
$ source /etc/profile
$ amarok
{% endhighlight %}

and that will solve your problems!
