---
comments: true
date: '2008-01-04 13:01:52'
layout: post
slug: crystal-reports-error
status: publish
title: Crystal Reports Error
wordpress_id: '97'
categories:
- software development
tags:
- c#
- code
- windows
- crystal reports
---

<h1>Background</h1>
Well, as many of you have known, I've been working on projects that involve the dark side - that being Microsoft projects. Yes, this means I've been working on .Net applications in both Visual Basic and C#. The C# applications are kinda fun to work with, but I still maintain that VB is a ridiculous language, despite the fact that both VB and C# compile to the same intermediate code. 

In any case, I've been working on a legacy application that uses Crystal Reports to handle it's reporting. For anyone looking for an opinion on Crystal Reports - don't get it and don't even think about touching it with a 10 foot pole. It's nasty, bulky, and <strong>extremely</strong> difficult to install and configure with applications appropriately. This is the whole purpose of this post. 

<h1>Environment</h1>
This application is being run on a Windows Server 2003 w/ Service Pack 2 server behind a firewall accessible only through VPN. Visual Studio .Net and Crystal Reports 8 and 10 are installed on the server (read below why this is, I won't explain here). This project has no project or solution file, as it was written in 2003 and the developer in-charge had a certain way of running projects for the web, which was not the most ideal. Needless to say, he's no longer with the group. :-D

<h1>The Problem</h1>
When trying to run the application, I get the following nice 500 level error message from IIS:

{% highlight text %}
Server Error in '/' Application.
Cannot find KeycodeV2.dll, or invalid keycode.
Description: An unhandled exception occurred during the execution 
of the current web request. Please review the stack trace for more 
information about the error and where it originated in the code.

Exception Details: CrystalDecisions.CrystalReports.Engine.InternalException: 
Cannot find KeycodeV2.dll, or invalid keycode.
{% endhighlight %}

Fun. So, I spent about 4 hours yesterday and an hour this morning looking up what the possible answer could be. One of the first things I see on Google is people mentioning the addition of certain Merge Modules to the solution for the project. Such an example can be found on the <a href="http://www.vbcity.com/forums/topic.asp?tid=67989">vbCity/devCity.Net Forums</a>. However, this solution doesn't apply in my case because of the following reasons:
<ol><li>We aren't using solution files.</li><li>I've never seen any merge module packages installed or added to any part of the large project.</li><li>We aren't "deploying" the application, but rather are putting it on a server that is setup like the developer workstation, ie: Visual Studio .Net (2002) is installed, the developer edition of Crystal Reports 8 and 10 are installed.</li></ol>

Please refrain from making comments regarding all of the atrocities listed above. I understand that this project is awry and should be scrapped, remade, yadda yadda. However, I have voiced these concerns to the appropriate individuals and we have to get approval from our customer before proceeding with said fix. 

So, what other possible solutions for this problem could exist, I wonder? More Googling yields a potentially worthwhile solution which requires access to the registry. That's fine with me, as I'm used to working in the registry. This <a href="http://technicalsupport.businessobjects.com/KanisaSupportSite/search.do?cmd=displayKC&docType=kc&externalId=c2011205&sliceId=&dialogID=14028857&stateId=1%200%2014030461">BusinessObjects Knowledgebase article</a> stated that I need to modify the following 2 registry keys and give access to the user that ASP.NET is running as. The keys are:
<ul><li>HKEY_CLASSES_ROOT\Interface\{4A4D268A-DF9B-4FC1-8301-D9FEEEF69F9C}</li><li>HKEY_CLASSES_ROOT\TypeLib\{8D43D0B9-C14E-4577-9E67-A9A1EEF82302}</li></ul>When I gave the ASP.NET user read access to the files, I then reloaded the page and got the same error message. Reading the article further revealed that I had to register the keycodev2.dll file via regsvr32. Well, upon issuing the following command:

{% highlight text %}Regsvr32 "C:\Program Files\Common Files\Crystal Decisions\1.0\bin\keycodev2.dll"{% endhighlight %}

I get the following error message:

{% highlight text %}
DllRegisterServer in 
C:\Program Files\Common Files\Crystal Decisions\1.0\bin\keycodev2.dll failed. 
Return code was: 0x8002801c
{% endhighlight %}

The knowledgebase article then stated that I needed to look at <a href="http://technicalsupport.businessobjects.com/KanisaSupportSite/search.do?cmd=displayKC&docType=kc&externalId=c2012603&sliceId=&dialogID=14028959&stateId=1%200%2014030531">another Knowledgebase Article</a> which turned out to be total nonsense. So, back to Google. 

I then found this absolutely brilliant article that discussed a <a href="http://www.cryer.co.uk/brian/windows/trbl_nt_rgsvrfld8002801c.htm">potential solution</a> to the error listed above. However, this sent me jumping through hoops to try to look at the dependencies of the <strong>keycodev2.dll</strong> file and then try to monitor the registry entries that were being hit, only to reveal no such luck. So, I continued looking for another solution online and found yet another Knowledgebase article that discussed a <a href="http://technicalsupport.businessobjects.com/KanisaSupportSite/search.do?cmd=displayKC&docType=kc&externalId=c2010681&sliceId=&dialogID=14024906&stateId=1%200%2014022829">fix when deploying a Crystal Reports application</a>. This didn't resolve or even come close to the overall issue, but I finally found a <a href="http://technicalsupport.businessobjects.com/KanisaSupportSite/search.do?cmd=displayKC&docType=kc&externalId=http--supportbusinessobjectscom-communityCS-TechnicalPapersNoNav-crnetkeycodev2pdfasp&sliceId=&dialogID=14028009&stateId=1%200%2014022865">PDF article</a> that was right up the alley of what I was trying to do, especially in terms of hosting the application. Unfortunately, it contained the same bit of information that the first knowledgebase article had in it. But, there was something in the article that made me realize what the problem was - access to the registry.

<h1>Potential Solution</h1>
I had known this entire time that my user account had Administrative privileges. Unfortunately, Administrative privileges doesn't always mean that everything is readable and writable by the Administrator. Sure enough, when I looked back at those registry keys listed above, neither had even <strong>read</strong> access for the Administrator. I quickly gave the Administrator account <strong>Full Control</strong> and made sure it permeated to all subkeys under each of those keys listed above. I reran the regsvr32 command listed above and v'oila! The DLL registered successfully!
