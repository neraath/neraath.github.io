---
comments: true
date: '2007-05-07 16:01:20'
layout: post
slug: mac-xserve-perl-dbdmysql-4001
status: publish
title: Mac Xserve Perl DBD::MySQL 4.001
wordpress_id: '83'
categories:
- systems administration
tags:
- mac os
- linux
- perl
- sql
---

Well now, here's an interesting problem I had with Perl on the new Mac Xserve running Intel Xeon 64-bit processors. One of our customer's had a CGI website (cringes) and was using DBD::MySQL to access the MySQL database. Upon initial observations, permissions had been setup incorrectly and the httpd.conf file was not setup properly for CGI executables. 

Past this, I find that the server has dependency problems. This was found due to the following error message in the /var/log/httpd/error_log file. The particular error was:

{% highlight text %}
[Mon May  7 15:43:45 2007] [error] [client xx.xx.xx.xx] Premature end of script headers: /Library/WebServer/CGI-Executables/webevent.cgi
install_driver(mysql) failed: Can't locate DBD/mysql.pm in @INC (@INC contains: /Library/WebServer/webevent/lib /System/Library/Perl/5.8.6/darwin-t
hread-multi-2level /System/Library/Perl/5.8.6 /Library/Perl/5.8.6/darwin-thread-multi-2level /Library/Perl/5.8.6 /Library/Perl /Network/Library/Per
l/5.8.6/darwin-thread-multi-2level /Network/Library/Perl/5.8.6 /Network/Library/Perl /System/Library/Perl/Extras/5.8.6/darwin-thread-multi-2level /
System/Library/Perl/Extras/5.8.6 /Library/Perl/5.8.1 .) at (eval 8) line 3.
Perhaps the DBD::mysql perl module hasn't been fully installed,
or perhaps the capitalisation of 'mysql' isn't right.
Available drivers: DBM, ExampleP, File, Gofer, Proxy, Sponge.
 at /Library/WebServer/webevent/lib/db/dbconnect.pm line 58
{% endhighlight %}

So, I proceed to install Perl modules. But wait, CPAN's bitching about an upgrade to CPAN being available. Fine, let's give it what it wants:

{% highlight text %}
CPAN> install Bundle::CPAN

-- CPAN INSTALLS UPDATE --
{% endhighlight %}

Cool, now time to move to installing DBI:

{% highlight text %}
CPAN> install DBI

-- INSTALL SUCCESSFUL --
{% endhighlight %}

Now for the last bit, DBD::mysql:

{% highlight text %}
CPAN> install DBD::MySQL

<snip>
t/utf8...............install_driver(mysql) failed: Can't find 'boot_DBD__mysql' symbol in /Library/Perl/DBD-mysql-4.001/blib/arch/auto/DBD/mysql/mysql.bundle
at (eval 3) line 3
Compilation failed in require at (eval 3) line 3.

2 tests skipped.
Failed 25/28 test scripts. 413/418 subtests failed.
Files=28, Tests=418,  2 wallclock secs ( 1.54 cusr +  0.35 csys =  1.89 CPU)
Failed 25/28 test programs. 413/418 subtests failed.
make: *** [test_dynamic] Error 255
</snip>
{% endhighlight %}

Damn, talk about something unexpected. After reading a few emails, forums, and getting down right frustrated with everything, I find <a href="http://forums.macosxhints.com/archive/index.php/t-69261.html">this</a> email note. This isn't completely correct, in that it turns out you <strong>don't</strong> have to install another copy of MySQL in some temporary location for the libraries - you have everything you need, assuming you've already installed XCode Tools. 

So, what DO you have to do? The following:

{% highlight text %}
shell> cd /path/to/.cpan/build/DBD-mysql-4.001/
shell> perl Makefile.PL --testuser test --testpassword test --testsocket /var/mysql/mysql.sock --cflags="-I/usr/include/mysql" --libs="-L/usr/lib/mysql -lmysqlclient -lz -lm"
shell> make
shell> make test (should work now) 
shell> make install
{% endhighlight %}

<h2>Understanding of why Perl was so broken</h2>

Well, it wasn't exactly Perl's fault. It's MySQL that comes on Apple's Xserve. Apple, you question with an unquestionable doubt in your mind? Yes, Apple. Check this out:

{% highlight text %}
shell> mysql_config --libs
-arch ppc64  -arch x86_64 -pipe -L/usr/lib/mysql -lmysqlclient -lz -lm
shell> mysql_config --cflags
-I/usr/include/mysql -fno-omit-frame-pointer  -arch ppc64  -arch x86_64 -pipe
{% endhighlight %}

Now isn't that funny! On my new Xeon Xserve, the architecture specifications (which for some odd reason appear in BOTH the cflags AND libs flags which normally appear ONLY in the cflags) are for BOTH ppc64 AND x86_64... AFAIK, this server is Intel 64-bit based, not PowerPC any longer. So, when Perl goes through and autoconfigures its switches, these architecture flags cause the tests to blow up because it's expecting a completely different set of tools that are expected to work on the PowerPC architecture.

Anywho, it's working now, and that make me (and my client) happy. 
