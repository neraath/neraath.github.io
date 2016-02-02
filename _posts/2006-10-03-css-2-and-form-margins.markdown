---
comments: true
date: '2006-10-03 01:13:12'
layout: post
slug: css-2-and-form-margins
status: publish
title: CSS 2 and Form Margins?
wordpress_id: '40'
categories:
- software development
tags:
- css
- html
- design
---

As far as I was aware, forms were simply supposed to be wrappers to allow the browser to determine which elements inside are supposed to be used with particular forms. Well, according to some browsers, now they have properties to modify the way a page look <strong>by default</strong>. 

Both Opera 9 and Safari seem to have this really messed up view on the fact that forms are supposed to have a 1em bottom margin. I spent probably the better part of an hour trying to figure out why on earth I couldn't get my login box for a client's site to work properly on Opera, only to find this! I knew there was something wrong with the form, but I just couldn't figure out what. 

In any case, if you have mysterious paddings on the bottom of your form elements, this is why. Just use CSS to set "margin-bottom: 0px;". 
