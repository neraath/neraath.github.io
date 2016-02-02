---
layout: post
title: "MigrateUsersToClaims - Operation is not valid due to the current state of the object"
date: 2013-04-30 11:50
comments: true
external-url: 
categories: 
- Systems Administration
tags:
- sharepoint
- claims
- identity
- migration
---

I'm in the process of migrating my customer from SharePoint 2010 to SharePoint 2013. In their SharePoint 2010 environment, they were still using classic-mode authentication, but are switching to claims-based authentication in SharePoint 2013. 

The recommended path to upgrade from 2010 to 2013 is a content and service-application database migration. This works great for us since we **have** to do this piecemeal. However, many of the general approaches for converting to claims-based authentication is to do so at the web-application level, rather than the content-database level (source: [TechNet](http://technet.microsoft.com/en-us/library/gg251985.aspx)). 

In SharePoint 2013, there's actually an ``SPWebApplication`` method dubbed [``MigrateUsersToClaims``](http://msdn.microsoft.com/en-us/library/jj172686.aspx) that takes 3 arguments: 

 * NTAccount
 * removePermissionsAfter
 * SPWebApplication.SPMigrateUserParameters

There was no guidance on the NTAccount, other than the user "performing" the operation. I opted to use the farm account to ensure it had the appropriate level of permissions. The true power of the content database migration comes in with the third parameter. We can add individual content databases to migrate with this parameter rather than worrying about the *entire* web application.

Props go to [Steve Peschka](http://blogs.technet.com/b/speschka/archive/2012/07/23/converting-a-classic-auth-content-database-to-claims-auth-in-sharepoint-2013.aspx) who originally pointed this out. However, in his post, the PowerShell to do this upgrade was the following:

{% highlight text %}
-- SNIP -- 
$wa.MigrateUsersToClaims($acc, $true, $arguments)
{% endhighlight %}

For me, that throws the error ``Exception calling "MigrateUsersToClaims" with "3" argument(s): "Operation is not valid due to the current state of the object."`` This was strange, and I couldn't figure it out. So, I cracked open the ``Microsoft.SharePoint.Administration`` dll and took a look at the ``MigrateUsersToClaims`` method:

{% highlight csharp %}
public bool MigrateUsersToClaims(NTAccount account, bool removePermissionsAfter, SPWebApplication.SPMigrateUserParameters parameters)
{
    if ((NTAccount) null == account)
        throw new ArgumentNullException("account");
    if (removePermissionsAfter && parameters != null && (parameters.HasDatabaseToMigrate || parameters.OnlyMigratePolicyUsers))
        throw new InvalidOperationException();
    // The rest
}
{% endhighlight %}

That second one was the one that I questioned. I know the conditions matched for the first two checks. The question was how my parameters looked. Sure enough:

{% highlight text %}
PS > $arguments

DatabasesToMigrate      HasDatabaseToMigrate        OnlyMigratePolicyUsers
------------------      --------------------        ----------------------
{WSS_MigrationTest_...}                 True                         False
{% endhighlight %}

With that, if I changed the middle parameter from ``$true`` to ``$false``, the migration finally ran (and completed) succesfully. 

Why did this happen? This was because my ``$acc`` user is my **farm account**. I'm also running my PowerShell session as my **farm account**. This is to ensure that I have full, unfettered access to the SharePoint Object Model and the Content Database. The middle parameter states (from [MSDN](http://msdn.microsoft.com/en-us/library/jj172686.aspx)):

{% blockquote %}
The **account** will be given the correct permissions to perform the operation. Should this permission be removed when the operation is complete.
{% endblockquote %}

We definitely don't want this for the farm account. So, my updated code, for reference:

{% highlight text %}
$wa = Get-SPWebApplication http://my-app-url
$acc = "domain\farm-account"
$arguments = New-Object Microsoft.SharePoint.Administration.SPWebApplication+SPMigrateUserParameters

$contentDb = $wa.ContentDatabase["Content Database Name"]
$arguments.AddDatabaseToMigrate($contentDb)
$wa.MigrateUsersToClaims($acc, $false, $arguments)
{% endhighlight %}

Cheers. Once again, thanks go to [Steve Peschka](http://blogs.technet.com/b/speschka/archive/2012/07/23/converting-a-classic-auth-content-database-to-claims-auth-in-sharepoint-2013.aspx) for figuring this out.
