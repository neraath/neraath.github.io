---
comments: true
date: '2007-08-13 09:27:16'
layout: post
slug: openldap-ssl-and-php
status: publish
title: OpenLDAP, SSL, and PHP
wordpress_id: '90'
categories:
- software development
- systems administration
tags:
- linux
- ldap
- ssl
- php
---

It never ceases to amaze me how many outside dependencies there are for PHP. When trying to get a PHP application to connect to an LDAP server over SSL, you have to have the following:
<ul><li>OpenLDAP (at least branch 2.x.x)</li><li>OpenSSL</li><li>Reminder: Compile OpenLDAP with SSL support! Just in case you didn't do that already.</li></ul>

Yes, but once you have all that done, then you need to hope and pray that it will connect successfully. On a Linux server, this is definitely a possibility (but a treacherous task at that). On a Windows machine: forget it. You might as well count your losses and start coding your application in .Net before you try connecting to an LDAP server via SSL with a Windows box (that or you need to be really good at compiling opensource software on Windows machines). 

<h1>The Error</h1>
So, here's the error message I'm getting in my PHP app:

{% highlight text %}
Warning: ldap_bind(): Unable to bind to server: Can't contact LDAP server.
{% endhighlight %}

Pretty generic error message right? It can be anything. I'm guessing, though, that it's something with OpenLDAP. That's why it comes with the wonderful tool `ldapsearch`. This _should_ help me figure out if it's an application problem or a OpenLDAP problem.

{% highlight text %}
neraath:~/> ldapsearch -b ou=people,dc=example,dc=com 
-H ldaps://host.example.com searchMailbox=neraath
ldap_sasl_interactive_bind_s: Can't contact LDAP server (-1)
{% endhighlight %}

Once again, a pretty generic error message. If you try to Google that error message, you're not gonna get anywhere. This is where OpenLDAP's debugging switch turns out to be quite handy. My favorite: `-d 7`. Watch it in action:

{% highlight text %}
neraath:~/> ldapsearch -b ou=people,dc=example,dc=com 
-d 7 -H ldaps://host.example.com searchMailbox=neraath
ldap_create
ldap_url_parse_ext(ldaps://host.example.com)
ldap_pvt_sasl_getmech
ldap_search
put_filter: "(objectclass=*)"
put_filter: simple
put_simple_filter: "objectclass=*"
ldap_send_initial_request
ldap_new_connection
ldap_int_open_connection
ldap_connect_to_host: TCP host.example.com:636
ldap_new_socket: 3
ldap_prepare_socket: 3
ldap_connect_to_host: Trying IP.ADDRESS.HIDDEN.HERE:636
ldap_connect_timeout: fd: 3 tm: -1 async: 0
ldap_ndelay_on: 3
ldap_is_sock_ready: 3
ldap_ndelay_off: 3
TLS: could not load client CA list (file:`',dir:`/etc/apache2/ssl.crt').
TLS: error:0906D06C:PEM routines:PEM_read_bio:no start line pem_lib.c:642
TLS: error:0906D06C:PEM routines:PEM_read_bio:no start line pem_lib.c:642
TLS: error:0200100D:system library:fopen:Permission denied bss_file.c:278
TLS: error:20074002:BIO routines:FILE_CTRL:system lib bss_file.c:280
ldap_perror
ldap_sasl_interactive_bind_s: Can't contact LDAP server (-1)
{% endhighlight %}

Lo-and-behold the answer becomes evident:

{% highlight text %}
TLS: could not load client CA list (file:`',dir:`/etc/apache2/ssl.crt').
{% endhighlight %}

I change the /etc/openldap/ldap.conf file line 'TLS_CACERTDIR /etc/apache2/ssl.crt' from what it is to 'TLS_CACERTDIR /etc/ssl/certs'. I re-run the above command and it prompts me for a password. This is definitely a good sign. Running it again in my PHP code? <strong>Of course not.</strong>

<h1>Step 2: Google Some More</h1>

After more wonderful Googling for the most generic PHP error possible, I find that the problem may potentially be the certificate (view the <a href="http://groups.google.com/group/comp.lang.php/browse_thread/thread/561fc2d56b17aca6/4e1f33f9a016dc24?lnk=st&q=php+ldap_start_tls+Connect+error&rnum=3#4e1f33f9a016dc24">thread</a>). So, I decide to try to figure out how to actually view the certificate that's on the server (in case it is self-signed or not trusted, somehow). This takes me the better part of half an hour, but I finally figure out the openssl command necessary to view the public key / certificate of a service:

{% highlight bash %}
openssl s_client -connect host.example.com:ldaps
{% endhighlight %}

This gave me the public key necessary to save and then place in at /etc/ssl/certs/host.example.com.pem. After doing so, I ran `c_rehash` and then modified my /etc/openldap/ldap.conf file. I added the following lines to the config:

{% highlight text %}
URI: ldap://host.example.com
TLS_CACERT /etc/ssl/certs/host.example.com.pem
{% endhighlight %}

After restarting Apache and testing the PHP file, things seem to be going a little smoother. No more connect errors. I will update if something goes awry, though. 
