---
comments: true
date: '2010-05-24 09:22:58'
layout: post
slug: myservicehostfactory-could-not-be-loaded-during-host-compilation
status: publish
title: MyServiceHostFactory could not be loaded during host compilation
wordpress_id: '273'
categories:
- software development
- systems administration
tags:
- automation
- c#
- nant
- wcf
---

Last Friday and this morning I had been trying to deploy the latest changes to my WCF application. As I started doing this the manual way (e.g. copying all DLLs, configs, and service endpoints into a directory to zip and send up to my web server), I took a step back and realized I needed a NAnt build target because I'm going to be doing this over-and-over again. However, after creating the build target and deploying the resulting Zip to my web server, I received a strange error message when trying to invoke my services. 
<!--more-->
The specific error message can be seen below. In a nutshell, rather than relying on the standard WCF ServiceHost to invoke my service contracts, I have custom defined a factory (dubbed <code>MyServiceHostFactory</code>) for building out my ServiceHost. However, WCF was unable to find the factory. I checked the bin/ directory and the assembly was present (<code>Coa.Accounts.Services.Host.dll</code>). I spent a good deal of time trying to figure out why this error message was being caused. The various recommendations from Google didn't work, and recompiling half a dozen times also didn't fix the problem. 

{% highlight MyServiceHostFactory Error %}
Server Error in '/2010/05/631' Application.
Parser Error
Description: An error occurred during the parsing of a resource required to service this request. Please review the following specific parse error details and modify your source file appropriately.

Parser Error Message: The CLR Type 'Coa.Accounts.Services.Host.Infrastructure.MyServiceHostFactory' could not be loaded during service compilation. Verify that this type is either defined in a source file located in the application's \App_Code directory, contained in a compiled assembly located in the application's \bin directory, or present in an assembly installed in the Global Assembly Cache. Note that the type name is case-sensitive and that the directories such as \App_Code and \bin must be located in the application's root directory and cannot be nested in subdirectories.

Source Error:

Line 1:  <%@ ServiceHost 
Line 2:  Service="Coa.Accounts.Services.ServiceImplementation.ProfileService"
Line 3:  Factory="Coa.Accounts.Services.Host.Infrastructure.MyServiceHostFactory" %>


Source File: /2010/05/631/ProfileService.svc    Line: 3

Version Information: Microsoft .NET Framework Version:2.0.50727.4200; ASP.NET Version:2.0.50727.4016
{% endhighlight %}

This is when I tried using my setup project and noticed something interesting. Although I was copying the same files to the <code>bin/</code> directory as the Setup project in Visual Studio was, the Setup project would work and not throw the error message. This is when I started paying attention to my build process. It should compile all *.cs files in my project directory. This is where the discrepancy showed up:

{% highlight NAnt Build Output %}
compile.sil.host:

      [csc] Compiling 2 files to 'C:\development\carc-accountctrl\build\bin\Coa.Accounts.Services.Host.dll'.

BUILD SUCCEEDED

Total time: 5.2 seconds.
{% endhighlight %}

There are a lot more than just 2 files in my project folder. There's actually 6 files, plus 1 commonly linked file (<code>GlobalAssemblyInfo.cs</code>). Sure enough, when I looked at my NAnt <code>csc</code> target, the sources referenced my build <strong>destination</strong> instead of the sources. A quick fix results in a fix to the problem:

{% highlight NAnt Build Output %}
compile.sil.host:

      [csc] Compiling 7 files to 'C:\development\carc-accountctrl\build\bin\Coa.Accounts.Services.Host.dll'.

BUILD SUCCEEDED

Total time: 5.2 seconds.
{% endhighlight %}

So, in a nutshell, if you receive the error listed above and are using NAnt to automate your deployment, pay attention to the fact that your build sources are correct. Thankfully this wasn't a weeklong ordeal like it could have potentially become. 
