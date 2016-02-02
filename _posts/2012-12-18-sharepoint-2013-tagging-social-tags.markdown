---
layout: post
title: "SharePoint 2013 Tagging - Social Tags, Hashtags, and Keywords"
description: "Social Tags, Hashtags, and Keywords share a lot of similarities, but are also distinctly different in SharePoint 2013. This post helps to demistify those differences."
keywords: "sharepoint,2013,hashtags,tags,social,metadata,managed"
date: 2012-12-18 09:07
comments: true
external-url: 
categories: 
- software development
- systems administration
tags:
- sharepoint
- systems
---
SharePoint 2013 is now publicly available and enterprises are taking an earnest look at many of its features, specifically the social features. I won't lie, I'm a fairly decent microblogger, and at [Improving Enterprises][improving] we actively use [Yammer][ymr] to communicate company-wide. That feature is increasingly useful to have meaningful conversations when it comes to promoting achievements, asking questions that require a larger audience to answer, and to share transient things like pictures and videos. However, when it comes to sharing documents and collaborating on a project, SharePoint wins over [Yammer][ymr] every time. That's why we have [Office 365][o365] within our company. So, to hear that many of Yammer's features are now native to SharePoint, I became very interested in digging in - as did my customer. 

[Improving][improving] is not nearly as large a company as the customer I work for. They are a financial institution with 40k+ employees worldwide. As a result, they have a distinct need to be social. But, they are also encumbered with some regulatory restrictions affecting their social deployment. As a result, introducing social across their firm is quite a challenge, especially when there are many stakeholders who are considering multiple competing products, including [Jive][jive], [The Open Source Q&A System (OSQA)][osqa], and [Yammer][ymr]. 

A **large** part of social in the listed products and many other social networks is the concept of tagging. SharePoint 2010 started venturing down the path of tags by creating the *Tags and Notes* board, giving users the ability to tag files and lists publicly (or privately), making it easier to categorize items in SharePoint. You could also enhance your user profile by indicating what topics (Keywords) you should be asked about, giving users a sense that you're the expert in those key fields. All in all, a good step in the social direction, but still behind the curve.

SharePoint 2013 continued to build on tagging with the introduction of **#tags** (prononunced hashtags). This is more beneficial to the social story for many reasons. First: hashtags become a first-class citizen in the sense that users no longer have to go out of their way to add a tag to something (like a conversation, comment, or microblog entry). Second: hashtags are always public, meaning that users have the collection of hashtags at their fingertips, giving them helpful hints on how to categorize their entry. Third: hashtags seem to be used anywhere you can tag - whether it's in conversations, comments, or when tagging documents or libraries. 

However, as I continued to dig into the social and tagging story, there seems to be some discrepancies in several of the features. The purpose of this post is to highlight that while **#tags** seem to be the direction that Microsoft would rather push users to use in their tagging strategy, integrating their existing social tagging strategy seemed to be left behind in SharePoint 2013. 
<!--more-->
Show Me More Tags
-----------------
### Tags & Notes
As mentioned above, there are several different ways to tag content in SharePoint 2013. The first is the original tagging strategy through the *Tags & Notes* board. 

<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/tags-and-notes-ribbon.png" alt="" />
<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/tags-and-notes.png" alt="" />

In this board, when you start typing text, you'll get helpful hints of the various **Keywords** already available by means of other user contributions and pre-populated keywords from administrators of the Managed Metadata. What's even more impressive is you can not only leverage Keywords from traditional tags, but also **#tags**:

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/tags-and-notes-hints.png" alt="" />

### Newsfeed
As everyone has been talking about, the Newsfeed is probably the singular most important feature to the social story. It's the user's "dashboard" into what's relevant to them, what's happening for everyone, and how to get to most other contextually-relevant content in the farm. If you read most of the marketing talk on the SharePoint 2013 social features, one of the biggest considerations was how to surface content that's not just useful, but contextually relevant. Finding a sales report from the previous quarter may be useful in my position, but when I'm trying to search for content on the proposed social media marketing strategy, it isn't useful. 

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/newsfeed.png" alt="" />
<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/newsfeed-following.png" alt="" />

From the newsfeed, I can quickly share status updates with everyone, my team, or other audiences of the sites I'm following. I can mention other users by using an @ symbol in front of their name and also have multiple **#tags** in a single post. At a glance, I also see information about the sites, documents, people, and tags that I'm following, making it easy to get around to find items that are most relevant to me. Searching for content is ubiquitous - you can pretty much search for content from anywhere in your SharePoint farm using the out-of-the-box templates. 

### Communities
Communities are the next biggest value-add to social adoption in SharePoint 2013. Communities are reminicent to forums and Q&A boards (like [StackOverflow][so]). Users can start threads in different categories of conversation and have rich discussion. **#tags** are ubiquitous, and can be added to questions and replies. I won't go into the number of different features of communities, but suffice to say that I can easily add **#tags** to any of my interactions and they surface within searches and the newsfeed just like hashtags used in my microblogs. 

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/community-question.png" alt="" />

However, one thing that appears to be less straight-forward is using managed metadata/keywords to tag individual responses. I can access the **Tags & Notes** button from the **Page** tab, but what's less clear is what a "Page" is in the context of tagging content. Does it relate to the entire thread, or just the question? There are some unanswered questions around general social tagging for community discussions. 

**Off-topic:** The biggest thing communities are meant to replace: distribution lists. Microsoft threatened to remove distribution lists from Exchange 2007 in favor of SharePoint, but backed off when they nearly had an enterprise revolt. They stayed away from the topic in Exchange 2010 and SharePoint 2010 (as far as I could tell), but 2013 seems to be a renewed effort. The message: communicating heavily through e-mail using Distribution Lists is a terrible approach. I'm in agreement. When I was a heavy Atlassian Confluence user, I found little point in communicating lengthy conversations in e-mail. Once I left, those e-mails would no longer be useful to future teams, and valuable business justification and decisions will be lost. Instead, I preferred to document and carry out these conversations in a Wiki (largly due to the [E-mail Brevity Challenge of 2009](http://blogs.atlassian.com/2009/01/2009_email_brev/)). 

#### Social Tags
What's important to note, however, is the use of tags via the **Tags & Notes** board are **not** social tags by default. This is nothing new from SharePoint 2010, if you've already taken a look at this. What's even more surprising is tags in communities or on your newsfeed are also, not social tags. To fix **Tags & Notes**, you have to go into the document library settings (specifically, the *Enterprise Metadata and Keywords Settings* section in order to enable the ability to save the metadata on this list as social tags. I have yet to figure out how to do this for communities or newsfeeds. 

<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/enable-social-tags.png" alt="" />

Personally, I feel that this is a missed opportunity. If Microsoft wants to solidify the social story more, then trying to surface the tagging of documents only helps that cause. Additionally, doesn't it make sense that all **#tags** are social tags? If we're using it in a social context, then it should be surfaced by the social controls. I digress, however, as the use cases for tagging vary widely and this may have been a strategic decision. 

Why does marking a tag a social tag important? In SharePoint 2010 (and 2013), the only way you can surface a tag in your newsfeed is to follow it. To be able to follow it, the tag has to be a social tag. Not just any enterprise metadata can be followed in your newsfeed. For a large majority of metadata, however, this is totally fine: we likely don't care to surface metadata from a term set dubbed *SOX Compliance Restriction Codes* showing ST123X-F. 

<img style="float:left" src="/images/posts/2012-12-18-sharepoint-social-tags/tag-cloud.png" alt="" />

Another reason social tags are important: the Tag Cloud. The tag cloud is a cool (but not innovative) feature to help surface the most popular tags in your subsite (or across the entire farm). The size of the text changes based on the number of uses of a particular tag. Nevertheless, other items like the tag cloud rely solely on social tags, not managed metadata tags. Therefore, when you drop one of those controls into a site, what's rendered is based **only** on social tags. Crack open the code to check for yourself. I did. 

### Hashtags
This is the newest addition to the social tagging strategy in SharePoint 2013. **#tags**, like enterprise keywords and social tags, are a broadly defined concept meant to be leveraged in a wide capacity. Much like in social networking sites like Twitter and Facebook, the use of tags are to categorize a post, making it easier for individuals to search and identify related contents. All one has to do is add a hash in front of any word and SharePoint will convert that to a hashtag. When viewing the comment with a hashtag, SharePoint automatically renders it as a bold hyperlink to help make navigating and finding related content easier.

<img style="float:left" src="/images/posts/2012-12-18-sharepoint-social-tags/hashtags-newsfeed.png" alt="" />

I regularly go to conferences that define a hashtag for people to use when posting to Twitter. This makes it easy for me as a conference organizer **and** an attendee to perform a search strictly on that hashtag. SharePoint is no different: they've realized that searching for hashtags and surfacing those results is strategically important to help further the social adoption in 2013. We see this through the hashtag profile pages (accessible by simply clicking the hashtag link) and through featured content controls in the search center. 

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/hashtags-profilepage.png" alt="" />
<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/hashtags-trending.png" alt="" />
<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/hashtags-search-featured-content.png" alt="" />

Other controls exist (particularly in the newsfeed) that surface trending hashtags, which is useful to help bring visibility to important conversations or activities within the company.

#### Hashtags and Social Tags in the Managed Metadata Service 
However, where I find the disconnect with the social strategy is that not all hashtags are social tags. Furthermore, not all Managed Metadata / Enterprise Keywords are social tags. Yet, most of this content all ends up in the Managed Metadata Service, but in two distinctly different System Term Sets: Hashtags and Keywords. 

<img style="float:left" src="/images/posts/2012-12-18-sharepoint-social-tags/managed-metadata-service-overview.png" alt="" />

Even in our simple test environment with 7 enterprise users testing the social features, it became quite easy to cross-polute our term sets. While all of our terms in the Hashtag set are definitely hashtags, many of the terms in the Keywords set can be clasified as hashtags. 

<img style="float:left" src="/images/posts/2012-12-18-sharepoint-social-tags/managed-metadata-service-hashtags-set.png" alt="" />
<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/managed-metadata-service-keywords-set.png" alt="" />

What's really disappointing about this is the fact that none of those tags in either are guaranteed to make it to the social tags. Those are stored completely separately from the Managed Metadata Service. Social tags are an aspect of the user profile service and are stored in those databases. This is where things start to get very confusing. If you crack open the *User Profile Service Social Database*, there's a ``SocialTags`` table that contains all tags used for Social elements. As you can see in the below results, these include regular keyword metadata tags as well as hashtags. 

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/user-profile-service-social-tags-table.png" alt="" />

There are a couple of ways this is relevant. I can choose to follow a hashtag in SharePoint quite easily. In fact, SharePoint does an **excellent** job surfacing how to follow hashtags on your newsfeeds. While I can also follow social (not hash) tags, there is a distinct disconnect. If I tag a document with the **SharePoint** tag, if I'm following the **#SharePoint** hashtag, I won't see that document in my newsfeed. I have to be following **both** the **SharePoint** tag and the hashtag. 

<img style="float:right" src="/images/posts/2012-12-18-sharepoint-social-tags/hashtags-follow.png" alt="" />

This also affects search. As seen above, I can search for a hashtag and see all content tagged as a featured search result. However, searching for standard social tags can only be done through the tag profile page, or by using a specialized search string that's really only formable by clicking links only from the tag profile. The result is an inconsistent search experience for users when it comes to tags.

<img style="float:center" src="/images/posts/2012-12-18-sharepoint-social-tags/social-tags-search.png" alt="" />

Conclusion
----------
I'm overwhelmingly optimistic about the social story in SharePoint 2013. It's been missing for too long and has hindered adoption of SharePoint as a fundamental enterprise collaboration platform. For enterprises which have internet filters restricting access to Facebook, Twitter, and many other social networking sites, this will come as a welcome relief to employees who enjoy that form of social interaction. The communities and the newsfeed bridge two types of social communities: the forum community with the more mainstream social media community. 

That said, Microsoft has introduced a major uphill battle for the enterprise to strategize on how to roll out social. I firmly believe that leaving it strictly to the community to self-describe their social story will result in the same cluttered mess that SharePoint is in most enterprises. Adoption will languish and the story gets that much more difficult for the organization to trust the social story in v.Next. 

My gut recommendation for tagging in SharePoint 2013 is the following. This is likely to evolve as I come to understand the original intent behind how **#tags** were supposed to play with social tags. 

 * If you're rolling this new, recommend users always define tags in terms of **#tags**. 
 * If you're upgrading:
   * See which keywords make sense to resurface as **#tags**.
   * Delist the original keywords you converted to **#tags** as taggable.
 * Drop the Tag Cloud Web Part into community sites to surface popular tags.
 * Appoint someone in the organization as being responsible for the Keywords and Hashtags term stores.
   * This person should be responsible for pre-populating these term stores with common terminology throughout the organization. 
   * This person should seek out other more specific terminology used within specialized departments. 
   * This person should prune irrelevant, inappropriate, or duplicate terms in each of the stores to keep the sets fairly sane and easy for users. 
 * Give employees time to play with and *learn to use* the social features in SharePoint 2013. 
   * Users who have used Facebook and Twitter understand the value and will quickly feel at-home.
   * Users who have used forums will also feel right at-home with communities and will quickly want to create their own. 
     * Dissuade them from creating a new community unless they have a significant enough interest and make them realize they need to be a curator to keep it alive. 
   * Users who are anti-social or have not adopted Facebook or Twitter (like my parents) need this time to understand the value of that feature. 
   * All users need time to figure out what they have to do to follow **#tags**, users, documents, and lists.  
   * Come up with a compelling story of how your department uses social.
     * After all, if you're not eating your own dog food, how do you expect your users to use it? 

Either way, the social features will really help to drive adoption of SharePoint 2013 and you'll enjoy them when you start playing with them. If you have any questions, don't heistate to drop a comment below or shoot me an e-mail at chris (at) chrisweldon (dot) net. 

[so]: http://www.stackoverflow.com/
[improving]: http://www.improvingenterprises.com/
[jive]: http://www.jivesoftware.com/
[ymr]: http://www.yammer.com/
[o365]: http://office365.microsoft.com/
[osqa]: http://www.osqa.net/
