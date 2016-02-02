---
layout: post
title: "SqlCacheDependency in HTTP Module Supporting SharePoint"
description: "A customer of mine had a poorly-managed caching solution that made it difficult to purge without taking the website down. This blog post highlights how the SqlCacheDependency is a mechanism for helping to solve this problem."
date: 2012-10-08 16:40
comments: true
keywords: "sharepoint,sqlcachedependency,sqldependency,httpmodule,caching,cache,expiration"
categories: 
- software development
tags:
- microsoft
- asp.net
- httpmodule
- sharepoint
- caching
- sqlcachedependency
- sqldependency
---

A customer of mine had some code that caches all of the rows from a SQL table in order to ensure the highest possible thruput with low overhead. Unfortunately, the code was caching the data on the <strong>first</strong> request, and not letting go of the cached data. Therefore, the only way to clear the cache or load new records was to perform an <code>iisreset</code>, taking the website offline. For this production SharePoint instance which serves over 40k employees, this is not an acceptable solution during the day. So, we decided to look into an alternative solution: <code>SqlCacheDependency</code>.
<!--more-->

Disclaimer: Ultimately, I plan on coming back around and <em>completely</em> refactoring what you see below. It's ugly as sin and can be <em>much</em> improved. I'll write a separate blog post once I do. However, I felt it important to at least get this off my chest, as I'm notoriously bad about making sure to blog about solutions I find. 

As a little more background, the customer had written a custom <code>IHttpModule</code> that sits in the IIS Pipeline for their SharePoint sites. The purpose of this module was to check if the user should be redirected to a different page based on the current requesting page. However, since this sits in front of a SharePoint site <em>and</em> serves 40k employees, it needed to be <strong>fast</strong>. Therefore, they used the following caching strategy:

{% highlight csharp %}
public void OnBeginRequest(object sender, EventArgs e)
{
    if (HttpContext.Current.Cache.Count == 0)
    {
        DataTable dataTable = DataAccessLayer.GetUrlMap();
        foreach (var row in dataTable.Rows)
        {
            HttpContext.Current.Cache.Insert(row["SourceUrl"], row["DestinationUrl"]);
        }
    }

    string destinationUrl = HttpContext.Current.Cache[HttpContext.Current.Request.Url.ToString()] as string;
    if (destinationUrl != null)
    {
        // Redirect to destination Url.
    }
}
{% endhighlight %}

The following is a simple sample of the method being called in the <code>DataAccessLayer</code>:

{% highlight csharp %}
public static DataTable GetUrlMap()
{
    string connectionString = ConfigHelper.GetConnectionString("URLMap");
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        SqlCommand command = new SqlCommand("usp_GetUrlMap", connection);
        command.CommandType = CommandType.StoredProcedure;
        connection.Open();
        DataTable table = new DataTable();
        SqlDataAdapter adapter = new SqlDataAdapter(command);
        adapter.Fill(table);

        return table;
    }
}
{% endhighlight %}

(<strong>Disclaimer:</strong> this isn't the real code. It's a shortening of what's actually happening.)

<h2>The Problem</h2>

Well, for the astute coder, you'll quickly realize that there is no expiration set on the items inserted into the cache. Furthermore, there's nothing else that actually invalidates the cache. Therefore, the only way that we can get new data into the cache is to perform an <code>iisreset</code>, something that is not allowed during normal business hours. Therefore, it was time to come up with a different solution for invalidating the cache.

We talked about options such as sending a specific query string parameter and using that as the "trigger" to empty the cache. However, that becomes problemmatic as we have a farm-based SharePoint scenario supported by a NetScalar load balancer, meaning we'd have to touch each web front end directly to ensure this works. That's tedious and subject to yet another concern: the possibility that the data in the cache will differ between servers. 

<h2>The Solution</h2>

This is when we started looking at automated mechanisms to "notify" the caching subsystem that data has been updated, and to invalidate the cache. This is where the <a href="http://msdn.microsoft.com/en-us/library/system.web.caching.sqlcachedependency(v=vs.100).aspx" target="_blank">SqlCacheDependency</a> class comes into play. This class allows me to add a dependency to a specific database table for cache invalidation <em>or</em> a <code>SqlCommand</code>. 

For applications written against Microsoft SQL Server 7.0 and SQL Server 2000, the <code>SqlCacheDependency</code> required configuration changes and some <code>aspnet_regsql</code> commands to be executed in order to prepare the enviornment to use the CacheDependency approprately. Even there, the <code>SqlCacheDependency</code> relied on polling the database - a rather expensive operation. 

However, when using SQL Server 2005 and newer, Microsoft introduced a new asynchronous notifications system making it much simpler to know when changes to database records occur without having to constantly poll the table. This makes it much less expensive for tracking and something we were willing to consider. Even more importantly, it required <strong>no</strong> configuration changes to the Web Front Ends. 

So, I started making the modifications to our caching engine to help support this. Because this is fairly tightly coupled to data access, though, my initial proof-of-concept includes some mandatory modifications to the data access layer (something I was not particularly comfortable with):

{% highlight csharp %}
public DataTable GetUrlMap()
{
    string connectionString = ConfigHelper.GetConnectionString("URLMap");
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        SqlCommand command = new SqlCommand("usp_GetUrlMap", connection);
        command.CommandType = CommandType.StoredProcedure;
        connection.Open();

        SqlCacheDependency cacheDependency = null;
        try 
        {
            cacheDependency = new SqlCacheDependency(command);
        } 
        catch (DatabaseNotEnabledForNotificationException) 
        {
            try
            {
                SqlCacheDependencyAdmin.EnableNotifications(connectionString);
            }
            catch (Exception)
            {
            }
        }
        catch (TableNotEnabledForNotificationException)
        {
            try
            {
                SqlCacheDependencyAdmin.EnableTableForNotifications(connectionString, "URLMap");
            }
            catch (Exception)
            {
            }
        }
        finally
        {
            DataTable table = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(command);
            adapter.Fill(table);

            HttpContext.Current.Cache.Insert("URLMap", table, cacheDependency);
            return table;
        }
    }
}
{% endhighlight %}

The above code is fairly straight-forward. The database and the table must have notifications setup at the SQL-level in order to have the caching dependency work in the prescribed manner. This is done through the <code>SqlCacheDependencyAdmin</code> class calls above. According to the <a href="http://msdn.microsoft.com/en-us/library/system.web.caching.sqlcachedependency(v=vs.100).aspx" target="_blank">MSDN documentation</a>, the only time exceptions would occur when calling those methods would be when the user executing the commands does not have the required permissions. 

Other than setting up the <code>SqlCacheDependency</code>, everything else is the same. Oh, except for the fact that you have to supply the dependency <em>with</em> the object you are storing in the cache. Therefore, now the data access layer is now <strong>strongly</strong> coupled to the caching mechanism. I feel <em>really</em> dirty doing this. 

If you look at the original code, you'll notice that I was caching each of the URLs as separate items in the cache. Unfortunately, if you attempt to do that here, you will get an exception with the message:

{% highlight text %}
An attempt was made to reference a CacheDependency object from more than one cache entry.
{% endhighlight %}

Therefore, the "fix" for this is to store the entire <code>DataTable</code> in a single cache entry. This isn't bad, but means we have to move our lookup for the matching redirection record from "hiding" it within the caching logic to being a little more explicit. I actually plan to refactor this and use something like a <code>Dictionary</code> to make lookups still be more performant than right now - O(n). 

{% highlight csharp %}
public void OnBeginRequest(object sender, EventArgs e)
{
    DataTable dataTable = null;
    string destinationUrl = string.Empty;
    if (HttpContext.Current.Cache.Count == 0)
    {
        // Returning from the DataAccessLayer is redundant now.
        dataTable = DataAccessLayer.GetUrlMap();
    }

    dataTable = HttpContext.Current.Cache["URLMap"] as DataTable;
    foreach (DataRow row in dataTable.Rows)
    {
        if (row["SourceUrl"].Equals(HttpContext.Current.Request.Url.ToString(), StringComparison.InvariantCultureIgnoreCase))
        {
            destinationUrl = row["DestinationUrl"];
            break;
        }
    }

    if (!string.IsNullOrEmpty(destinationUrl))
    {
        // Redirect to destination Url.
    }
}
{% endhighlight %}

<h2>SQL Stored Procedure Gotcha</h2>

After all of the changes that I made, when I stepped thru the debugger, I was noticing very strange behavior. After I loaded items into the cache, the first request to the cache immediately afterwards (literally the following line after <code>GetUrlMap()</code>) was returning <code>null</code> - it couldn't find the <code>DataTable</code> it <em>just</em> cached. Very pecular indeed.

I suspected it had something to do with the stored procedure. First, I read a couple of articles which indicated that you must make sure that the SQL command executed in the stored procedure reference all schemas and tables - explicitly. Furthermore, you could <strong>not</strong> select all columns using the wildcard (*). Instead, you had to be explict with the columns you select. So, the following two SQL commands would not work using the <code>SqlCacheDependency</code>:

{% highlight sql %}
SELECT * FROM URLMap;
SELECT SourceUrl, DestinationUrl FROM URLMap;
{% endhighlight %}

Instead, you had to change to be the following:

{% highlight sql %}
SELECT [dbo].[URLMap].SourceUrl, [dbo].[URLMap].DestinationUrl FROM [dbo].[URLMap];
{% endhighlight %}

Unfortunately, after making these changes, it didn't solve the problem. I continued to hunt down the issue and managed to come across an <a href="http://forums.asp.net/t/1010106.aspx" target="_blank">ASP.Net forum post</a> which suggested to look for the following in my stored procedure:

{% highlight sql %}
SET NOCOUNT ON
{% endhighlight %}

Sure enough, this was in my Stored Procedure (as it seems to be for most). After removing, the cache resumed working correctly and didn't immediately purge after inserting. Essentially, the <a href="http://msdn.microsoft.com/en-us/library/ms181122(v=sql.90).aspx" target="_blank">MSDN Page for Creating a Query for Notification</a> indicates that using <code>SET NOCOUNT ON</code> is not allowed for stored procedures.

<h2>Specifics with SharePoint</h2>

I came across two specific issues that you have to keep in mind with loading this in SharePoint. First is how you declare the <code>SqlCacheDependency</code>. The <a href="http://msdn.microsoft.com/en-us/library/system.web.caching.sqlcachedependency(v=vs.100).aspx" target="_blank">reference documentation</a> indicates to use just the name of the database and the name of the table. This is fine <em>if</em> you have the connectionstring stored in your <code>Web.config</code> file. If you don't (as is the case in our environment), then you <strong>cannot</strong> use this manner of watching for database table changes - you <em>must</em> use a stored procedure or regular SQL Command. 

Second, you have to be mindful of the fact that you cannot simply drop the <code>SqlDependency.Start(connectionString)</code> in <code>Application_Start</code> - SharePoint is in strict control of <code>Application_Start</code> However, putting it in your <code>IHttpModule</code>'s <code>Init()</code> method is totally fine:

{% highlight csharp %}
public void Init(HttpApplication application)
{
    string connectionString = ConfigHelper.GetConnectionString("URLMap");
    SqlDependency.Start(connectionString);
    application.BeginRequest += OnBeginRequest;
}
{% endhighlight %}

Happy coding!
