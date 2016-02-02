---
layout: post
title: "RESTful Web Services Authentication in Zend Framework"
description: "I spent time this last weekend continuing a RESTful Web Services project for a customer of mine. One of the features I needed to implement was authentication. This post describes the reasoning behind my choice of authentication mechanism and how to implement in Zend Framework."
keywords: "php,rest,web services,restful,zend,zend framework,authentication,basic"
date: 2012-06-25 08:10
comments: true
categories: 
- software development
tags:
- php
- rest
- web services
- zend framework
- authentication
---

<img style="float: left" src="/images/posts/2012-06-25-restful-web-services-authentication-with-zend-framework/zendframework-logo.png" alt="Zend Framework" />

Over this past weekend, I spent time working on a new set of web services for an existing customer. Previously, their web services were XMLRPC based, and performed authentication by sending the username and an API key rather than a password over the wire. These web services were secured via HTTPS, but use of HTTPS was <strong>not mandatory</strong>. Since the API exposed methods that allowed you to create, read, and delete records associated with a customer, the use of this API without using SSL could be disastrous for its customers. 

We had multiple outstanding requests to convert our web services to be REST-based and have also had the request to implement OAuth. These are definitely the direction we are heading for the project, but due to resource contraints (i.e. myself being the only developer), I have to be mindful about when I can deliver value. While implementing the new RESTful services this weekend, I finally came upon the authentication requirement which caused me to question: what is the most appropriate mechanism for authenticating my identities? Read on for the justification of what authentication mechanism I decided upon and how I implemented it in Zend Framework.
<!--more-->
<h2>Possible Authentication Solutions</h2>

The business model our customer uses involves many API customer integrations. While the majority are single customer API integrations (i.e. volume customers who bill against a single account), we are starting to have more interest from third parties who want their customers to integrate their personal accounts with our service. Sound familiar? Of course it does - many great web services on the internet do that already. Facebook, LinkedIn, Flickr, and many more online services have integrations with countless numbers of third party providers. However, customers don't wish to share their Facebook password with all of these third party sites. How do they let the third party site consume their data on their behalf (term: impersonate)?

<h3>OAuth</h3>



They use an open protocol called <a href="http://oauth.net/" target="_blank">OAuth</a>.  OAuth is a clever way of performing a handshake and passing signed messages between servers to obtain an access token to perform activities on behalf of the requestor.  Your password is entered only at the site where the password is stored, yet the site requesting access will still be able to access your data in a secure way as if it were you accessing the data. 



OAuth is the perfect solution to my authentication problem. There's just one issue: it takes time to setup and implement correctly. In no particular order, the steps include:
<ul>
<li>Setting up database tables to store:
<ul>
<li>Registered OAuth Consumers</li>
<li>Consumer Requests</li>
<li>Consumer Access Tokens</li>
</ul></li>
<li>Writing a web site to handle user requests</li>
<li>Writing the backend supporting logic to handle requests and access tokens</li>
<li>Implementing a workflow for registering OAuth consumers</li>
</ul>
That's a tremendous number of tasks. While I would love to fully implement an OAuth provider, I just do not have the time. It would easily take me a couple of weeks at the pace I currently work (about 15 hours per week). So, I have to consider alternative options. 

<h3>HTTP Basic vs. Sessions</h3>

The simplest solution is to send the username and password with each request using <a href="http://en.wikipedia.org/wiki/Basic_access_authentication" target="_blank">HTTP Basic</a>. It's quick to implement, it doesn't require any complex behaviors on the client or the server (unlike OAuth), and it's widely supported by every browser and HTTP client. Here's what a raw request would look like using Basic authentication:

{% highlight text %}
GET /api/request/12345 HTTP/1.1
Host: api.example.com
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
{% endhighlight %}

It's very simple and light. Now, to the naked eye, you can't see that the username is <strong>Aladdin</strong> and the password is <strong>open sesame</strong>. However, that encoded string is simply Base64 encoded version of <strong>Aladdin:open sesame</strong>. Essentially, it's plain text, meaning anyone along the way to the destination can sniff the header and get my username and password. This is a significant concern, but is lessend when you <strong>enforce</strong> SSL connectivity. However, the risk is still there. Traditional security practices dictate that as the frequency of the transmission of credentials increases, so does the risk of them being compromised, especially if those credentials are in plain text. Thus, from a security perspective, HTTP Basic Authentication is not the best solution. The general security recommendation is if you can minimize the number of times your credential goes across the wire, the risk decreases. 

Many posts online give consideration to having a single RESTful resource perform authentication and create a session for the user. Thus, the username and password would be sent down <em>once</em> at the beginning of the session. A cookie is then sent back each subsequent time to identify the user's session. This is something I absolutely don't like: RESTful web services are supposed to be state-less. Therefore, having a session active for any period of time violates this principle. Another argument in favor of using this method of authenticating clients is it reduces the request body. Again, in order for a session to be stateful over HTTP, you have to submit a cookie with <strong>each</strong> request. Cookies are fairly small in size, but when you compare that to a username/password combination in HTTTP Basic sent on every request - it's about the same size. 

<h3>HMAC</h3>

<img style="float: right" src="/images/posts/2012-06-25-restful-web-services-authentication-with-zend-framework/amazon-web-services-logo.png" alt="Amazon Web Services" />

<a href="http://aws.amazon.com/" target="_blank">Amazon's AWS</a> took a very interesting approach to dealing with security, called <a href="http://en.wikipedia.org/wiki/Hash-based_message_authentication_code" target="_blank">Hash-based Message Authentication Code (HMAC)</a>. The idea is very similar to how RSA encryption works (e.g. your standard SSL encryption when working with web sites). <a href="http://docs.amazonwebservices.com/AmazonS3/latest/dev/RESTAuthentication.html" target="_blank">Amazon's specific implementation</a> relies on a prior exchange of public and private keys that only the client and the server should know. The idea is the request body plus some additional parameters (such as date, user id, etc.) are hashed using the private key. This payload is sent to the server, where the server generates the same hash from the request body (including those parameters) and checks to see if the hash matches. If it does, it executes the request. Riyad Kalla wrote an <em>excellent</em> <a href="http://www.thebuzzmedia.com/designing-a-secure-rest-api-without-oauth-authentication" target="_blank">blog post</a> explaining this in much greater detail that I suggest you check out.

From a security perspective, this definitely solves the problem with not sending credentials over the wire. It's simpler than implementing OAuth, as I don't need additional database tables to support requests and access tokens. Yet, the work necessary on <em>both</em> the client and server-side is much more significant than HTTP Basic authentication. I can implement this solution in a reasonable amount of time. However, I'm significantly concerned about user adoption of the new services. For them to have to learn and implement HMAC to ensure absolutely secure web services will certainly drive-down the number of users who are willing to consume my web services. It's possible they still will consume my services. Plus, the security-conscious will love this as a solution. 

<h2>Considerations</h2>

All in all, I had several options to weigh. One of the first that had to be considered was how secure my customer's credentials really needed to be. What types of services am I securing with their credentials? In reality, the type of content being secured is <em>not</em> highly classified materials or supremely private, personally-identifyable information. They are basic requests to start, or check on, a workflow. Future service offerings through this API will allow interactions such as managing your account, getting lists of completed workflows (and associated data), but will still be low-risk information. 

In short, I opted to use HTTP Basic authentication. I plan on <strong>enforcing</strong> SSL connections to the web service. While this is still subject to main-in-the-middle attacks and can result in exposure of a user's credentials, the risk and gains of doing that are low enough to warrant this as an acceptable solution. Some customers may totally dislike this as an option, and that's fine. They can continue using the just-as-insecure XMLRPC services until I have a chance to spin up OAuth. 

<h2>Implementing in Zend Framework</h2>

Thankfully, Zend Framework makes adding a provider VERY easy. By creating a class that extends <code>Zend_Controller_Plugin_Abstract</code>, we can hook into the <code>preDispatch</code> pipeline and validate the <code>Authorization</code> header at that point. The code sample shown at the end of this post is fairly self-explainatory. However, I'll break it down here. 

<h3>Checking for Authorization Header</h3>

We first need to check to make sure the header even exists <strong>and</strong> is in the proper format. The proper format is Base64 encoded, with the username and password being separated by a colon. That's what the following bit of code does. <strong>Note:</strong> the <code>_redirectNoAuth</code> and <code>_redirectInvalidRequest</code> are helper methods to forward to the appropriate error controller actions.

{% highlight php %}
$authorizationHeader = $request->getHeader(self::AUTHORIZATION_HEADER); 
if ($authorizationHeader == null || $authorizationHeader == '') {
    $this->_redirectNoAuth($request);
    return;
}

$authorizationHeader = base64_decode($authorizationHeader);
if (!preg_match('/[^\:]*\:.*/i', $authorizationHeader)) {
    $this->_redirectInvalidRequest($request);
    return;
}
{% endhighlight %}

From there, we extract the username and password from the authorization header and attempt to authenticate. The <code>\My\Auth\Adapter</code> is a <code>\Zend_Auth_Adapter_Abstract</code>, so the logic of authenticating our users is encapsulated there. 

{% highlight php %}
$authorizationParts = explode(':', $authorizationHeader);
$username = $authorizationParts[0];
$password = $authorizationParts[1];

try {
    $authAdapter = new \My\Auth\Adapter($this->_customreRepository, $username, $password);
    if ($authAdapter->authenticate() != \Zend_Auth_Result::SUCCESS) {
        $this->_redirectNoAuth($request);
        return;
    }

    $user = $this->_customerRepository->findOneByUsername($username);
    \Zend_Registry::set(self::IDENTITY_KEY, $user);
} catch (\Exception $e) {
    $this->_redirectNoAuth($request);
    return;
}
{% endhighlight %}

At the end of that try block, you'll notice that I use the customer repository to fetch the user by his username and store that in the <code>\Zend_Registry</code>. This is for use later in the APIs when I need to know which user has authenticated with the service, so I can apply authorization constraints against that user. That's ultimately the only reason you'll notice the <code>\Doctrine\ORM\EntityManager</code> and the <code>\My\Entity\Repository\CustomerRepository</code> being used in this class. It's consumed by our authentication adapter and used to find the entity when we've authenticated them.

That's pretty much it. I welcome any feedback or suggestsions to this article!
