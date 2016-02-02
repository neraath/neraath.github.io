---
layout: post
title: "Editing the SharePoint 2013 My Sites Web Part Pages"
description: "Editing pages in SharePoint 2013 My Sites is easier than one would think..."
keywords: "sharepoint,2013,mysite,newsfeed,personal,social,apps,app part,web part,designer"
date: 2013-04-25 08:24
comments: true
external-url: 
categories:
- software development
- systems administration
tags:
- sharepoint
- systems
---
The last two weeks have been interesting. I've been trying to deploy an app part built as part of a SharePoint 2013 app I developed recently. The app part re-creates the "Suggestions" functionality that you see when visiting the "Followed Sites" and "Followed People" pages in your My Site. Those web parts were **not** easily reused in other parts of My Sites. The purpose of creating this app part was to be able to add suggestions directly to the Newsfeed page to make it a more useful information radiator. Unfortunately, editing the Newsfeed page (or any page) in the "My Site Host" was not nearly as intuitive as I had hoped. 

<img style="float:right" src="/images/posts/2013-04-25-editing-the-sharepoint-my-sites-web-part-pages/site-edit-page.png Edit Page in Ribbon" alt="" />

I'm used to having the ribbon to edit pages in SharePoint, regardless if they are standard publishing pages or web part pages. However, in the "My Site Host", there is no ribbon for the standard pages, even when you are a farm administrator. I jumped to the conclusion that I could add the App Part via SharePoint Designer. Sadly, this wasn't the case. SharePoint Designer does not list **any** app parts. 

I tried to go through the rigarmarole of adding the app to a separate site through the web editor, then copying the code from within SharePoint Designer and pasting it into the Newsfeed page, only for that to fail. The identifiers for the apps are completely different.

<img style="float:left" src="/images/posts/2013-04-25-editing-the-sharepoint-my-sites-web-part-pages/gear-edit-page.png" alt="Edit Page in Settings Menu" />

This is when I stepped back and though that the solution should be simpler than this. It turns out, it was. Click the gear icon (settings menu) in the upper-right corner of SharePoint and you'll find the **Edit Page** link. I felt liberated and frustrated at myself for not checking there earlier. From there, you have complete control to edit the Newsfeed web part page (or any page in the "My Site Host"). 

<img style="float:center" src="/images/posts/2013-04-25-editing-the-sharepoint-my-sites-web-part-pages/newsfeed-web-part.png" alt="Newsfeed Web Part Page" />
