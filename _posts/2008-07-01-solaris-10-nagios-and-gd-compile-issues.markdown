---
comments: true
date: '2008-07-01 17:53:16'
layout: post
slug: solaris-10-nagios-and-gd-compile-issues
status: publish
title: Solaris 10 - Nagios and GD Compile Issues
wordpress_id: '114'
categories:
- systems administration
tags:
- linux
- cgi
- gd
- nagios
- solaris
---

If you ever compile Nagios successfully on Solaris 10 (trust me, it's a beast to get working properly), beware if you get the following errors:

{% highlight text %}
[Tue Jul 01 18:15:37 2008] [error] [client 192.168.0.100] ld.so.1: histogram.cgi: fatal
: libgd.so.2: open failed: No such file or directory, referer: 
https://nagiostest.domain.tld/nagios/side.html
[Tue Jul 01 18:15:37 2008] [error] [client 192.168.0.100] Premature end of script heade
rs: histogram.cgi, referer: https://nagiostest.domain.tld/nagios/side.html
[Tue Jul 01 18:16:03 2008] [error] [client 192.168.0.100] ld.so.1: statusmap.cgi: fatal
: libgd.so.2: open failed: No such file or directory, referer: 
https://nagiostest.domain.tld/nagios/cgi-bin/status.cgi?hostgroup=all&style=grid
[Tue Jul 01 18:16:03 2008] [error] [client 192.168.0.100] Premature end of script heade
rs: statusmap.cgi, referer: https://nagiostest.domain.tld/nagios/cgi-bin/status.cgi?hostg
roup=all&style=grid
{% endhighlight %}

<!--more-->

You likely haven't compiled in support appropriately for GD and the JPEG, PNG, and other libraries. To check, issue a <strong>ldd statusmap.cgi</strong> and you may get the following output:

{% highlight text %}
[root]@nagiostest ~/nagios-3.0.3/cgi> (18:19:28 07/01/08)
:: ldd statusmap.cgi 
	libgd.so.2 =>	 (file not found)
	libiconv.so.2 =>	 (file not found)
	libpng12.so.0 =>	 (file not found)
	libjpeg.so.62 =>	 (file not found)
	libz.so =>	 /usr/lib/libz.so
	libm.so.2 =>	 /lib/libm.so.2
	librt.so.1 =>	 /lib/librt.so.1
	libc.so.1 =>	 /lib/libc.so.1
	libaio.so.1 =>	 /lib/libaio.so.1
	libmd.so.1 =>	 /lib/libmd.so.1
{% endhighlight %}

Those files not found are not good. Please note that the following solution I am using Solaris 10 x86 on a Dell server. I use <a href="http://www.blastwave.org" title="Blastwave">Blastwave</a> for GNU package management on the Solaris server, which is installed in /opt/csw. I also have installed the Blastwave distributed libgd, libpng, jpeg, etc. packages necessary for this part of the compilation process. 

<strong>Solution</strong>

Do the following:

{% highlight text %}
[root]@nagiostest ~/nagios-3.0.3> (18:24:05 07/01/08)
:: export LD_LIBRARY_PATH=/opt/csw/lib:/usr/sfw/lib:/usr/lib

[root]@nagiostest ~/nagios-3.0.3> (18:24:36 07/01/08)
:: export LDFLAGS="-R/opt/csw/lib -R/usr/sfw/lib -R/usr/lib"

[root]@nagios ~/nagios-3.0.3> (18:25:14 07/01/08)
:: ./configure --prefix=/opt/nagios --with-nagios-user=nagios --with-nagios-group=nagios --with-command-group=nagioscm --with-gd-lib=/opt/csw/lib --with-gd-inc=/opt/csw/include

[SNIP]

root]@nagiostest ~/nagios-3.0.3> (18:26:21 07/01/08)
:: cd cgi/

[root]@nagiostest ~/nagios-3.0.3/cgi> (18:26:26 07/01/08)
:: make clean
rm -f avail.cgi cmd.cgi config.cgi extinfo.cgi history.cgi notifications.cgi outages.cgi showlog.cgi status.cgi statuswml.cgi summary.cgi tac.cgi statuswrl.cgi statusmap.cgi trends.cgi histogram.cgi
rm -f *.o core gmon.out
rm -f *~ *.*~

[root]@nagiostest ~/nagios-3.0.3/cgi> (18:26:27 07/01/08)
:: make
{% endhighlight %}

We can see that our CGI has the appropriate links we were looking for:

{% highlight text %}
[root]@nagios ~/nagios-3.0.3/cgi> (18:26:51 07/01/08)
:: ldd statusmap.cgi 
	libgd.so.2 =>	 /opt/csw/lib/libgd.so.2
	libiconv.so.2 =>	 /opt/csw/lib/libiconv.so.2
	libpng12.so.0 =>	 /opt/csw/lib/libpng12.so.0
	libjpeg.so.62 =>	 /opt/csw/lib/libjpeg.so.62
	libz.so =>	 /opt/csw/lib/libz.so
	libm.so.2 =>	 /usr/lib/libm.so.2
	librt.so.1 =>	 /usr/lib/librt.so.1
	libc.so.1 =>	 /usr/lib/libc.so.1
	libXpm.so.4.11 =>	 /opt/csw/lib/libXpm.so.4.11
	libX11.so.4 =>	 /usr/lib/libX11.so.4
	libfontconfig.so.1 =>	 /opt/csw/lib/libfontconfig.so.1
	libfreetype.so.6 =>	 /opt/csw/lib/libfreetype.so.6
	libm.so.1 =>	 /usr/lib/libm.so.1
	libaio.so.1 =>	 /usr/lib/libaio.so.1
	libmd.so.1 =>	 /usr/lib/libmd.so.1
	libsocket.so.1 =>	 /usr/lib/libsocket.so.1
	libnsl.so.1 =>	 /usr/lib/libnsl.so.1
	libXext.so.0 =>	 /usr/lib/libXext.so.0
	libdl.so.1 =>	 /usr/lib/libdl.so.1
	libexpat.so.0 =>	 /opt/csw/lib/libexpat.so.0
	libz.so.1 (SUNW_1.1) =>	 (version not found)
	libmp.so.2 =>	 /usr/lib/libmp.so.2
	libscf.so.1 =>	 /usr/lib/libscf.so.1
	libdoor.so.1 =>	 /usr/lib/libdoor.so.1
	libuutil.so.1 =>	 /usr/lib/libuutil.so.1
	libgen.so.1 =>	 /usr/lib/libgen.so.1
{% endhighlight %}

Kudos go out to the <a href="http://www.nagios.org/faqs/viewfaq.php?faq_id=371" title="Nagios FAQ">Nagios FAQ</a> for having this.
