---
layout: post
title: "Setting up Custom Elastic Bamboo VM for Working With Atlassian OnDemand"
description: "I spent way too much time on Sunday dealing with issues getting a custom Amazon EC2 virtual machine setup for automated PHP builds for Elastic Bamboo. This post describes what should be the steps that it took from beginning to end to help you have a working PHP build server."
keywords: "php,ec2,amazon,bamboo,atlassian,elastic bamboo,build,build server,continuous integration,ci"
date: 2012-06-11 08:10
comments: true
categories: 
- software development
- systems administration
tags:
- php
- bamboo
- atlassian
- continuous integration
- build
- amazon
- ec2
---

<img style="float: left" src="/images/posts/2012-06-11-setting-up-custom-elastic-bamboo-vm-for-working-with-atlassian-ondemand/bamboo.png" alt="Atlassian Bamboo" />

One of my customers is an <a href="http://www.atlassian.com/ondemand" target="_blank">Atlassian OnDemand</a> customer (at my recommendation). One of the tools we are starting to use is <a href="http://www.atlassian.com/bamboo" target="_blank">Bamboo</a> for continuous integration. The beauty of Bamboo as a product is it's Elastic Bamboo feature. This feature allows CI builds to spin up on virtual machine instances on <a href="http://aws.amazon.com/" target="_blank">Amazon's EC2</a>. This gives me (the developer) quite a bit of flexibility. I gain the ability to have <em>mulitple</em> virtualized environments with different specifications ready to test my software against (think: different versions of PHP, MySQL, *nix, etc.). Furthermore, I can run the build process on much beefier hardware than what Bamboo is currently running on, allowing the tests to complete faster and keep my feedback loop small. 

The idea is really great, but the Bamboo team has only one type of EC2 AMI virtual machine image premade for working with Elastic Bamboo - a Java developer's VM. This meant I needed to customize the virtual machine to add software packages I need to work for PHP development. That was no trivial task, considering the number of problems I ran into just trying to get it running. This blog post should hopefully cover the necessary steps to getting it working. 
<!--more-->
