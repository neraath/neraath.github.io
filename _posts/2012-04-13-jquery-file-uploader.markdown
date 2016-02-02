---
layout: post
title: "jQuery File Uploader, Cross Domain Requests, and ASHX Web Services"
date: 2012-04-13 08:12
comments: true
description: "I spent all evening last night working on a file upload control problem that surfaced several realizations about how cross-domain requests work and how ASHX services are a bit of a pain."
keywords: "software development, jquery, html, javascript, xmlhttprequest, cross domain, web services, ashx, c#, xhr, file uploader"
categories: 
- software development
tags:
- software development
- jquery
- html
- javascript
- xmlhttprequest
- c#
- web services
- ashx
---

Last night I spent all evening (and well into the night) working on a fix for a customer. This customer was using the <a href="https://github.com/blueimp/jQuery-File-Upload/" target="_blank">jQuery File Uploader</a> control to upload pictures to their remote server that's associated with a customer's order. The upload control was not reflecting the upload status in the built-in progress-bar. It was immediately advancing to 100% and holding until the upload actually completed. After which point the user would be redirected to the appropriate destination page. This left the potential for users to become confused as to whether the browser was "locked up" and start clicking around and disrupting the upload process. The request was simple: fix the control to reflect the actual upload progress. What I encountered while trying to fix this solution was <strong>anything but simple</strong>.

<!--more-->

<h2>Cross-Domain Requests and JavaScript</h2>

This upload problem was complicated slightly by the fact that we are uploading files on a different domain from the site being hosted (e.g. the customer-facing web site is on www.imagehost.com and the upload host is photos.imagehost.com). The reason for this is the server that holds the files and needs to be accessed by employees is different from the server hosting the primary customer-facing web site. The customer was not interested in setting up a web service on the customer-facing web site to act as a proxy to the destination web service, so some work had to be done to investigate how to handle cross-domain requests with JavaScript.

{% pullquote %}

All modern browsers implement the <a href="https://developer.mozilla.org/en/Same_origin_policy_for_JavaScript" target="_blank">Same Origin Policy</a>. {" This policy was introduced as a means to help secure browsers by preventing content sharing by unrelated sites in order to maintain confidentiality and prevent loss of data. "} In this context, this means that my standard <code>XmlHttpRequests</code> that are used to invoke the AJAX calls to my remote web service will be blocked by the browser because the destination origin does not match the source web site origin. 

{% endpullquote %}

There have been two attempts to circumvent this problem: <a href="http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing" target="_blank">Cross-Origin Resource Sharing (CORS)</a> and <a href="http://en.wikipedia.org/wiki/JSONP" target="_blank">JSONP</a>. There are legitimate use cases (such as the one I'm dealing with) where submitting requests to a remote domain without proxying is preferred. Think about how web mashups work - they involve a <strong>huge</strong> amount of cross-site requests, so being able to invoke remote services <strong>without</strong> frames is essential.

The problem with JSONP is that it only supports the <code>GET</code> method and does <strong>not</strong> use <code>XmlHttpRequest</code>. However, CORS is <strong>not</strong> supported in legacy browsers, whereas JSONP does work with legacy browsers. Ultimately, I feel the level of complexity of this upload control necessitates a modern browser that supports CORS. Using <code>GET</code> to upload an image is not RESTful. By that same argument, there's enough other JavaScript on this web site that legacy browsers that don't support CORS will likely not behave correctly anyways. In short, I have no problem telling customers of this site to use a more modern browser if they wish to use the site. 

In order to support CORS, your web service has to send back certain HTTP headers that indicate to the browser what methods, origins, and other security policies are allowed by the web service. Without going into too much detail, i suggest you read a <em>much</em> better article on CORS on the <a href="https://developer.mozilla.org/en/http_access_control" target="_blank">Mozilla</a> site. 

Thankfully, the <a href="http://github.com/blueimp/jQuery-File-Upload" target="_blank">jQuery File Uploader</a> control has does support cross-domain requests in more ways than one. In fact, the <a href="http://blueimp.github.com/jQuery-File-Upload/" target="_blank">demo</a> they have posted on the site is issuing a cross-domain request from blueimp.github.com to jquery-file-upload.appspot.com. The default method is via an <code>XmlHttpRequest</code> (XHR) to a CORS-enabled web service. The alternate method is to use an iFrame transport method. According to their documentation, this is used for browsers like Internet Explorer and Opera which do not yet support XHR file uploads. However, you can configure the file upload control to <strong>force</strong> iFrame transport by using the <code>forceIframeTransport</code> option. 

This is what the previous developer had done. He was forcing the iFrame transport because he had not enabled the web service to send the CORS-required headers to allow uploads via XHR. 

<h3>Core of the Problem</h3>

I started to surmise that using the iFrame transport method instead of XHR could be causing the problem with the upload progress bar. I quickly tested this on the <a href="http://blueimp.github.com/jQuery-File-Upload/" target="_blank">Demo</a> page by issuing the following in my JavaScript console:

{% highlight js %}
$('#fileupload').fileupload('option', {
    forceIframeTransport: true
});
{% endhighlight %}

I then attempted to upload a file that would take a few seconds to upload (~5MB in size). As expected, the progress bar zipped to 100% and the page hung for several seconds while the upload finished in the background. When I reloaded the page and uploaded the same file without issuing the above JavaScript, the progress bar advanced as I would expect it to, and when it reached 100% the <code>done</code> action fired. 

{% pullquote left %}

This comes back to the original problem with cross-domain requests with JavaScript. Effectively, my iFrame request is for a different origin than my source web site. {" The ability for the JavaScript driving the file upload control to monitor the progress of the upload in an iFrame is blocked by the browser in adherence to the Same Origin Policy. "} Therefore, the best the control can do is kick off the iFrame request in an asynchronous fashion, update the progress bar to 100%, and wait for the iFrame to finish loading. Thanks go to my good friend <a href="http://dataplex.org" target="_blank">Ben Floyd</a> for reminding me of this.

{% endpullquote %}

I opted to drop the <code>forceIframeTransport</code> option and try to get things working using XHR.

<h3>Sending the Headers via an ASHX Service</h3>

As mentioned previously, the original developer spun up an ASHX service to handle this request. I feel that since this is a .Net 4.0 project we could have created an <a href="http://www.asp.net/web-api" target="_blank">ASP.NET Web API</a> project since we're dealing with JSON requests, but I'll assume that the developer is unfamiliar with the ease of those types of projects and reverted to what he knew. Fair enough argument. 

The service handler is fairly simple. Thankfully, the developer separated the front-end logic (of the service) from the business processing logic, albeit into a static method. <em>*grumbles*</em>

{% highlight csharp %}
using System;
using System.Text;
using System.Web;

namespace UploadManager
{
    public class UploadManagerHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Pragma", "no-cache");
            context.Response.AddHeader("Cache-Control", "private, no-cache");

            string action = context.Request.Params["action"];
            if (!string.IsNullOrWhiteSpace(action))
                action = action.Trim().ToLower();

            switch (action)
            {
                case "upload":
                    if (context.Request.Files == null || context.Request.Files.Count == 0)
                        context.Response.End();

                    var upload = UploadImageManager.Upload(context);
                    string json = UploadImageManager.SerializeJson(upload);

                    context.Response.AddHeader("Vary", "Accept");
                    context.Response.ContentType = context.Request["HTTP_ACCEPT"].Contains("application/json") ? "application/json" : "text/plain";
                    context.Response.Write(json);
                    context.Response.StatusCode = 200;
                    break;
                default:
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 405;
                    break;
            }

            context.Response.End();
        }
        
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
{% endhighlight %}

In order to make this web service CORS-enabled, we need to send back the <code>Access-Control-Allow-Headers</code> and the <code>Access-Control-Allow-Origin</code> headers. So, a simple refactoring led me to the following that I invoke from the <code>ProcessRequest</code> method:

{% highlight csharp %}
private void SendHeaders(HttpContext context)
{
    context.Response.AddHeader("Pragma", "no-cache");
    context.Response.AddHeader("Cache-Control", "private, no-cache");
    context.Response.AddHeader("Access-Control-Allow-Headers", "X-File-Name,X-File-Type,X-File-Size");
    context.Response.AddHeader("Access-Control-Allow-Origin", "*");
}
{% endhighlight %}

I started the debugger in Cassini and everything started working beautifully! It was time to deploy to IIS.

<h2>IIS and OPTIONS Requests</h2>

While using Cassini to test the changes to the ASHX services, I had no problems getting a successful response to the <code>OPTIONS</code> request submitted by the jQuery File Uploader. However, when I published to IIS, I ran into another wall - my <code>OPTIONS</code> request to the IIS-hosted service was <strong>not</strong> returning the custom headers <code>Access-Control-Allow-Headers</code> and <code>Access-Control-Allow-Origin</code>, despite getting a 200-level response. In fact, the request and response just showed the following headers:

{% highlight text %}
Accept:*/*
Accept-Charset:ISO-8859-1,utf-8;q=0.7,\*;q=0.3
Accept-Encoding:gzip,deflate,sdch
Accept-Language:en-US,en;q=0.8
Access-Control-Request-Headers:origin, x-file-size, x-file-name, content-type, accept, x-file-type
Access-Control-Request-Method:POST
Cache-Control:no-cache
Connection:keep-alive
Host:lionheart.local
Origin:http://localhost:49627
Pragma:no-cache
Referer:http://localhost:49627/BillOrder/PhotoPrintsUpload
User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.152 Safari/535.19
{% endhighlight %}

{% highlight text %}
Allow:OPTIONS, TRACE, GET, HEAD, POST
Content-Length:0
Date:Fri, 13 Apr 2012 13:33:33 GMT
Public:OPTIONS, TRACE, GET, HEAD, POST
Server:Microsoft-IIS/7.5
X-Powered-By:ASP.NET
{% endhighlight %}

Because I was not getting my custom errors, JavaScript was bailing out because it couldn't verify that the remote web service would authorize the cross-domain request:

<img src="/images/posts/2012-04-13-jquery-file-uploader/access-control-allow-origin.png" alt="Origin localhost:49627 is not allowed by Access-Control-Allow-Origin." />

Why weren't my custom headers coming across the wire? When I attached the debugger, I found that my ASHX web service was not even being invoked when I tried to use the control, despite seeing the <code>OPTIONS</code> request coming through my network console. I knew then that IIS was preventing or intercepting the request, so I decided to investigate the handlers for IIS. For reference, the web service is hosted on a web site with an Application Pool running .Net Framework 4 - Integrated Managed Pipeline.

<img src="/images/posts/2012-04-13-jquery-file-uploader/application-pools.png" alt=".Net Framework 4 - Integrated Managed Pipeline" />

When looking at the <strong>lionheart.local Home</strong> screen in IIS, double-click the <strong>Handler Mappings</strong>. 

<img src="/images/posts/2012-04-13-jquery-file-uploader/lionheartlocal-home.png" alt="IIS Web Site Home" />

From there, look through the list until you find a handler named <code>SimpleHandlerFactory-Integrated-4.0</code> with a path of <code>\*.ashx</code> and double-click that handler. 

<img src="/images/posts/2012-04-13-jquery-file-uploader/lionheartlocal-handlermappings.png" alt="SimpleHandlerFactory-Integrated-4.0" />

In the <strong>Edit Managed Handler</strong> window that pops up, click the <strong>Request Restrictions</strong> button.

<img src="/images/posts/2012-04-13-jquery-file-uploader/lionheartlocal-editmanagedhandlers.png" alt="Edit Managed Handlers" />

In the window that pops up (<strong>Request Restrictions</strong>), click the <strong>Verbs</strong> tab.

<img src="/images/posts/2012-04-13-jquery-file-uploader/lionheartlocal-requestrestrictions.png" alt="Request Restrictions" />

This confirms my suspicions - the handler is not setup to pass <code>OPTIONS</code> requests to the actual web service. The simple fix is to add <code>OPTIONS</code> to the list of verbs to respond. However, this is just a temporary fix, as every time I re-deploy the web service, this setting would be reverted. Thus, the more permanent fix is to add the following to the project's <code>web.config</code> (inside <code>&lt;system.webServer&gt;</code>) so that this permanently sticks:

{% highlight xml %}
<handlers>
  <remove name="SimpleHandlerFactory-Integrated-4.0" />
  <add name="SimpleHandlerFactory-Integrated-4.0" path="*.ashx" verb="GET,HEAD,POST,DEBUG,OPTIONS" type="System.Web.UI.SimpleHandlerFactory" resourceType="Unspecified" requireAccess="Script" preCondition="integratedMode,runtimeVersionv4.0" />
</handlers>
{% endhighlight %}

Upon re-deploying the service, the <code>OPTIONS</code> request finally returned the proper headers:

{% highlight text %}
Access-Control-Allow-Headers:X-File-Name,X-File-Type,X-File-Size
Access-Control-Allow-Origin:\*
Cache-Control:private, no-cache
Content-Length:0
Date:Fri, 13 Apr 2012 14:11:17 GMT
Pragma:no-cache
Server:Microsoft-IIS/7.5
X-AspNet-Version:4.0.30319
X-Powered-By:ASP.NET
{% endhighlight %}

<h2>ASHX Response.StatusCode and Response.End()</h2>

After pushing these last changes to IIS, I was able to watch the progress bar advance at the correct pace while the file upload progressed. Yet, I ran into yet <em>another</em> issue. Once the upload completed, the network response did not respond with an HTTP Success status code. In fact, it looked like from the network console in Chrome that the web service arbitrarily terminated the connection. No response headers were even registered in the network console.

I attached the debugger to the IIS process and observed that it executed the code <strong>without</strong> throwing an exception. In fact, the IIS logs show an HTTP status code value of 200. I was completely at a loss and had to think about this for about 15 minutes before checking out what <code>HttpContext.Current.Response.End()</code> was doing. I came across a <a href="http://support.microsoft.com/kb/312629/" target="_blank">Microsoft KnoweldgeBase Article</a> indicating that <code>Response.End()</code> will throw a <code>ThreadAbortException</code>. I began to think about why we even needed this invocation. All raw web services I've dealt with since .Net 2.0 have <strong>never</strong> required forcing the response to end. Simply returning from the service will wrap up all necessary ends and send the data back to the client. That's when I looked at the <a href="http://msdn.microsoft.com/en-us/library/system.web.httpresponse.end.aspx" target="_blank">MSDN Documentation</a> and found this:

{% blockquote %}
This method is provided only for compatibility with ASP—that is, for compatibility with COM-based Web-programming technology that preceded ASP.NET. If you want to jump ahead to the EndRequest event and send a response to the client, call CompleteRequest instead. To mimic the behavior of the End method in ASP, this method tries to raise a [ThreadAbortException] exception. If this attempt is successful, the calling thread will be aborted, which is detrimental to your site's performance. In that case, no code after the call to the End method is executed.
{% endblockquote %}

This isn't classic ASP, so dumping this method call was the first thing for me to do. Yet, that didn't fix the problem. I still did not receive any response headers in my network console. So, in digging around a little more, I decided to try to force send a <code>ResponseCode</code> of 200 back to the client after the upload completed. I <em>literally</em> jumped out of my seat when the upload succeeded, the network console registered a 200-level response, and kicked off the <code>done</code> event to send me to the destination confirmation page. 

The final code for the web service that made all of this work is below.

{% highlight csharp %}
using System;
using System.Text;
using System.Web;

namespace UploadManager
{
    public class UploadManagerHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            // Send the headers. If the request is for OPTIONS, end the transmission.
            SendHeaders(context);
            if (context.Request.HttpMethod.Equals("OPTIONS", StringComparison.InvariantCultureIgnoreCase))
            {
                return;
            }

            string action = context.Request.Params["action"];
            if (!string.IsNullOrWhiteSpace(action))
                action = action.Trim().ToLower();

            switch (action)
            {
                case "upload":
                    if (context.Request.Files == null || context.Request.Files.Count == 0)
                    {
                        return;
                    }

                    var upload = UploadImageManager.Upload(context);
                    string json = UploadImageManager.SerializeJson(new[] { upload });

                    context.Response.AddHeader("Vary", "Accept");
                    context.Response.ContentType = context.Request["HTTP_ACCEPT"].Contains("application/json") ? "application/json" : "text/plain";
                    context.Response.Write(json);
                    context.Response.StatusCode = 200;
                    break;
                default:
                    context.Response.StatusCode = 405;
                    break;
            }
        }

        private void SendHeaders(HttpContext context)
        {
            context.Response.AddHeader("Pragma", "no-cache");
            context.Response.AddHeader("Cache-Control", "private, no-cache");
            context.Response.AddHeader("Access-Control-Allow-Headers", "X-File-Name,X-File-Type,X-File-Size");
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
        }
        
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
{% endhighlight %}
