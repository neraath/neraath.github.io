---
layout: post
title: "Getting the confusing SharePoint 2013 SocialDataStoreException"
description: "Ran into a bit of a problem figuring out an exception I received while writing a SharePoint 2013 apps."
keywords: "SharePoint,SharePoint 2013,social,socialdatastoreexception,javascript,jsom,client object model,tenant"
date: 2013-05-06 11:34
comments: true
external-url: 
categories: 
- Software Development
tags:
- sharepoint
- 2013
- sp2013
- social
- socialdatastoreexception
- javascript
- client object model
- tenant
---
As I was writing an app using the new SharePoint 2013 app model the other day, I ran into an issue when I was trying to follow a site automatically through JavaScript:

{% highlight text %}
The target of the operation was not found. Internal type name: Microsoft.Office.Server.UserProfiles.SocialDataStoreException. Internal error code: 0.
{% endhighlight %}

<!--more-->
The problem seemed fairly straight-forward. The targeted site I wanted to follow couldn't be found. However, it didn't make sense. The instance URL I was targeting (https://chrisweldon.sharepoint.com) did in fact exist. Furthermore, I was not already following that site. So, why was this failing? 

Let's take a look at some code:

{% highlight javascript %}
SP.SOD.executeOrDelayUntilScriptLoaded(userProfilesLoaded, 'SP.UserProfiles.js');

function userProfilesLoaded() {
    SP.SOD.executeFunc('userprofile', 'SP.Social.SocialFollowingManager', followSites);
}

function followSites() {
    var context = SP.ClientContext.get_current();
    var socialManager = new SP.Social.SocialFollowingManager(context);
    var socialSite = new SP.Social.SocialActorInfo();
    socialSite.set_contentUri("https://chrisweldon.sharepoint.com");
    socialSite.set_actorType(SP.Social.SocialActorType.site);
    socialManager.follow(socialSite);

    context.executeQueryAsync(
        function() { alert('Sites followed!'); }, 
        function(sender, args) { alert('Error: ' + args.get_message()); });
}
{% endhighlight %}

This is fairly straight-forward. I simply setup a social actor to follow and call out to the ``SocialFollowingManager`` to attempt to follow that site. This is when I thought, perhaps this is a permissions problem? I'm trying to have the JavaScript object model *write* a request to the Social datastore. Perhaps it wasn't authorized. 

I changed the permissions in my ``AppManifest.xml`` from **Read** to **Write**:

| Scope                  | Permission |
|------------------------|------------|
| User Profiles (Social) | Write

Sadly, I received the same error message. However, if you read the [MSDN Documentation on Developing Social Features in SharePoint 2013](http://msdn.microsoft.com/en-us/library/jj163864.aspx), there is a section in there talking about user profiles:

{% blockquote %}
User Profiles (http://sharepoint/social/tenant) The permission request scope used to access all user profiles. Only the profile picture can be changed; all other user profile properties are read-only for apps for SharePoint. Apps that request rights for the User Profiles scope must be installed by a tenant administrator.
{% endblockquote %}

In a nutshell, I have to grant **Tenant** permissions to my app to be able to have my user follow a new site. Therefore, my new permissions look like the following:

| Scope                  | Permission |
|------------------------|------------|
| User Profiles (Social) | Read
| Tenant                 | Write

As indicated by the paragraph above, the app now needs to be installed by a tenant administrator. However, in doing so, the app now follows sites (and other content) with ease. Why the obscure error message? That I don't know, and I hope the SharePoint team might look to address this with a more *correct* error message in the near future. 
