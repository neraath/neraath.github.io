---
layout: post
title: SharePoint REST API Authentication from Java
modified: 2016-03-31 20:00:00
categories: SharePoint
excerpt:
tags: [sharepoint,rest,authentication,java,kerberos]
image:
  feature:
date: 2016-03-31T14:20:59+00:00
---
Each enterprise has many languages they use to solve their technology problems. C# and Java are the predominate languages used in most enterprises. However, I have noticed a distinct difference between these two types of developers. Enterprises that use Microsoft Active Directory have very little problem with authentication for applications developed using C# (or Visual Basic). [NTLM](https://msdn.microsoft.com/en-us/library/windows/desktop/aa378749(v=vs.85).aspx) and [Kerberos](https://msdn.microsoft.com/en-us/library/windows/desktop/aa378747(v=vs.85).aspx) are natively supported for authentication by all .Net applications. Authentication looks like the following (C#):

{% highlight c# %}
var handler = new System.Net.Http.HttpClientHandler() { UseDefaultCredentials = true };
using (var client = new System.Net.Http.HttpClient(handler)) 
{
    // Make some remote API call
}
{% endhighlight %}

It is literally one property to set on most networking libraries. Even when you do not want to use default credentials, there are a rich set of libraries, particularly the ``System.Net.NetworkCredential`` class that enables better authentication. Now here is the question: which authentication scheme are you using with this? NTLM, or Kerberos? 

For Java developers, however, the problem was much more complex. I had many Java developers reaching out to me to understand how to properly authenticate to SharePoint. They assumed they had to use NTLM to authenticate to SharePoint. And indeed, the default way web applications are setup for SharePoint is with NTLM. However, many enterprises whom have hybrid Linux and Windows environments need to use Kerberos as their primary authentication system, as Kerberos works far better on Linux than NTLM. 

The purpose of this article is to share how to authenticate Java applications with SharePoint using Kerberos in order to consume SharePoint REST APIs. I did not have extensive experience writing software in Java, much less Java for the enterprise - so these notes may simplify some concepts that are well-known to Java developers. However, if this problem were so easy to solve, why did I have so many Java developers reaching out to me to help them figure out how to solve it? 

**Note:** This article assumes the SharePoint environment you are connecting is properly setup for Kerberos authentication. This includes ensuring that the web application is configured for Kerberos authentication, and all [SPNs](https://msdn.microsoft.com/en-us/library/windows/desktop/ms677949(v=vs.85).aspx) are properly registered. 

**Additional Note:** For brevity, the code snippets here are greatly simplified and intentionally void of error handling.

Jumping to Code
---------------
I first attempted to understand this problem by writing some code that was meant to just connect to a SharePoint REST service and get data. This is my most basic implementation, which you can see is void of really any authentication details. Keep it simple stupid, right? 

{% highlight java %}
public class BasicSharePointRestClient {
    private static final ObjectMapper mapper = new ObjectMapper();
    protected final String BaseUrl;

    public BasicSharePointRestClient(String baseUrl) { BaseUrl = baseUrl; }

    public String get(String targetApi) throws Exception {
        Response response = Request.Get(BaseUrl + targetApi)
                                   .addHeader("Accept", "application/json;odata=verbose")
                                   .execute()

        // The request would been unauthorized. httpResponse.getStatusLine().getStatusCode == 401
        HttpResponse httpResponse = response.returnResponse();
        String results = EntityUtils.toString(httpResponse.getEntity());
        return results;
    }
}
{% endhighlight %}

Needless to say, the above code did not work. At the point where the request was executed, the HTTP response status code would be ``HTTP 401 UNAUTHORIZED``, indicating that authentication credentials were *not* sent in the originating request. 

Iteration 2
-----------
After further research, I stumbled upon some samples that were posted online. I tinkered with those samples and resulted in the following class. This was my first attempt which *really* worked:

{% highlight java %}
public class HttpClientForSharePoint extends BasicSharePointRestClient {
    public HttpClientForSharePoint(String baseUrl) { super(baseUrl); }

    @Override
    public String get(String targetApi) throws Exception {
        DefaultHttpClient httpClient = new DefaultHttpClient();
        httpClient.getAuthSchemes().register(AuthPolicy.SPNEGO, new SPNegoSchemeFactory());

        Credentials useJaasCredentials = new Credentials() {
            public String getPassword() { return null; }
            public String getUserPrincipal() { return null; }
        };

        httpClient.getCredentialsProvider().setCredentials(
            new AuthScope(null, -1, null),
            useJaasCredentials
        );

        HttpUriRequest request = new HttpGet(BaseUrl + targetApi);
        request.addHeader("Accept", "application/json;odata=verbose");

        HttpResponse response = httpClient.execute(request);
        HttpEntity entity = response.getEntity();
        String results = EntityUtils.toString(entity);
        return results;
    }
}
{% endhighlight %}

I ended up with a proper JSON response (returned as a string) from this. However, there were several things I did not like about this implementation:

 - The method ``get()`` had too many responsibilities. It was responsible for configuring authentication as well as executing a REST call. 
 - The authentication was limited to only [SPNEGO](https://en.wikipedia.org/wiki/SPNEGO), which is a negotiated authentication mechanism of Kerberos first, falling back to NTLM. What happens if I want to use only Kerberos? Or multiple types of authentication? 

Iteration Three 
---------------
I continued doing more research and resulted in finding the following, slightly more complex and alternative way to do this. It was derived from the works of the [Spring Security Kerberos Client](https://github.com/spring-projects/spring-security-kerberos/blob/master/spring-security-kerberos-client/src/main/java/org/springframework/security/kerberos/client/KerberosRestTemplate.java):

{% highlight java %}
public class BuilderSharePointRestClient extends BasicSharePointRestClient {
    public BuilderSharePointRestClient(String baseUrl) { super(baseUrl); }

    @Override
    public String get(final String targetApi) throws Exception {
        LoginContext lc = new LoginContext("SharePoint", new TextCallbackHandler());
        lc.login();
        Subject serviceSubject = lc.getSubject();
        return Subject.doAs(serviceSubject, new PrivilegedAction<String>() {
            @Override
            public String run() {
                HttpClient httpClient = getHttpClient();
                try {
                    HttpUriRequest request = new HttpGet(BaseUrl + targetApi);
                    request.addHeader("Accept", "application/json;odata=verbose");
                    HttpResponse response = httpClient.execute(request);
                    HttpEntity entity = response.getEntity();
                    String results = EntityUtils.toString(entity);
                    EntityUtils.consume(entity);
                    return results;
                } catch (Exception e) {
                    return "";
                }
            }
        });
    }

    private HttpClient getHttpClient() {
        HttpClientBuilder builder = HttpClientBuilder.create();
        Lookup<AuthSchemeProvider> authSchemeRegistry = RegistryBuilder.<AuthSchemeProvider>create()
                .register(AuthSchemes.KERBEROS, new KerberosSchemeFactory())
                .register(AuthSchemes.NTLM, new NTLMSchemeFactory())
                .register(AuthSchemes.SPNEGO, new SPNegoSchemeFactory())
                .build();
        builder.setDefaultAuthSchemeRegistry(authSchemeRegistry);

        Credentials useJaasCredentials = new Credentials() {
            public String getPassword() { return null; }
            public Principal getUserPrincipal() { return null; }
        };
        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(new AuthScope(null, -1, null), useJaasCredentials);
        builder.setDefaultCredentialsProvider(credentialsProvider);
        return builder.build();
    }
}
{% endhighlight %}

The above class worked like a charm, and provided the best of single responsibility (although the private method should be moved to a different class), but nevertheless simplified the responsibilities of each method. 

Configuring Java How to Authenticate Using Kerberos
===================================================
Authentication in Java is performed by the [Java Authentication and Authorization Service (JAAS)](http://docs.oracle.com/javase/7/docs/technotes/guides/security/jaas/JAASRefGuide.html). JAAS has a number of "defaults" that it uses when attempting to perform authentication, including Kerberos. We need to get an understanding of how Java authenticates using Kerberos within your corporate environment. This is dictated by two files, the ``login.conf`` and the ``krb5.conf`` file. 

First, let us look at the [``login.conf`` file](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/tutorials/LoginConfigFile.html). From what I can tell, this file has no default "global" configuration, so you will need to create it from scratch. It has the following format:

{% highlight text %}
<packagename.entryclass> {
    <loginmodule> <flags> <loginmodule options>;
}
{% endhighlight %}

The following is my ``login.conf`` for the classes above (and classes I depend upon). It may be overkill, but it works:

{% highlight text %}
com.sun.security.jgss.login {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
com.sun.security.jgss.initiate {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
com.sun.security.jgss.accept {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
net.chrisweldon.SharePoint.BasicSharePointRestClient {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
net.chrisweldon.SharePoint.HttpClientForSharePoint {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
net.chrisweldon.SharePoint.BuilderSharePointRestClient {
    com.sun.security.auth.module.Krb5LoginModule required client=TRUE useTicketCache=true;
};
{% endhighlight %}

The second file is the [``krb5.conf`` file](http://web.mit.edu/kerberos/krb5-1.13/doc/admin/conf_files/krb5_conf.html). This file is the kerberos configuration file, which tells what domains and realms are supported for authentication via Kerberos. The documentation (and purpose) of this file can get fairly complex given the corporate environment. However, if yours is setup correctly, you may not need to make any changes. 

The default ``krb5.conf`` file is located at ``%JAVA_HOME%\lib\security\krb5.conf``. If you open it up, it may look like the following:

{% highlight text %}
[libdefaults]
    default_realm = CORP.CHRISWELDON.NET

[domain_realm]
    .corp.chrisweldon.net = CORP.CHRISWELDON.NET
    .othercorp.chrisweldon.net = OTHER.CHRISWELDON.NET

[realms]
    CORP.CHRISWELDON.NET = {
        dns_lookup_realm = true
        dns_lookup_kdc = true
        kdc = KDC.CHRISWELDON.NET
    }

    OTHER.CHRISWELDON.NET = {
        dns_lookup_realm = true
        dns_lookup_kdc = true
        kdc = OTHERKDC.CHRISWELDON.NET
    }
{% endhighlight %}

What this means is if I try to authenticate to a host that has a domain suffix of either ``.corp.chrisweldon.net`` (e.g ``sharepoint.corp.chrisweldon.net``) or ``.othercorp.chrisweldon.net`` (e.g. ``exchange.othercorp.chrisweldon.net``), Kerberos libraries will know what KDC servers to perform the authentication against. 

Now, suppose you have a machine that is in your enterprise, but has an alias for a different domain, such as ``sharepoint.chrisweldon.com``. Even if that server is connected to the ``CORP.CHRISWELDON.NET`` domain in Active Directory, the fact that you have an alias not listed in your ``krb5.conf`` file will cause you issues. So, copy the default ``krb5.conf`` file to your project directory and edit it to look like the following:

{% highlight text %}
[libdefaults]
    default_realm = CORP.CHRISWELDON.NET

[domain_realm]
    .corp.chrisweldon.net = CORP.CHRISWELDON.NET
    .othercorp.chrisweldon.net = OTHER.CHRISWELDON.NET
    .chrisweldon.com = CORP.CHRISWELDON.NET # this is the addition

[realms]
    CORP.CHRISWELDON.NET = {
        dns_lookup_realm = true
        dns_lookup_kdc = true
        kdc = KDC.CHRISWELDON.NET
    }

    OTHER.CHRISWELDON.NET = {
        dns_lookup_realm = true
        dns_lookup_kdc = true
        kdc = OTHERKDC.CHRISWELDON.NET
    }
{% endhighlight %}

You are ready to execute your Java application! Simply specify the following arguments to ensure your app is looking at your custom configuration files and it will be authenticating to SharePoint! 

{% highlight text %}
-Djava.security.krb5.conf=C:/path/to/custom/krb5.conf -Djavax.security.auth.useSubjectCredsOnly=false -Djava.security.auth.login.config=C:/path/to/custom/login.conf
{% endhighlight %}
