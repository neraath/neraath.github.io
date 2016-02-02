---
comments: true
date: '2007-05-26 16:17:07'
layout: post
slug: mysqld-5040-mysql-client-and-ssl-connectivity-problems
status: publish
title: MySQLd 5.0.40, MySQL Client, and SSL Connectivity Problems
wordpress_id: '85'
categories:
- systems administration
tags:
- mysql
- ssl
- linux
- sql
---

So, I now have one of our new servers sitting in a datacenter in Dallas. It is to replace one of our dedicated servers we are renting through <a href="http://www.theplanet.com" target="_blank">The Planet</a>. Well, our client's website is doing extremely well right now and is averaging roughly 2,000 hits per day. This is one of the various eCommerce websites we have built for various customers. So, credit card data does get transmitted (always securely) between the database server residing on the dedicated server. Well, in order to minimize downtime for our customer's website and to retain no loss of data, we have to do something about database connectivity between the old server and the new server. Luckily, MySQL is resilient enough to allow for remote connections, and as long as the latency between the servers isn't bad, the website will operate at the same rate as normal.

However, the difference between connecting to a database residing on localhost and a database server residing on some other machine is the type of connectivity. By default, connections are unencrypted, so eCommerce information should NOT be transmitted in this manner. We need to transmit it over SSL-style connections. Again, MySQL is resilient enough to have these features built-in, assuming you compiled your server with SSL support.

I began by taking a copy of our customer's database and sending it over to the new server:

{% highlight text %}
oldServer&gt; mysqldump -u root databasename -p &gt; databasename.mysql
oldServer&gt; scp databasename.mysql newserver:/home/customer/databasename.mysql
oldServer&gt; ssh newserver
newServer&gt; mysql -u root databasename -p &lt; /home/customer/databasename.mysql
{% endhighlight %}

No problems were encountered here. So, the difference between SSL connections using SSH and SSL connections using MySQL is that MySQL requires SSL certificates and keys, much like web servers and mail servers do. However, you don't have to purchase one of these. You CAN use self-signed certificates, as long as you have access to the Certificate Authority certificate file (shouldn't be a problem if you are acting as the Certificate Authority). I'm not going to go into signing your own certificates, but there are several great websites that tell you how to do this, such as <a href="http://www.tc.umn.edu/~brams006/selfsign.html" target="_blank">this one</a>. 

So, I did the usual things necessary to create my certificate (since I act as the certificate authority for my company), and copied the certificate data into the following locations:

{% highlight text %}
newServer> cp /root/sslcerts/newServer.key /etc/ssl/private/newServer.key
newServer> cp /root/sslcerts/newServer.crt /etc/ssl/certs/newServer.crt
newServer> cp /root/sslcerts/CA.crt /etc/ssl/certs/CA.pem
newServer> cd /etc/ssl/certs
newServer> /usr/bin/c_rehash
{% endhighlight %}

I followed the same pattern for the CA certificate as everything else that was in that directory. All extensions were .pem. Note that openssl generates PEM formatted certificates and keys anyways, so it is perfectly legal and acceptable. <em>c_rehash</em> is used to parse the /etc/ssl/certs directory for new certificate authority certificates and create a symbolic link that has a name that's a hashed value of the certificate. Read the man page for c_rehash for further information.

Anywho, everything was in their respective location, and I had added the following lines in my /etc/mysql/my.cnf file (under the server section):

{% highlight text %}
ssl-ca = /etc/ssl/certs/CA.pem
ssl-key = /etc/ssl/private/newServer.key
ssl-cert = /etc/ssl/certs/newServer.crt
ssl-cipher = ALL:-AES:-EXP
{% endhighlight %}

I started MySQL and no errors were detected. As the <a href="http://dev.mysql.com/doc/refman/5.0/en/secure-connections.html" target="_blakn">MySQL Manual</a> states for SSL connectivity, you issue the command <em>show variables like 'have%'</em> to show if you have SSL connectivity available. Here's what mine showed:

{% highlight text %}
mysql> show variables like 'have%';
+-----------------------+----------+
| Variable_name         | Value    |
+-----------------------+----------+
| have_archive          | NO       | 
| have_bdb              | YES      | 
| have_blackhole_engine | NO       | 
| have_compress         | YES      | 
| have_crypt            | YES      | 
| have_csv              | NO       | 
| have_dynamic_loading  | YES      | 
| have_example_engine   | NO       | 
| have_federated_engine | NO       | 
| have_geometry         | YES      | 
| have_innodb           | DISABLED | 
| have_isam             | NO       | 
| have_merge_engine     | YES      | 
| have_ndbcluster       | NO       | 
| have_openssl          | DISABLED | 
| have_ssl              | DISABLED | 
| have_query_cache      | YES      | 
| have_raid             | NO       | 
| have_rtree_keys       | YES      | 
| have_symlink          | YES      | 
+-----------------------+----------+
20 rows in set (0.00 sec)
{% endhighlight %}

Well that's interesting, SSL is disabled. After a few hours of trying to figure out what this is, including starting SSL with those configuration options on the command line rather than through the my.cnf file, I found out the culprit of this was the ssl-cipher line in the config. Even setting this to just <strong>ALL</strong> caused the same result. However, when I removed that option and restarted MySQL, I got the following results:

{% highlight text %}
mysql> show variables like 'have%';
+-----------------------+----------+
| Variable_name         | Value    |
+-----------------------+----------+
| have_archive          | NO       | 
| have_bdb              | YES      | 
| have_blackhole_engine | NO       | 
| have_compress         | YES      | 
| have_crypt            | YES      | 
| have_csv              | NO       | 
| have_dynamic_loading  | YES      | 
| have_example_engine   | NO       | 
| have_federated_engine | NO       | 
| have_geometry         | YES      | 
| have_innodb           | DISABLED | 
| have_isam             | NO       | 
| have_merge_engine     | YES      | 
| have_ndbcluster       | NO       | 
| have_openssl          | YES      | 
| have_ssl              | YES      | 
| have_query_cache      | YES      | 
| have_raid             | NO       | 
| have_rtree_keys       | YES      | 
| have_symlink          | YES      | 
+-----------------------+----------+
20 rows in set (0.00 sec)
{% endhighlight %}

I have filed a <a href="http://bugs.mysql.com/bug.php?id=28543" target="_blank">bug</a> with MySQL about this, because it's a critical flaw, not being able to specify which Ciphers you wish to allow. 

So, now that I see SSL connectivity is allowed, I need to create an account and fully restrict it to require SSL connections. This is done in my grant statement. Full instructions on <a href="http://dev.mysql.com/doc/refman/5.0/en/grant.html">Granting with SSL Requirements</a> are available in the MySQL Reference Manual. So, in MySQL, I issue the following command:

{% highlight text %}
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON `databasename`.* TO 'customer_dbuser'@'192.168.1.1' \
    -> IDENTIFIED BY 'goodsecret' \
    -> REQUIRE ISSUER '/C=US/ST=Texas/L=College Station/O=Company Name/OU=Certification Authority Name/CN=My Root Certificate Authority' \
    -> SUBJECT '/C=US/ST=Texas/L=College Station/O=Company Name/OU=Department/CN=oldserver.domain.com/emailAddress=admin@domain.com' \
    -> CIPHER 'DHE-RSA-AES256-SHA';
{% endhighlight %}

The <strong>ISSUER</strong> and <strong>SUBJECT</strong> lines come from what you filled out when creating the certificate authority CSR and the host CSR, respectively. You can get this value by looking for the issuer and subject lines in the ouput from the following command:

{% highlight text %}
shell> openssl x509 -noout -in oldServer.crt -text
{% endhighlight %}

The CIPHER is what openssl uses by default for creating SSL certificates. If you used a different cipher when creating the key, CSR, and Certificates, then specify it accordingly.

So, after having those problems and now having SSL connectivity (half-way) completed, it's time to move onto the old server. I send over the newly created SSL certificates to the old server via SSH and install them in roughly the same places:

{% highlight text %}
oldServer> cp /root/sslcerts/CA.crt /etc/ssl/certs/CA.pem
oldServer> cp /root/sslcerts/oldServer.crt /etc/ssl/certs/oldServer.crt
oldServer> cp /root/sslcerts/oldServer.key /etc/ssl/private/oldServer.key
{% endhighlight %}

I then added the following lines under the <strong>client</strong> section in the /etc/mysql/my.cnf file:

{% highlight text %}
ssl-ca = /etc/ssl/certs/CA.pem
ssl-key = /etc/ssl/private/oldServer.key
ssl-cert = /etc/ssl/certs/oldServer.crt
# ssl-cipher = ALL:-AES:-EXP
{% endhighlight %}

The specification of certificate information on the server as well as certificate information on the client is ESSENTIAL in the success of this. RTFM, if you haven't already.

So, time to fire up the connection to see if it works:

{% highlight text %}
oldServer> mysql -u customer_dbuser -h newServer -p --ssl-ca=/etc/ssl/certs/CA.pem --ssl-key=/etc/ssl/private/oldServer.key --ssl-cert=/etc/ssl/certs/oldServer.crt
Password: &lt;enter goodsecret&gt;
SSL Connect Failed
{% endhighlight %}

If you fail to put anything in the client section of the my.cnf file and DONT specify a ssl-key or ssl-cert on the command line, you will see a generic SSL connection error on the client side and the following error message on the server's logs (IF you have debugging turned on):

{% highlight text %}
tls peer did not respond with certificate list
{% endhighlight %}

This even occurs if you only entered <strong>REQUIRE SSL</strong> for the client and nothing further. But, this was not my case. I spend yet another few hours trying to figure out what happened with this and finally recompiled the newServer MySQL with the debug option. After trying again and parsing the debug files, I found the following line:

{% highlight text %}
Error:  "error:00000005:lib(0):func(0):DH lib"
{% endhighlight %}

This was in the sslaccept function. After <a href="http://www.google.com" target="_blank">Googling</a> this for about an hour, I found nothing relevant to the problem. It's a generic openssl error, assuming that you are using openssl and not another SSL library set. 

To make a long story short, the error message was extremely misleading and it boiled down to a permissions problem. I coulda sworn that all my permissions were correct, but it turns out they weren't. Here's how it was setup:

{% highlight text %}
newServer&gt; ls -alF /etc/ssl/private 
drwx------ 2 root root  184 May 19 21:47 ./
drwxr-xr-x 5 root root  152 Apr 19 19:52 ../
-rw-r--r-- 1 root root 3247 May 19 20:32 newServer.key
{% endhighlight %}

For those still unfamiliar with Linux, if you look at the permissions for <strong>./</strong>, you'll notice it's Read, Write, and Execute for the owner ONLY. This means that nobody else could traverse into this directory, EVEN THOUGH the newServer.key was at least readable by everyone. 

<h3>Moral of the Story</h3>

Double check your permissions. 
