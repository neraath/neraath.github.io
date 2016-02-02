---
comments: true
date: '2009-04-16 18:04:57'
layout: post
slug: certificate-services-and-unsupported-critical-extensions
status: publish
title: Certificate Services and Unsupported Critical Extensions
wordpress_id: '193'
categories:
- systems administration
tags:
- java
- ssl
- systems administration
- windows
---

Because of the need to have Active Directory operating over SSL, Active Directory Certificate Services were setup in our environment.
For those unfamiliar with Active Directory Certificate Services, it is essentially a Public Key Infrastructure for a Windows Environment that cleanly ties into IIS, LDAP, and anything else that needs to request certificates and have a parent certificate authority seamlessly sign requests (real purpose is shortened for brevity). 

<!--more-->

After the initial install of the services, some changes were made. The reason was because of a problem with using the Certificate Root Authority Certificate on a Java Application server to allow the certificates assigned to the domain controllers to be trusted. The specific error message was:

simple bind failed: sydney.arch.tamu.edu:636; nested exception is javax.naming.CommunicationException: simple bind failed: domain.server.fqdn:636 [Root exception is javax.net.ssl.SSLHandshakeException: java.security.cert.CertificateException: Certificate contains unsupported critical extensions: 2.5.29.17]

These unsupported critical extensions are the <strong><a href="http://forum.springsource.org/archive/index.php/t-42510.html">SubjectAltName</a></strong>. From Windows Server 2003 to Windows Server 2008, the default Certificate Template for Domain Controller Authentication allows the requestor to specify their <strong>Subject Alternative Name</strong>, and when the certificate is issued, it is marked critical. Because Java doesn't recognize this extension, it by default fails the certificate, resulting in the error message above.

After many hours of Google searching, I managed to find <a href="http://blogs.technet.com/askds/archive/2008/09/16/third-party-application-fails-using-ldap-over-ssl.aspx">the article that fixes the problem</a>. In essence, we have to change the Subject name format from None to Common name. To get to this option box, do the following:

<ol><li>Open the Server Manager</li><li>Expand Roles > Active Directory Certificate Services</li><li>Click Certificate Templates</li><li>Right click on Domain Controller Authentication and click properties</li><li>Click the Subject Name tab</li><li>Change the Subject name format drop-down option from None to Common name</li><li>Click OK</li></ol>

This will change the settings for this template. However, if you have issued any Domain Controller certificates up to this point, you will need to revoke them and reissue new certificates. 
