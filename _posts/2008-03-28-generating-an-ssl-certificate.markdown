---
comments: true
date: '2008-03-28 08:51:47'
layout: post
slug: generating-an-ssl-certificate
status: publish
title: Generating an SSL Certificate
wordpress_id: '111'
categories:
- systems administration
tags:
- linux
- ssl
---

I remembered when I first started doing systems administration. One of the first (and simplest) things I had to do was learn how to generate a self-signed SSL certificate because I didn't want to pay for one. Well, since my first time doing it, I've done the process about 2^18 times now, so it's second nature to me. But, to some folks who don't want to read the lengthy explanation on what each step does, here's a breakdown of what commands you'll issue on a Linux server. Explanation about the steps will follow.

<!--more-->

{% highlight text line=1 %}
#1> openssl genrsa -out host.domain.tld.key 1024
   Passphrase: lt;enter a lengthy password, e.g. more than 10 characters&gt;
   Confirm Passphrase: &lt;enter it again&gt;
#2> openssl req -new -key host.domain.tld.key -out host.domain.tld.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:&lt;enter your country code, e.g. US&gt;
State or Province Name (full name) [Some-State]:&lt;give it what it asks for&gt;
Locality Name (eg, city) []:&lt;again, give it what it asks for&gt;
Organization Name (eg, company) [Internet Widgits Pty Ltd]:&lt;you can use special characters&gt;
Organizational Unit Name (eg, section) []:&lt;this is optional&gt;
Common Name (eg, YOUR name) []:&lt;this should be host.domain.tld&gt;
Email Address []:&lt;this is your email address&gt;

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []: &lt;enter nothing here&gt;
An optional company name []: &lt;enter nothing here&gt;

#3> openssl x509 -req -signkey host.domain.tld.key -in host.domain.tld.csr -out host.domain.tld.crt \
-set_serial &lt;serial number&gt; -days &lt;# of days this cert is valid&gt;
{% endhighlight %}

And you're done. Now, if you had a Certificate Authority key and certificate and wanted to sign your new certificate request with that, instead of self signing it, you'd issue the following final command:

{% highlight text %}
#> openssl x509 -req -CAkey cakey.key -CA cacert.crt -in host.domain.tld.csr -out host.domain.tld.crt \
-set_serial &lt;serial number&gt; -days &lt;# of days this cert is valid&gt;
{% endhighlight %}

<strong>Explanation</strong>

<strong>Command #1</strong>: The command on Line 1 of the block above is used for generating the private key. This key should be considered very private and should be protected at all costs. Failure to protect this key and it's exposure can enable sniffers to decrypt traffic that's encrypted for your SSL connection. Typically, protection is done through entering a nice and secure passphrase (that being a password that's much longer than traditional passwords). Thus, when someone looks at your private key, they won't be able to get the actual key from it unless they know your passphrase. 

<strong>Note:</strong> When using a passphrase for your private key, server processes such as Apache or MySQL must be made aware of what the passphrase is to be able to use the key, else they cannot do SSL encryption. What this requires is for you to either put the password in cleartext in a config file somewhere on the server, which can lead to a false sense of security. The most tried and true way is to leave the key unencrypted, but lock it down to where only the root, Apache, MySQL, or other process that's going to use the certificate can read it. This eliminates the need for you to have to put the passphrase in cleartext in a config file which could easily be read. 

Continuing with Command #1, the last text is <strong>1024</strong>. This is the number of bits of encryption you want the SSL connection encrypted with the certificate you are generating you want to have. The higher the number of bits, the higher the encryption. Coincidentally, the higher the number of bits, the greater the amount of bandwidth consumed. This value needs to be a power of 2 (e.g. 1024, 2048, 4096, etc) as not doing so makes the encryption channel weak because RSA (the cryptographic methodology used in SSL) is based on powers of 2. For general websites that aren't doing eCommerce, 1024 is suitable. For websites doing eCommerce, I recommend at least 2048, but would probably recommend 4096 if you are signing the keys yourself. If you are sending the signing to a provider (such as Verisign or Thawte), you should check with the provider to see if they accept CSRs for 4096 bit encryption. If they do, go ahead. But, keep in mind how much bandwidth you want consumed for encryption. If you have a high traffic eCommerce web site with not a lot of bandwidth available per month, you may want to step back to 2048 bit encryption to save your bandwidth. 

<strong>Command #2</strong>: This command is used to generate what's called a <strong>Certificate Signing Request</strong>. This is what's used to contain the information about the company or individual that's requesting the certificate to be signed. Wrapped in a CSR file is part of the key information (signed in a public way that won't expose the actual private key) as well as information that you provide the prompts. The prompts are on lines 5 through 24. Most everything is self explanatory. Enter what I've put in &lt; and &gt; next to each of the prompts and you're golden. You'll get a text file that is used to ship off to a SSL certificate authority, or you'll use it to sign yourself (as I've shown in the commands above). 

<strong>Command #3</strong>: This is the final command that is used to generate the actual certificate. In the long block of commands, this command self signs the certificate with it's own key. What this means is you are your own certificate authority, and anyone accessing your web site will see that the certificate authority information matches exactly the certificate information itself. The consequence? If anyone is concerned about privacy or security, they won't trust your certificate because it's not signed by a trusted Certificate Authority. However, if it's an internal web application, or you have selective users that know you haven't purchased a certificate, then you should be fine with self signing.

An alternative, though, is to create your own Certificate Authority key and certificate pair. What this enables you to do is have a single key and certificate that are used to sign all of your SSL certificates you generate. What you proceed to do is publish the Certificate Authority Certificate on all internal desktops, servers, etc. and on your company web site. Then, browser's that have designated that any certificate signed by your certificate authority as trusted won't get a pop-up telling them the secure site they are visiting is untrusted. Many organizations (including Cerberus and Texas A&M University) do this and it is much more efficient (and cheaper) than sending all SSL certificate requests to a commercial Certificate Authority. If you are curious as to how to create your own certificate authority, send me an email at chris at chrisweldon dot net. 
