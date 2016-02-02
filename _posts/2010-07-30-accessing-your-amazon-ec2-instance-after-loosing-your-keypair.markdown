---
comments: true
date: '2010-07-30 10:22:39'
layout: post
slug: accessing-your-amazon-ec2-instance-after-loosing-your-keypair
status: publish
title: Accessing your Amazon EC2 Instance After Loosing Your KeyPair
wordpress_id: '282'
categories:
- systems administration
tags:
- ec2
- linux
- Systems Administration
---

I setup my first EC2 instance about 9 months ago when I was moving all of my <a href="http://www.atlassian.com/">Atlassian</a> instances for Cerberus from a server I recently moved out of our <a href="http://www.colo4dallas.com/">Colo4Dallas Datacenter</a>. It was nice to have around and did me good when I needed to access the instances only on occasion - saving me money. The problem I encountered today was I had moved between a couple of desktops and failed to take an (adequate) backup of the KeyPair used to connect to the instance. I tried re-downloading the KeyPair from the Amazon site, only to find that it cannot be downloaded. Thus, I had no way to access my virtual machine...easily. 
<!--more-->
<h2>Instructions</h2>
<ol>
<li>Stop your EC2 instance (but don't terminate it).</li>
<li>Create a new KeyPair (and backup the key this time!).</li>
<li>Create a new EC2 instance, but use the new keypair. (ec2-run-instances ami-abc01234 -k new-keypair-name -g old-security-group)</li>
<li>Detach the volume from the existing instance.</li>
<li>Create a snapshot of that volume.</li>
<li>Spawn a new instance of the volume in the same <strong>Availability Zone</strong> as your new EC2 instance.</li>
<li>Attach the new volume to your new EC2 instance, using the mountpoint <code>/dev/sdb1</code>.</li>
<li>Login to your new EC2 instance using the newly generated security key.</li>
<li>Mount the additional volume somewhere (e.g. <code>/mnt/existing</code>).</li>
<li>Append the output of <code>/root/.ssh/authorized_keys</code> to <code>/mnt/existing/root/.ssh/authorized_keys</code>.</li>
<li>Append the output of <code>/home/ubuntu/.ssh/authorized_keys</code> to <code>/mnt/existing/home/ubuntu/.ssh/authorized_keys</code>.</li>
<li>Umount the additional volume (<code>umount /mnt/existing</code>).</li>
<li>Detach the volume from the new EC2 instance.</li>
<li>Create a new snapshot of the volume.</li>
<li>Spawn a new instance of the volume in the original <strong>Availability Zone</strong> as the original EC2 instance.</li>
<li>Attach the new volume to the existing EC2 instance using the mountpoint <code>/dev/sda1</code>.</li>
<li>Start the existing instance again. Once started, you should be able to connect as the root (or ubuntu) user with the new keypair you generated.</li>
</ol>
