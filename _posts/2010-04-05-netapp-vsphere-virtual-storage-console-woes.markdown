---
comments: true
date: '2010-04-05 16:15:11'
layout: post
slug: netapp-vsphere-virtual-storage-console-woes
status: publish
title: NetApp vSphere Virtual Storage Console Woes
wordpress_id: '269'
categories:
- systems administration
tags:
- configure
- esx
- netapp
- ssl
- vcenter
- vsphere
---

As I was looking for ways to better interact with our NetApp FAS2050, I came across an article detailing the <a href="http://blogs.netapp.com/storage_nuts_n_bolts/2009/06/virtual-storage-console.html">Virtual Storage Console</a>. Being intrigued, I decided to install it on our vCenter Server. The install went fine and the application registered fine per documentation. However, the problem came when entering the credentials under the <strong>NetApp</strong> tab. I was stuck in an infinite loop that stated <code>SSL is not configured.</code>. No matter what I did (whether that was use the root user, the vcenter user I created, checking or unchecking <strong>Use SSL</strong>, I got the same error message - <code>SSL is not configured</code>.

This was despite installing the software per the <a href="http://blog.aarondelp.com/2010/01/installing-netapp-vsc-according-to-best.html">Installing NetApp VSC According to Best Practices</a>. SSHv2 and SSL were enabled when executing <code>secureadmin status</code>. Furthermore, <code>httpd.admin.enable</code> was on using legacy access. 

I went Googling for the solution to the problem, and came across an <a href="http://old.nabble.com/ESX-utilty-problem-td22709305.html">old Nabble list scrape</a> that said to put the IP addresses of all of my ESX hosts in <code>/etc/hosts.equiv</code> and turn on <code>httpd.admin.hostsequiv.enable</code>. Sadly, that didn't work. Yet, further Googling revealed <a href="http://communities.netapp.com/message/14396?tstart=0">something painfully obvious</a>. If you've ever tried accessing your filer via HTTPS (e.g. https://filer/na_admin/) and you were <strong>not</strong> listed in the <code>trusted.hosts</code>, then you're flat out denied access. That's <strong>exactly</strong> what was going on here. The VSC requires access to the APIs provided through the same console, and thus requires you to manually list all the IP addresses of the ESX servers in the <code>trusted.hosts</code> file. 

<h3>In Summary</h3>

Make sure all of your ESX hosts (and vCenter server) are listed in the <code>options trusted.hosts</code>. 
