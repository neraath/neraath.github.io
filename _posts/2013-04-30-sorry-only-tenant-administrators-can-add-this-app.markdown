---
layout: post
title: "Sorry, only tenant administrators can add or give access to this app"
date: 2013-04-30 10:41
comments: true
external-url: 
categories: 
- Software Development
- Systems Administration
---
I have just completed building my first SharePoint 2013 application. I came across the error message ``Sorry, only tenant administrators can add or give access to this app.`` when trying to deploy the application to my site. This happened regardless if I was deploying using a SharePoint development site or after installing the solution in the app catalog. 

<img style="float:center" src="/images/posts/2013-04-30-sorry-only-tenant-administrators-can-add-this-app/error.png" alt="Error Message" />

The application required Tenant Read permissions as I'm accessing the User Profile through the JavaScript object model. The purpose of using the User Profile JSOM is to get the suggestions of sites and people to follow that SharePoint presents. 

Now, the concept of a "Tenant" makes sense for Office 365 or SharePoint Online. As a hosting provider, there are multiple tenants you want to support in a single environment. However, for an on-premise deployment, this error message didn't make much sense. I started poking around and came across [spinning up a tenant administration site](http://www.social-point.com/tenant-administration-sites), being able to set multiple app tenants through the [App Management Service cmdlets](http://technet.microsoft.com/en-us/library/jj219772.aspx), but none of those really seemed like the right solution for my on-premise deployment. I found an [MDSN Forum Question](http://social.msdn.microsoft.com/Forums/en-US/sharepointdevelopment/thread/4e844f6c-2b73-46ff-9cda-05105332b8f8) which seemed closer to the solution. That post recommends splitting the service accounts used to host the App Management and Site Settings services from the farm account. This was critical as the Farm Account is **not allowed** to add apps under its identity whatsoever. You will get an error message when trying to provision, and the ULS logs will indicate that an assertion failed checking that the current account was not the system account. 

<img style="float:right" src="/images/posts/2013-04-30-sorry-only-tenant-administrators-can-add-this-app/success.png Provision" alt="" />

What did it turn out to be? I just needed to make sure my user account was **directly** added as a member of the **Farm Administrators** group. We have traditionally deployed farm administrators via an Active Directory and local (Administrators) group. However, it appears that the App Management service dislikes this approach and wants users *explicitly* permissioned to the **Farm Administrators** group. Additionally, after granting your user direct permissions, you need to issue an ``iisreset`` so those changes take effect. Then, you can provision your app successfully.

