---
layout: post
title: "On Helpers and the use of static"
date: 2014-03-02 23:08:21 -0600
description: "After reviewing some recent software work and discussing those reviews with my team, it was clear that what I considered common practices, they didn't."
keywords: "software,development,programming,best practices"
comments: true
categories: 
- software development
tags:
- software
- development
- programming
- best practices
---

One of my most recent interactions with several of my colleagues has been over best practices within software development. More specifically, the idea of static classes, static methods, and helper classes. It was a healthy debate with different view points. Some believe that static methods are perfectly fine for development. Others feel that helper classes provide unity to certain practices such as database access. Generally, however, I believe static and helper classes are an anti-pattern and lead to less maintainable code. This post is an expression of why I believe this to be the case. None of the code samples are actual snippets on real projects. They are paraphrased instances of practices I've seen on a myriad of past projects.
<!--more-->

So, why are statics bad? 
------------------------
I'm a huge fan of automated testing. I started with unit tests, but have recently moved into the realm of behavior tests. Yet, for any automated testing, you have to have good architecture in your code to ensure that you *can* test in any environment.

Let me give the most basic example: the use of a logging facility. Take for example the following loggger that I see all too often:

{% highlight csharp %}
public static class LoggingHelper
{
    public static void LogMessage(string message, string area)
    {
        var logPath = Constants.LogPath;
        using (StreamWriter writer = System.IO.File.AppendText(logPath))
        {
            writer.WriteLine("INFO\t[" + area + "]" + message);
        }
    }

    public static void LogError(string message, string area)
    {
        var logPath = Constants.LogPath;
        using (StreamWriter writer = System.IO.File.AppendText(logPath))
        {
            writer.WriteLine("ERROR\t[" + area + "]" + message);
        }
    }

    public static void LogException(string message, string area, Exception exception)
    {
        var logPath = Constants.LogPath;
        using (StreamWriter writer = System.IO.File.AppendText(logPath))
        {
            writer.WriteLine("EXCEPTION\t[" + area + "]" + message + " - " + exception.Message);
            writer.WriteLine("Stack Trace" + exception.StackTrace);
        }
    }
}
{% endhighlight %}

Here are a few areas the above code block can improve:

 * There's no exception handling. At all. 
 * There's no mutexes/resource locking. Thus, it's possible for multiple threads to attempt to open the file at the same time. The first one in will succeed. All others will throw exceptions. 
 * It's insanely duplicative. In fact, I was able to copy every line of ``LogMessage`` to ``LogError`` and only have to change 2 lines of code. The same goes for ``LogException``, where I also added an additional line. 
 * What happens when I have another type of message I need to log? That means I must add another method - 6 of those lines likely the same as ``LogMessage``. 
 * What happens when I need to change the location of the log file? 
 * What happens when I need to change the underlying facility for logging? Say, from files to databases? 

The last two are key here. For the first, I can change from ``Constants.LogPath`` to something like ``ConfigurationManager.AppSettings["LogPath"]``, But what happens when the file is a network file system? Not accessible via standard UNC paths? You're up a creek and this *entire class* needs to change. That's pretty much the case of the second question. 

You should assume that your underlying logging destination can **and will** change at any time. If you think that the simple solution to this is to simply change the ``LoggingHelper`` class, think again. Let's take this further. You should assume that your destination will be different for **multiple scenarios**. In enterprise development, this is frequently the case. In a pre-integration environment, you may only want to log to the filesystem because it may be a single server. However, in integration and production you might choose to log to a database since you're deploying to a farm of servers and writing to the filesystem makes diagnosing problems a true headache.

Back to the problem of automated testing, you don't really want any logging. Why? What happens when your test runner doesn't have access to the logging path? What happens when your test environment doesn't have the path at all? What happens when you forget you have your test environment dumping massive amounts of logs to the filesystem only to go on a goose chase figuring out why your builds randomly started to fail due to the disk being full? In the case of unit testing, ``/dev/null`` should be your destination. 

Let's consider one last secenario: what happens if you want to log to multiple facilities at once?

In any of those cases, using a static class with static methods does not afford you **any** flexibility. If you want to expand to multiple logging facilities, you would be forced to create another static class. That class is now called in addition to this one. Yuck. 

Here's where I come back to the [SOLID principles](3). Let's look at how Static classes (and static methods) violate these principles. 

 * Open/Closed Principle - Classes should be open for extension, but closed for modification.
   * With statics, you **cannot** extend and override the behavior. You throw out the idea of polymorphism. This makes it ~~very difficult~~ impossible for me to inject different behaviors for whatever need I may have. 
 * Dependency Inversion Principle - Depend upon Abstractions. Do not depend upon concretions.
   * With statics, every class that leverages its facilities are now dependent upon a concretion. There is no way to pass around an abstraction of a static class or regular class with static methods. Your only way of doing this is with reflection and that's a definite code smell.

In summary, because I cannot leverage the power of inheritance, polymorphism, or really any aspect of object oriented analysis and design with ``statics``, it feels a lot like procedural programming. I suggest leaving this practice behind.

So, why are helpers bad?
------------------------
My discussion with my colleagues yielded an interesting observation: everyone's opinion of a helper was slightly different. One thought of it as a single data access layer. Another thought of it as a way of providing consistent authentication for data access. But others think of helpers as the giant "I don't know where to stick this method" bucket. So, you end up with something like this (methods only, since that should convey what I'm getting at):

{% highlight csharp %}
public static class Utils
{
    public static string CleanInput(string input);

    public static void FlushCacheIndex();

    public static bool CheckIfSystemIsHealthy();

    public static int GetCountOfActiveUsers();

    public static MyModel CreateModelFromInput(string name, string email, int age, DateTime birthday);
}
{% endhighlight %}

These types of helpers are a maintainability nightmare. For starters, if you haven't read my section above on why statics are bad, step back and read it. Both SOLID principles are still violated. Yet, there are also a couple of others that are violated.

 * Single Responsibility Principle - A class should have only one reason to change. 
   * It's clear in the case above that there are multiple reasons this class exists. However, there are other helper classes (such as ``StringUtils`` which are not as clear. However, I'm still a firm believer that the Open/Closed Principle dictates whether to add yet another method to an existing class, or create a separate class. I'm a huge fan of small classes as their much easier to test and maintain. 
 * Interface Segregation Principle - Many client-specific interfaces are better than one general-purpose interface.
   * Okay, so this isn't an interface. ISP is definitely meant for solving another problem. However, the basics behind this principle apply here. This is a general-purpose class. Why should I have my code **strongly-coupled** to this class if all I need is one method within it? 

Now, to tackle some of the other arguments in favor of helper classes, let's look at another example I've seen in the past:

{% highlight csharp %}
public class DatabaseHelper
{
    private static DataAccessObject daoInstance;

    public static DataAccessObject CreateDataAccessObject(User invokingUser)
    {
        if (daoInstance == null)
        {
            var dao = new DataAccessObject();
            dao.AuthenticationMode = AuthenticationModes.Shared;
            dao.Credentials = new DataAccessCredentials(invokingUser.Kerberos, invokingUser.Token);
            return dao;
        }
        return daoInstance;
    }
}
{% endhighlight %}

Ah, rather than a helper, you meant a factory. Okay, I can dig that...sorta. We're still using ``static`` here, which makes it impossible for me to factorize the creation of my DAO without strongly coupling my business logic to this *specific* class. Now, a factory is meant to abstract away the details of creating an object of a specific type. There's some generally common expected inputs, and you get a generic implementation at the output. But, how should you go about doing that? 

If you're using a proper dependency injection/Inversion of Control container, you'll be able to configure your application instance to inject a provider which implements the following interface:

{% highlight csharp %}
public interface DataAccessFactory
{
    DataAccessObject CreateDataAccessObject(User invokingUser);
}
{% endhighlight %}

Furthermore, if you're in a spot where you need a singleton instance of the ``DataAccessObject``, then you can make sure that you implement the appropriate logic in your Factory instance **and** setup your IoC container to maintain a singleton instance of the object. 

When discussing the use of "helper" classes, it's more difficult to outright say they aren't useful, because each person's definition of helper classes are different. Nevertheless, if you venture down the path of bucket "utility" classes, stop. There are better approaches you can take.

Well, I still don't agree with you...
-------------------------------------
That's fine. You're entitled to your opinion. Just don't expect for me to pass your code reviews.

Are there circumstances where the use of a static method might be worth it? Quite possibly. But I rarely encounter those cases. If one of those reasons is "it's faster to do it with a static than via good architecture" then you're just being lazy. Yes, software development is about delivering value. However, what debt you introduce to the system must later be addressed save you be unable to deliver any value once you've built a castle with no doors **around you**. 

I'm not alone in this. Check out just a few other blogs which carry several really good arguments against the use of statics or helpers:

 * [Anti-patterns and Worst Practices - Utils Classes](http://lostechies.com/chrismissal/2009/06/01/anti-patterns-and-worst-practices-utils-class/)
 * [Util Classes Must Die](http://oo-programming.blogspot.com/2009/06/util-classes-must-die.html)
 * [Are Helper Classes Evil?](http://blogs.msdn.com/b/nickmalik/archive/2005/09/06/461404.aspx)
 * [Helper Classes are Evil](http://blogs.msdn.com/b/elee/archive/2009/05/05/helper-classes-are-evil.aspx)

Where did you shape your thoughts on best practices? 
----------------------------------------------------
In my previous role at [Improving Enterprises](2), there were a number of really talented technologists, passionate about best practices. They were staunch supporters of user groups and community as well. Thus, my opinions on best practices have been shaped not only through previous co-workers and colleagues, but also by community. 

Community has a lot of benefits, and has a lot of diversity of thought. The software community provides an atmosphere for technologists to actively try many of the best practices they preach through katas, discussions, pull requests, and many other channels. These best practices are most commonly focused around the use of patterns. Why reinvent the wheel when patterns exist to help solve the same or similar problems? However, these patterns often have justifiable use: they leverage the facets of object oriented languages in the manner they were *expected* to be used.

This is where I started to learn about best practices. My source of community was extremely diverse. It included my colleagues at work, my close developer friends, and those technologists in the community who were extremely passionate about their work. Some of these technologists I engaged only through user groups, some through their blogs, and some through discussion boards. I am a high achiever, and in order for me to achieve, I must learn - so I am always on a continuous search for new information - even if it contradicts previous thoughts or practices I held imporant to me. 

Finally, the only other way to really learn and solidify the importance of a best practice is to, well, **practice** it. With enough practice, you'll invariably run into other practices which box you into a corner or make your life *very* difficult. The more times you encounter these situations, the greater a believer in best practices which leverage the power of object oriented design and development.

Diversity of thought is a great practice and should be encouraged. It leads to more out-of-the-box thinking, approaches to problems, and ensures that all risks are vocalized. However, one of the most important things I've had to learn is that no matter what, diversity of thought should always be supported with sound reason and justification. Simply citing a preference to a mode of practice, idea, or solution without good justification to a practice is hard to accept in a professional setting. 

  [2] http://www.improvingenterprises.com/
  [3] http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)
