---
layout: post
title: Finding When a User First Got Access to a SharePoint Site via REST
modified: 2016-02-02 20:00:00
categories: SharePoint
excerpt:
tags: [sharepoint,rest,user information list,uil]
image:
  feature:
date: 2016-02-03T14:20:59+00:00
---
On my team, we have many legacy solutions which closely depend on the SharePoint Server Side Object Model (SSOM). This was the only option for being able to manage your SharePoint 2007 and 2010 farms. You may have read on some of my past blog posts, code written against the SharePoint SSOM is extremely difficult to unit test without [Microsoft Fakes](https://msdn.microsoft.com/en-us/library/hh549175.aspx?f=255&MSPPError=-2147217396) or writing a facade. As a result, I have challenged the team to continue familiarizing ourselves with the SharePoint 2013 REST APIs. They are much more strategic, especially when planning for the possibility of moving to SharePoint Online / Office 365. 

While working on permissions management within SharePoint, we had a need to identify when a user first obtained access to their SharePoint 2013 site. We typically look at the ``SiteUsers`` table for information relating to users against a Site Collection. The ``SiteUsers`` collection can be accessed via the SharePoint REST API by going to ``/_api/web/SiteUsers``. However, the properties on each ``SiteUser`` look like the following (obtained from the [Users, groups, and roles REST API Reference](https://msdn.microsoft.com/en-us/library/office/dn531432.aspx#bk_UserCollection)):

{% highlight json %}
{"d":{
  "results":[
    {
      "__metadata":{
        "id":"https://chrisweldon.sharepoint.com/_api/Web/GetUserById(16)",
        "uri":"https://chrisweldon.sharepoint.com/_api/Web/GetUserById(16)",
        "type":"SP.User"
      },
      "Groups":{"__deferred":{"uri":"https://chrisweldon.sharepoint.com/_api/Web/GetUserById(16)/Groups"}},
      "Id":16,
      "IsHiddenInUI":false,
      "LoginName":"i:0#.w|domain\\user1",
      "Title":" User1 Display Name ",
      "PrincipalType":1,
      "Email":"user1@company.com",
      "IsSiteAdmin":false,{
      "__metadata":{
        "type":"SP.UserIdInfo"},
        "NameId":"s-0-0-00-000000-0000000000-0000000000-000000",
        "NameIdIssuer":"issuer id"
      }
    }
  ]
}}
{% endhighlight %}

There are no dates in this. When I thought about it, I remembered the [User Information List](http://zimmergren.net/technical/sharepoints-hidden-user-list-user-information-list). This list contains a wealth of additional details beyond what the ``SiteUsers`` collection provides. The reason: it is nothing more than a list - just one with *lots* of columns of rich data. More importantly, it is available to query via the REST API! Checking the structure of the User Information List was as simple as executing the following REST query:

{% highlight text %}
GET /_api/web/lists/getbytitle('User Information List')/Fields?$select=InternalName&$filter=InternalName%20eq%20'Created'%20or%20InternalName%20eq%20'UserName'
Accept: application/json;odata=verbose
{% endhighlight %}

**Note:** a short way is via ``/_api/web/SiteUserInfoList``. The results are as follows:

{% highlight json %}
{
    "d": {
        "results": [
            {
                "__metadata": {
                    "id": "https://chrisweldon.sharepoint.com/_api/Web/SiteUserInfoList/Fields(guid'453160d6-6a28-42ba-ba45-9f9d2c70407d')",
                    "uri": "https://chrisweldon.sharepoint.com/_api/Web/SiteUserInfoList/Fields(guid'453160d6-6a28-42ba-ba45-9f9d2c70407d')",
                    "type": "SP.FieldText"
                },
                "InternalName": "UserName"
            },
            {
                "__metadata": {
                    "id": "https://chrisweldon.sharepoint.com/_api/Web/SiteUserInfoList/Fields(guid'8c06beca-0777-48f7-91c7-6da68bc07b69')",
                    "uri": "https://chrisweldon.sharepoint.com/_api/Web/SiteUserInfoList/Fields(guid'8c06beca-0777-48f7-91c7-6da68bc07b69')",
                    "type": "SP.FieldDateTime"
                },
                "InternalName": "Created"
            }
        ]
    }
}
{% endhighlight %}

Awesome! It exists! Now all I have to do is query for the specific user that I want. When I have a specific UserName to find, all I have to execute is the following query:

{% highlight text %}
GET /_api/web/SiteUserInfoList/Items?$select=UserName,Created&$filter=UserName%20eq%20'neraath@chrisweldon.onmicrosoft.com'
Accept: application/json;odata=verbose
{% endhighlight %}

And I get exactly what I want:

{% highlight json %}
{
    "d": {
        "results": [
            {
                "__metadata": {
                    "id": "7df6fc9b-0755-421e-934d-617ca89d5d9f",
                    "uri": "https://chrisweldon.sharepoint.com/_api/Web/SiteUserInfoList/Items(12)",
                    "etag": "\"19\"",
                    "type": "SP.Data.UserInfoItem"
                },
                "UserName": "neraath@chrisweldon.onmicrosoft.com",
                "Created": "2013-04-12T15:38:12Z"
            }
        ]
    }
}
{% endhighlight %}

In summary, when you are looking to find information about users whom have access to your SharePoint sites, remember the User Information List, and also remember it is queryable via the REST API!
