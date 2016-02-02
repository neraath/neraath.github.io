---
layout: post
title: "SharePoint 2010 FAST Search Errors"
date: 2012-08-23 14:46
comments: true
external-url: 
description: "I ran into a series of problems while looking at my customer's FAST Search for SharePoint. This details the errors I received and how to fix them."
keywords: "sharepoint,FAST,2010,search,ssl"
categories: 
- systems administration
tags:
- sharepoint
- FAST
- 2010
- search
- ssl
---

Today I ran into a slew of interesting errors while working on my customer's SharePoint 2010 instance. They reported they were receiving errors while trying to search for content on their sites. As is typical, searching <em>had</em> worked before, but was no longer working. For reference, the error when they used the little search box below the ribbon was none other than the obligatory useless standard SharePoint error message:

<img src="/images/posts/2012-08-23-sharepoint-2010-fast-search-errors/useless-sharepoint-error.png" alt="Useless SharePoint Error" />

If you get this, it's time to crack open the Event Viewer and the SharePoint Logs. If you're not on a single server environment (aka: a Farm), trying to find the Correllation ID is going to be truly fun. However, once you've found the Correllation ID, look for the next Unexpected or Critical error. Initially, I came across the following <strong>Unexpected</strong> error:

{% highlight text %}
CoreResultsWebPart::OnInit: Exception initializing: System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.SetPropertiesOnQueryReader()
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.OnInit(EventArgs e)
{% endhighlight %}

with the detailed exception being:

{% highlight text %}
Internal server error exception: System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.SetPropertiesOnQueryReader()
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.OnInit(EventArgs e) System.NullReferenceException: Object reference not set to an instance of an object.
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.SetPropertiesOnQueryReader()
at Microsoft.Office.Server.Search.WebControls.CoreResultsWebPart.OnInit(EventArgs e)
{% endhighlight %}

However, when I went digging a little further, I found the following error. If you find it as well, you're on the same track that I am:

{% highlight text %}
Failed to connect to FASTSEARCHSERVER:PORT Failed to initialize session with document engine: Unable to resolve Contentdistributor
{% endhighlight %}

<strong>FASTSEARCHSERVER:PORT</strong> is the server and port of the FAST Search Service you should have already installed. If you find this, your query service application may not be able to talk to the FAST Search Server. I suggest you check for one (or all) of the following.

<h2>Ensure the FAST Search Services are Running</h2>

First, log in to all to all servers where you have installed the FAST Search Services. You'll need to open the Services Management console by doing the following:

<ol>
<li>Go to <strong>Start</strong> &gt; <strong>Run</strong></li>
<li>Type <strong>services.msc</strong> and press enter</li>
<li>If you have UAC, you'll be prompted for your Admin username and password</li>
</ol>

In the list of services, search for the following and make sure <strong>all</strong> are started:

<ul>
<li>FAST Search for SharePoint</li>
<li>FAST Search for SharePoint Monitoring</li>
<li>FAST Search for SharePoint Sam Admin</li>
<li>FAST Search for SharePoint Sam Worker</li>
</ul>

If any of them are not started, I suggest shutting them all down. From there, only start the <strong>FAST Search for SharePoint</strong> service. This <em>should</em> start the other three services as well. Once they are all started, perform an <strong>iisreset</strong> on the web front ends (especially the one running the <strong>SharePoint Search Query and Site Settings Service</strong>) and try the search again.

<h2>SSL Certificate Problem</h2>

If the search is still failing after doing the above check, you need to check to see if the SSL Certificate used for FAST Search communication has expired. I found a <em>great</em> <a href="http://social.technet.microsoft.com/Forums/en-US/fastsharepoint/thread/890b9d38-f226-4afe-963b-59eba2450c80" target="_blank">TechNet article</a> (which points to an even better <a href="http://sharepointmalarkey.wordpress.com/2012/02/29/failed-to-initialize-session-with-document-engine-unable-to-resolve-contentdistributor/" target="_blank">Blog Post by SharePoint Malarkey</a> regarding this problem. Review the instructions in the <a href="http://sharepointmalarkey.wordpress.com/2012/02/29/failed-to-initialize-session-with-document-engine-unable-to-resolve-contentdistributor/" target="_blank">blog post</a> to verify whether you indeed have this problem. 

<h2>Is Anyone the Query Server?</h2>

If you <em>continue</em> to receive errors after performing the above steps, check your SharePoint logs again for the Correllation ID. Somewhere around there you may find the following <strong>Unexpected</strong> error that looks similar to that at the top of this blog post:

{% highlight text %}
CoreResultsWebPart::OnInit: Exception initializing: Microsoft.SharePoint.SPEndpointAddressNotFoundException: There are no addresses available for this application.
{% endhighlight %}

If you look above this error, you may find another <strong>Critical</strong> error:

{% highlight text %}
There are no instances of the Microsoft.Office.Server.Search.Administration.SearchQueryAndSiteSettingsServices started on any server in this farm.
{% endhighlight %}

If you indeed see these exceptions, then you need to check this out. Do the following:

<ol>
<li>Go to Central Administration</li>
<li>Go to Application Management &gt; Manage Services on Server</li>
<li>Go through each of the <strong>Servers</strong> and see if any of them have the <strong>Search Query and Site Settings Service</strong> started.</li>
<li>If <strong>none</strong> have this service started, start this service on the same server that's running <strong>SharePoint Server Search</strong> according to the <strong>Servers in Farm</strong> page.</li>
<li>Run <strong>iisreset</strong> on the server where you found the Correllation ID.</li>
</ol>

By this point, things should start looking up and you should actually get a search page with results. 
