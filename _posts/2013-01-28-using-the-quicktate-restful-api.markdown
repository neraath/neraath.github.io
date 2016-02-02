---
layout: post
title: "Using the Quicktate RESTful API"
date: 2013-01-28 00:17
comments: true
external-url: 
categories: 
- software development
---

[Quicktate](http://www.quicktate.com/) is a service for which I've been consulting for since 2009. We have recently released a new [RESTful API](https://api.quicktate.com) to help make integrating with the service a *breeze*. That said, while our new [RESTful API documentation](https://api.quicktate.com/v1/api/index.html) uses [Swagger](http://developers.helloreverb.com/swagger/) to generate our service documentation, many of the common RESTful semantics we rely on are completely missing from that documentation. Until we figure out an easier way to convey that information via Swagger, here's some basic information on how to get around the API.
<!--more-->
Authentication
--------------
All requests currently are performed using HTTP Basic authentication. While we are still developing our OAuth provider and intend to use that as our primary mechanism for authenticating users, we currently are accepting your username and password via a standard HTTP Basic Authorization request. As a raw HTTP header, you are looking at the following for authenticating as ``demo@quicktate.com`` with password ``Test1234%``:

```
Authorization: Basic ZGVtb0BxdWlja3RhdGUuY29tOlRlc3QxMjM0JQ==
```

As a cUrl request, you'll be looking at using the ``-u demo@quicktate.com:Test1234%`` argument to the command.

Transcription Requests
----------------------
The basis of Quicktate is transcriptions. However, while there is a ``/transcription`` resource for our API, you don't actually create transcriptions - that's the job of our typists. Instead, you submit a ``/transcriptionrequest`` to Quicktate and operate on that request until a typist has completed transcribing and turns it into a ``/transcription``. 

So, we expect very little in the HTTP headers for this type of request. Because you're creating a new Transcription request, the method will be ``POST``. What's most important is the body of the request. Most developers are used to submitting the request as a form request, to where in a PHP application, the variables will come across in ``$_POST``. In this case, however, we expect the body of the message to be either XML or JSON (as indicated in the ``Content-Type`` header). 

What should be in the body of the message? The transcription request. When creating a transcription request for the first time, you'll need to supply us with the following information:

<table cellspacing="0" cellpadding="1" border="1">
<tr><td>Field Name</td><td>Required?</td><td>Description</td></tr>
<tr><td>callbackDestination</td><td>No</td><td>The URL or e-mail address where a callback should occur upon completion of the transcription.</td></tr>
<tr><td>``callbackMethod``</td><td>No *</td><td>The way the callbackDestination should be invoked. This is mandatory if callbackDestination is specified. Valid values include: ``HTTPPOST``, ``RESTPOST``, ``XMLRPC``, ``EMAIL``.
<tr><td>``metadata``</td><td>No</td><td>Your custom metadata for this transcription request. This is sent back to you in the callback so that you have data you can trace back to some internal identifier or record.</td></tr>
<tr><td>``language``</td><td>Yes</td><td>Pretty self-explainatory. Valid values are: 1 = English, 2 = Spanish. Others on the way!</td></tr>
<tr><td>``audiourl``</td><td>Yes</td><td>The URL of the audio file you wish to be downloaded and transcribed. Must be accessible from the internet. This is required if no ``audiodata`` is present.</td></tr>
<tr><td>``audiodata``</td><td>Yes</td><td>A Base 64 encoded block of the audio file to be transcribed. This is required if no ``audiourl`` is present.</td></tr>
</table>

So, a sample HTTP request might look like the following:

```
POST /v1/api/transcriptionrequest HTTP/1.1
Authorization: Basic ZGVtb0BxdWlja3RhdGUuY29tOlRlc3QxMjM0JQ==
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5
Host: api.quicktate.com
Accept: application/json
Content-Type: application/json
Content-Length: 208

{ 
  "callbackDestination": "https://private.host.callback.com/callback-url.php",
  "callbackMethod": "HTTPPOST",
  "metadata": "My custom metadata",
  "language": 1,
  "audiourl": "http://www.quicktate.com/audio.wav"
}
```

or from cUrl it would look like the following:

```
curl -u demo@quicktate.com:Test1234% -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{ "callbackDestination": "https://private.host.callback.com/callback-url.php", "callbackMethod": "HTTPPOST", "metadata": "My custom metadata", "language": 1, "audiourl": "http://www.quicktate.com/audio.wav" }' -v https://api.quicktate.com/v1/api/transcriptionrequest
```

The response I'm likely to receive back will look like the following:

```
HTTP/1.1 201 Created
Server: nginx
Date: Mon, 28 Jan 2013 06:14:43 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/5.3.17-1~dotdeb.0
Vary: Accept
Access-Control-Max-Age: 86400
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, X-Authorization, Origin, Accept, Content-Type, X-Requested-With, X-HTTP-Method-Override
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
Location: /v1/api/transcriptionrequest/14967237
```

What's important to realize is that you will only have a successful request submitted when the status code returned is a 201. If you get a 400-level error message, check which one. If it's a 401 or a 403, then you are not sending the proper credentials. If it's just a 400 error, then you need to look at how you're sending your data to the API, because the API doesn't recognize the payload. 

Once you've gotten past that, you may be wondering, how do I access the transcription request now? There is **no** body to this whatsoever. This is one of those REST semantics at play. If you look in the return headers, there is a ``Location`` header which specifies exactly where you can access your ``transcriptionRequest``. Simply submit a ``GET`` request to that URL and you'll find the status of your transcriptionRequest. The response will look something similar to the following:

```
HTTP/1.1 200 Success
Server: nginx
Date: Mon, 28 Jan 2013 06:14:43 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/5.3.17-1~dotdeb.0
Vary: Accept
Access-Control-Max-Age: 86400
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, X-Authorization, Origin, Accept, Content-Type, X-Requested-With, X-HTTP-Method-Override
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS

{
  "id": 14967237,
  "callbackDestination": "https://private.host.callback.com/callback-url.php",
  "callbackMethod": "",
  "status": 0,
  "metadata": "Represents an unprocessed audio file. ",
  "datePosted": "2012-12-01T01:23:45-0600",
  "language": 99,
  "audiodata": null,
  "audiourl": null
},
```

Completed Transcriptions
------------------------
That is, until your transcription is complete. Once your transcription is complete, the resource URL will permanently move. As a result, you'll see the status code for the previous URL change from 200 to 302, indicating that it's been permanently moved. Fortunately, we point you in the direction of where you need to go again, through the ``Location`` header:

```
HTTP/1.1 302 Moved
Server: nginx
Date: Mon, 28 Jan 2013 06:14:43 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/5.3.17-1~dotdeb.0
Vary: Accept
Access-Control-Max-Age: 86400
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, X-Authorization, Origin, Accept, Content-Type, X-Requested-With, X-HTTP-Method-Override
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
Location: /v1/api/transcription/14967237
```

When you submit a ``GET`` request to the ``Location`` URL listed above, your payload will look like the following:

```
HTTP/1.1 200 Success
Server: nginx
Date: Mon, 28 Jan 2013 06:14:43 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/5.3.17-1~dotdeb.0
Vary: Accept
Access-Control-Max-Age: 86400
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, X-Authorization, Origin, Accept, Content-Type, X-Requested-With, X-HTTP-Method-Override
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, HEAD, OPTIONS

{
  "id": 14967243,
  "metadata": "Represents a processed audio file. ",
  "datePosted": "2012-12-01T01:23:45-0600",
  "dateCompleted": "2012-12-01T01:25:30-0600",
  "wordcount": null,
  "language": 99,
  "transcription": "This is a completed transcription request."
}
```

More to Come
------------
Hopefully by next week, I'll have another writeup on how to interact with your transcription requests before we begin processing them. 
