---
layout: post
title: "SharePoint 2013 Community Tagging Architecture and Bug"
date: 2012-12-20 13:29
comments: true
external-url: 
categories: 
- systems administration
- software development
---
I've spent yesterday evening and today really sinking my teeth into the internals of SharePoint 2013's social features, trying to identify how items are cataloged and surfaced. This led to some very interesting revelations as to where I can find information relating to each of SharePoint's moving parts. As I continued to dig, I managed to identify a significant problem with surfacing hashtags, aka **#tags**, in community sites. This post serves as a place for hopefully the search engines to surface this problem for other users, and I will catalog my findings and hopefully eventual resolution with Microsoft. 
<!--more-->

**Update (25/Apr/2013)**: <a href="#update">Microsoft has implemented a bugfix for this. See below for more information.</a>

Background
----------
<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-1-community-discussion.png" alt="" />

This blogpost (and the ordeal mentioned above) all started with the community discussion thread seen in the screenshot above. In order for all social features to work correctly, you have to have the following services configured correctly in your SharePoint 2013 environment:

 * Managed Metadata Service
 * Search Service 
 * User Profile Service

Each of these are used in a variety of different ways to knit the social story together. Let's start with the lowest common denominator in the tagging story: tags. If you read my [previous blog post](http://www.chrisweldon.net/blog/2012/12/18/sharepoint-2013-tagging-social-tags/), you'll get a better understanding of what **Tags & Notes** are used for in SharePoint. Through that interface, you can tag a list item, file, or even a list with any managed metadata that's marked "taggable". The purpose is to help surface relevant content within an enterprise without going through the hassle of creating custom metadata columns on document libraries. 

In SharePoint 2013, there is a new managed metadata term set, dubbed **Hashtags**. This is a system-level term set, and cannot be deleted or created. However, all terms created within are fully manageable. This term store contains the terms created when a user creates a tag beginning with a hash (#). This occurs no matter where the user tags something: a file, comment, microblog post, or a community discussion. Suppose for a moment that a user adds a community discussion post with four *new* hashtags: ``#reply``, ``#outlook``, ``#metadata``, and ``#termstore``. Upon submitting that post, those terms will immediately be added to the ``ECMTermLabel`` database table in the Managed Metadata Service database. 

{% highlight sql %}
SELECT TOP 1000 [PartitionId], [TermId], [LCID], [Label], [IsDefault]
FROM [dbo].[ECMTermLabel] 
{% endhighlight %}

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-2-termstore.png" alt="" />

However, all across SharePoint and *especially* the search service, the terms are not refered to by their integer identifiers. Instead, they're referred by their ``UniqueId`` guid. This is found by looking at the ``ECMTerm`` table, alongside the ``ECMTermLabel`` table:

{% highlight sql %}
SELECT TOP 1000 [Id], [UniqueId]
FROM [dbo].[ECMTerm] 
WHERE Id IN (1088, 1089, 1090, 1091)
{% endhighlight %}

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-3-term-uniqueid.png" alt="" />

At this point, it's important to rehash that hashtags are not social by default. When it comes to using the **Tags & Notes** board, it is possible to enable any tags used there (including hashtags) to be "socialized". However, the "new" social features (community discussions, microblog posts and comments) do not make those tags social. You can check by querying the User Profile Service SocialDB's ``SocialTags`` table.

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-4-socialtags.png" alt="" />

### Deeper Dive - Where are my Hashtags? 

So, I wanted to find out where my hashtags really were being used. So, this took me on a deep dive through the SharePoint content database. As this was all read only, this didn't really matter if I was poking around trying to find data. Because there are several tables with hundreds of columns, I wanted to hone in precisely the list I was looking for my hashtags: the **Discussions List**. I cracked open the ``AllLists`` table and queried based on title:

{% highlight sql %}
SELECT TOP 1000 [tp_SiteId], [tp_WebId], [tp_ID], [tp_Title] 
FROM [dbo].[AllLists] 
WHERE [tp_Title] = 'Discussions List'
{% endhighlight %}

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-5-contentdb-listid.png" alt="" />

The ``tp_ID`` is what I what I needed, as it is the list's unique identifier for me to pull content out of the ``AllUserData`` table. This table contains all user-provided data in all SharePoint sites stored within this content database. Therefore, it's massive, even for an environment with only a single site collection like a community site. Performing the following query allowed me to find the discussion comment that I added in the topmost screenshot. 

{% highlight sql %}
SELECT TOP 1000 [tp_ColumnSet] 
FROM [dbo].[AllUserData] 
WHERE tp_ListId = '75D9F5D7-8B83-4252-BB52-48D5E5F91B01' ORDER BY tp_Modified DESC
{% endhighlight %}

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-6-contentdb-discussioncomment.png" alt="" />

This yields a field which is viewable in an XML editor. The resulting XML for the screenshot of the comment made by me in the post above looks like the following. As you can see in the ``ntext9`` XML field, we have the hashtags that SharePoint has identified within the body of the comment, as well as their unique identifiers from the managed metadata service. Further proof that community sites are being tagged appropriately. 

{% highlight xml %}
<int1>42</int1>
<int2>1</int2>
<int3>42</int3>
<int7>1</int7>
<ntext2>&lt;div class="ExternalClass27572E39547C412CA62D7D22B7FC380F"&gt;&lt;p&gt;Let's test. &lt;span class="ms-rtestate-read ms-socialentity" data-hashtag="00000000-0000-0000-0000-000000000000" data-hashname="#reply"&gt;&lt;a class="ms-hashTag" href="/_layouts/15/FeedRedirector.aspx?type=tag&amp;amp;value=%23reply" rel="#reply"&gt;#reply&lt;/a&gt;&lt;/span&gt; &lt;span class="ms-rtestate-read ms-socialentity" data-hashtag="00000000-0000-0000-0000-000000000000" data-hashname="#outlook"&gt;&lt;a class="ms-hashTag" href="/_layouts/15/FeedRedirector.aspx?type=tag&amp;amp;value=%23outlook" rel="#outlook"&gt;#outlook&lt;/a&gt;&lt;/span&gt; &lt;span class="ms-rtestate-read ms-socialentity" data-hashtag="00000000-0000-0000-0000-000000000000" data-hashname="#metadata"&gt;&lt;a class="ms-hashTag" href="/_layouts/15/FeedRedirector.aspx?type=tag&amp;amp;value=%23metadata" rel="#metadata"&gt;#metadata&lt;/a&gt;&lt;/span&gt; &lt;span class="ms-rtestate-read ms-socialentity" data-hashtag="00000000-0000-0000-0000-000000000000" data-hashname="#termstore"&gt;&lt;a class="ms-hashTag" href="/_layouts/15/FeedRedirector.aspx?type=tag&amp;amp;value=%23termstore" rel="#termstore"&gt;#termstore&lt;/a&gt;&lt;/span&gt; &lt;/p&gt;&lt;/div&gt;</ntext2>
<ntext9>#metadata|9434622a-60e1-47c6-9b58-17b955c31410;#outlook|497ba856-65ff-45d7-89f6-6302e041e4b8;#reply|5c68c7c8-38cc-4964-850f-8c1e02076c04;#termstore|b2969adf-a746-4c0e-b38f-db7a77de7788</ntext9>
<nvarchar3>&lt;8b0edc16e721456986d9d04eac185d5d@SharePoint&gt;</nvarchar3>
{% endhighlight %}

The Bug
-------
The root cause of me digging down this rabbit hole was no matter what I did, I couldn't find content tagged with certain hashtags that I *know* existed. I had a tendency to use the ``#sharepoint`` hashtag a *lot* in both my microblog feed as well as in my community discussion. Yet, when I attempted to search for that hashtag through the search center user interface, only the microblog posts would show - none of the community discussion threads. 

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-7-search.png" alt="" />

Furthermore, when I would check the hashtag profile for ``#sharepoint``, it would show the same - only microblog posts, no community discussions. This is a **significant** usability issue. 

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-8-hashtagprofile.png" alt="" />

I verified when creating a reply to a community discussion, complete with a *new* hashtag, the hashtag does get added to the managed metadata term set, as seen in the query from the Managed Metadata Service database above. In the ``ECMTermLabel`` database table, we can clearly identify the hashtag terms ``#reply``, ``#outlook``, ``#metadata``, and ``#termstore`` added as part of the comment. As seen in the XML block from ``AllUserData`` above, we see that SharePoint is correctly associating the hashtags in the post with their identity in the managed metadata service. Just to make sure that the latest hashtags are exhibiting this problem, I performed a search and found nothing. 

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-9-outlook.png" alt="" />

<img style="float:right" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-10-contenttypes.png" alt="" />
The biggest thing that I wanted to find out was whether Discussion Lists were properly surfacing hashtags as the appropriate metadata for the search service to identify them. When I looked at the list settings for the Discussions List, I found that it was affiliated with two content types: ``Discussion`` and ``Message``. For the discussion list, we can clearly see that it is not directly using hashtags via the columns composition:

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-11-columns.png" alt="" />

Furthermore, if you look at the Discussion and Message content types, **neither** reference Hashtags as a column:

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-12-discussion-columns.png" alt="" />
<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-13-message-columns.png" alt="" />

Just to double check, I decided to look at the Microfeed for my personal site to see if the hashtags were being elevated as their own column. You can access your microfeed list by going to ``/personal/USERNAME/Lists/PublishedFeed``. Indeed, when I looked at the columns for this list, **Hashtags** from the Managed Metadata Columns collection **were** being surfaced:

<img style="float:center" src="/images/posts/2012-12-20-sharepoint-2013-community-tagging-architecture-and-bug/bug-14-publishedfeed-columns.png" alt="" />

Summary
-------
~~If this is indeed a bug, I can hope that Microsoft will fix this problem ASAP, as it's a significant hinderance to groups adopting SharePoint 2013 for it's social aspects. Despite all the marketing statements indicating that 2013 makes things much easier to find, this seems to be a limitation of SharePoint Social Search. I plan on creating a bug with Microsoft's bugreporting system and will keep this post updated with information as it evolves.~~

**Update (25/Apr/2013)**: I have received word from Jennifer Bester (<a href="http://twitter.com/jbester" name="update" target="_blank">@jbester</a>), a Microsoft Field Engineer, that Microsoft **has** acknowledged this as a bug and has implemented a fix. It is due to be released in the June 2013 CU for SharePoint. As soon as that CU is published I'll be applying it to our on-premise environment. SharePoint Online customers **should** be seeing this bug fixed ahead of the CU. 
