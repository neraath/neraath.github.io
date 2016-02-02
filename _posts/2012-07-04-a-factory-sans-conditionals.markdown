---
layout: post
title: "A Factory - Sans Conditionals"
date: 2012-07-04 08:53
comments: true
external-url: 
categories: 
- software development
tags:
- php
- c#
- factory
- patterns
- strategy
- conditionals
---

<img style="float: right" src="/images/posts/2012-07-04-a-factory-sans-conditionals/factory.jpg" />

I attended <a href="http://austincodecamp2012.com/" target="_blank">Austin Code Camp</a> a few weekends ago and had a blast! There were plenty of enthusiastic, passionate individuals gathered and ready to learn - the makings for a great one day conference. While there, I attended the session <em>Must-Know Design Patterns</em> by <a href="http://www.robvettor.com/" target="_blank">Rob Vettor</a>. In that session, he discussed several very useful patterns, including the <a href="http://en.wikipedia.org/wiki/Decorator_pattern" target="_blank">Decorator Pattern</a>, the <a href="http://www.oodesign.com/factory-pattern.html" target="_blank">Factory Pattern</a>, and numerous other useful patterns. In seeing his code samples for the factory pattern, I was a bit disappointed to see his entire block of <code>if/else if/else</code> statements simply moved from his business logic to the factory. While this is still technically the better approach than leaving it in business logic, I find there's a better way to do this. In fact, there's a <em>zero</em> case statement way of doing this in C#. If you're curious to find out how to create a factory without a single <code>if</code> or <code>switch</code> statement, read on. 
<!--more-->


If you've never heard of it, check out the <a href="http://www.antiifcampaign.com/" target="_blank">Anti If Campaign</a>. I wasn't aware of this until about a year ago, but prior to that I was already a practitioner of their preachings.  The goal is simple: get rid of most (if not all) case statements in your code.  Why? An increase in the number of case statements increases the branch (cyclomatic) complexity of your logic. You have to add more unit tests to ensure you hit everyone of those branches. It's far too often the case that your code isn't just a set of conditional statements - it has other logic surrounding it. It's messy, and it's poor design. 



If you are truly paying attention to object-oriented design patterns, you'd realize there are ways for you to structure your code in a manner that minimizes or eliminates the need for conditional statements. Most people revolt when I make this assertion. Some of the arguments I've heard include:
<ol>
<li>Won't you create too many classes to maintain? I have a hard enough time navigating my codebase as-is. </li>
<li>Aren't classes "heavy"? Won't that bloat the application?</li>
<li>How do I know what my application is doing without if/else if/else statements?</li>
</ol>

My responses are usually:
<ol>
<li>You'll often create many more classes. But, if you have a) sound organizational plans and b) a somewhat-modern IDE you can find any of the classes you use. Learn to use your IDE so you can help you navigate your codebase.</li>
<li>It depends on the class. Often, I create many <em>extremely</em> lightweight classes and only allow them to live while I need them to help keep memory consumption to a minimum.</li>
<li>Are you flinging code at your screen like a monkey flings poo at others? How else do you expect to build your application? Understanding these (and other) design principles will allow you to make sense of what your app is doing, rather than treating it like some voodoo blackbox.</li>
</ol>

<h3>The Problem</h3>
Let's take a look at a sample problem that I'd like to make much simpler. The code sample below should be fairly easy to follow. We are a custom factory responsible for building different makes and models of vehicles. As you can see, the majority of our business logic is tied up trying to figure out how to create the vehicle and assign it the options.

{% highlight csharp %}
public class VehicleController
{
    public ActionResult buildVehicle(string make, string model, string color, int numDoors, string[] options = string[0])
    {
        Vehicle vehicle = null;
        if (make.Equals("Honda")) {
            if (model.Equals("Civic")) {
                // Ooh! My favorite!
                vehicle = new Civic();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("Accord")) {
                // Only comes in 4 doors. So, ignore numDoors.
                vehicle = new Accord();
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("CR-V")) {
                // Only comes in 4 doors. So, ignore numDoors.
                vehicle = new CRV();
                vehicle.Color = color;
                vehicle.Options = options;
            } else {
                throw new InvalidArgumentException("Cannot make requested model for Honda");
            }
        } else if (make.Equals("Chevrolet")) {
            if (model.Equals("Suburban")) {
                vehicle = new Suburban();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("Silverado")) {
                vehicle = new Silverado();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else {
                throw new InvalidArgumentException("Cannot make requested model for Chevrolet");
            }
        } else if (make.Equals("BMW")) {
            // Pompus luxury vehicle.
        } else if (make.Equals("Ferrari")) {
            // Not likely in my lifetime.
        } else if (make.Equals("Lamborghini")) {
            // I wish.
        }

        // Save.
        this.vehicleContext.Attach(vehicle);
        this.vehicleContext.SaveAll();

        // Display our newly created vehicle.
        return View("BuildVehicle", vehicle);
    }
}
{% endhighlight %}

The cyclomatic complexity of this action alone is ridiculous. Controller actions should be simple and straight-forward: collect data and validate, pass to business logic, return response. Any controller action over 20 LoC is doing too much and some refactoring should be considered. So, what should we do? 

<h3>The Pattern</h3>
Let's take the first step and refactor that gigantic if block into a separate factory:

{% highlight csharp %}
public class VehicleFactory
{
    public Vehicle buildVehicle(string make, string model, string color, int numDoors, string[] options = string[0])
    {
        Vehicle vehicle = null;
        if (make.Equals("Honda")) {
            if (model.Equals("Civic")) {
                // Ooh! My favorite!
                vehicle = new Civic();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("Accord")) {
                // Only comes in 4 doors. So, ignore numDoors.
                vehicle = new Accord();
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("CR-V")) {
                // Only comes in 4 doors. So, ignore numDoors.
                vehicle = new CRV();
                vehicle.Color = color;
                vehicle.Options = options;
            } else {
                throw new InvalidArgumentException("Cannot make requested model for Honda");
            }
        } else if (make.Equals("Chevrolet")) {
            if (model.Equals("Suburban")) {
                vehicle = new Suburban();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else if (model.Equals("Silverado")) {
                vehicle = new Silverado();
                vehicle.Doors = numDoors;
                vehicle.Color = color;
                vehicle.Options = options;
            } else {
                throw new InvalidArgumentException("Cannot make requested model for Chevrolet");
            }
        } else if (make.Equals("BMW")) {
            // Pompus luxury vehicle.
        } else if (make.Equals("Ferrari")) {
            // Not likely in my lifetime.
        } else if (make.Equals("Lamborghini")) {
            // I wish.
        }

        return vehicle;
    }
}
{% endhighlight %}

This <em>greatly</em> simplifies our <code>VehicleController</code> (see below), but does little to solve our cyclomatic complexity problem. Furthermore, one of the biggest problems I have with this as a factory is it will have to be modified <strong>every time</strong> a business use case related to the factory changes. We need a better solution to help make this easier to maintain and unit test. 

{% highlight csharp %}
public class VehicleController
{
    public ActionResult buildVehicle(string make, string model, string color, int numDoors, string[] options = string[0])
    {
        VehicleFactory factory = new VehicleFactory();
        Vehicle vehicle = factory.buildVehicle(make, model, color, numDoors, options);

        // Save.
        this.vehicleContext.Attach(vehicle);
        this.vehicleContext.SaveAll();

        // Display our newly created vehicle.
        return View("BuildVehicle", vehicle);
    }
}
{% endhighlight %}

So, the first option I'd push for is moving the actual creation of each make into a separate factory. So, we'll have a <code>HondaFactory</code>, a <code>ChevroletFactory</code>, and other factories for each of our other types. So, looking at the refactor for the <code>HondaFactory</code>, we have something similar to the following:

{% highlight csharp %}
public class HondaFactory
{
    public Vehicle CreateVehicle(string model, string color, int numDoors, string[] options = string[0])
    {
        Vehicle vehicle = null;
        if (model.Equals("Civic")) {
            // Ooh! My favorite!
            vehicle = new Civic();
            vehicle.Doors = numDoors;
            vehicle.Color = color;
            vehicle.Options = options;
        } else if (model.Equals("Accord")) {
            // Only comes in 4 doors. So, ignore numDoors.
            vehicle = new Accord();
            vehicle.Color = color;
            vehicle.Options = options;
        } else if (model.Equals("CR-V")) {
            // Only comes in 4 doors. So, ignore numDoors.
            vehicle = new CRV();
            vehicle.Color = color;
            vehicle.Options = options;
        } else {
            throw new InvalidArgumentException("Cannot make requested model for Honda");
        }

        return vehicle;
    }
}
{% endhighlight %}

And here's our <code>ChevroletFactory</code>:

{% highlight csharp %}
public class ChevroletFactory
{
    public Vehicle CreateVehicle(string model, string color, int numDoors, string[] options = string[0])
    {
        Vehicle vehicle = null;
        if (model.Equals("Suburban")) {
            vehicle = new Suburban();
            vehicle.Doors = numDoors;
            vehicle.Color = color;
            vehicle.Options = options;
        } else if (model.Equals("Silverado")) {
                vehicle = new Silverado();
            vehicle.Doors = numDoors;
            vehicle.Color = color;
            vehicle.Options = options;
        } else {
            throw new InvalidArgumentException("Cannot make requested model for Chevrolet");
        }

        return vehicle;
    }
}
{% endhighlight %}

Now we need to figure out how to get our main <code>VehicleFactory</code> to route requests to each of these different factories <strong>without</strong> conditionals. But, before we do this, let's think about what we just did. We need to realize that each of the factories we created are doing <em>the same thing</em>. When you start having several classes doing the same thing, it's time to introduce an interface. With this, we also introduce what will be termed as the <strong>evaluator</strong>:

{% highlight csharp %}
public interface IVehicleFactory
{
    Vehicle CreateVehicle(string model, string color, int numDoors, string[] options = string[0]);
    bool CanCreateMake(string make);
}
{% endhighlight %}

<code>CanCreateMake</code> evaluates the make and returns whether this factory can handle it. We then are able to change our <code>HondaFactory</code> to look like:

{% highlight csharp %}
public class HondaFactory : IVehicleFactory
{
    public Vehicle CreateVehicle(string model, string color, int numDoors, string[] options = string[0])
    {
        Vehicle vehicle = null;
        if (model.Equals("Civic")) {
            // Ooh! My favorite!
            vehicle = new Civic();
            vehicle.Doors = numDoors;
            vehicle.Color = color;
            vehicle.Options = options;
        } else if (model.Equals("Accord")) {
            // Only comes in 4 doors. So, ignore numDoors.
            vehicle = new Accord();
            vehicle.Color = color;
            vehicle.Options = options;
        } else if (model.Equals("CR-V")) {
            // Only comes in 4 doors. So, ignore numDoors.
            vehicle = new CRV();
            vehicle.Color = color;
            vehicle.Options = options;
        } else {
            throw new InvalidArgumentException("Cannot make requested model for Honda");
        }

        return vehicle;
    }

    public bool CanCreateMake(string make)
    {
        return make.Equals("Honda");
    }
}
{% endhighlight %}

So, let's store all of our vehicle factories into a collection in our primary <code>VehicleFactory</code> and pull out the one we want to use:

{% highlight csharp %}
public class VehicleFactory
{
    private IList<IVehicleFactory> factories = new List<IVehicleFactory>();

    public VehicleFactory()
    {
        this.factories.Add(new HondaFactory());
        this.factories.Add(new ChevroletFactory());
    }

    public Vehicle buildVehicle(string make, string model, string color, int numDoors, string[] options = string[0])
    {
        IVehicleFactory usableFactory = this.factories.SingleOrDefault(fac => fac.CanCreateMake(make));
        if (usableFactory == null) throw new InvalidArgumentException("Cannot create vehicle of the requested make.");
        return usableFactory.CreateVehicle(model, color, numDoors, options);
    }
}
{% endhighlight %}

We're definitely getting there, but there's one glaring problem. As mentioned previously, I hate the way factories are usually implemented, as they require modification if we need to add a new conditional. We're still in the same boat here. If we begin to manufacture a new make, we have to create that specific make's factory <strong>and</strong> modify this central factory to register it. This breaks the <a href="http://en.wikipedia.org/wiki/Open/closed_principle" target="_blank">Open/Closed Principle</a>, and we need to fix it. Thankfully, our interfaces help. 

At Lone Star PHP an individual approached me after my SOLID talk to mention that he's not sold on the use of interfaces. He said that interfaces seem to be there only for the developers - as a means to help them add new classes that perform the same types of activities. But, he still didn't see a computer-use for them. That's when I busted out the use of Reflection. Reflection helps me walk my codebase and find objects of specific types without ever being aware of what is out there. Reflection will help us solve this problem. 

{% highlight csharp %}
public VehicleFactory()
{
    var discoveredFactories = Assembly.GetExecutingAssembly().GetTypes()
        .Where(type => type.GetInterfaces().Any(intrfce => intrfce.Equals(typeof(IVehicleFactory))));
    this.factories.AddRange(discoveredFactories);
}
{% endhighlight %}

This is now <em>completely</em> implementation agnostic and accomplishes our second goal: create a factory that's safe against modifications - this factory is not likely to ever change. The added benefit that I've introduced is the ability to drop in any new make factory that implements <code>IVehicleFactory</code>, recompile, and deploy - and it will automatically be picked up by my assembly. That's sexy. 

Our final factory that all of our core business logic will use looks like:

{% highlight csharp %}
public class VehicleFactory
{
    private IList<IVehicleFactory> factories = new List<IVehicleFactory>();

    public VehicleFactory()
    {
        var discoveredFactories = Assembly.GetExecutingAssembly().GetTypes()
            .Where(type => type.GetInterfaces().Any(intrfce => intrfce.Equals(typeof(IVehicleFactory))));
        this.factories.AddRange(discoveredFactories);
    }

    public Vehicle buildVehicle(string make, string model, string color, int numDoors, string[] options = string[0])
    {
        IVehicleFactory usableFactory = this.factories.SingleOrDefault(fac => fac.CanCreateMake(make));
        if (usableFactory == null) throw new InvalidArgumentException("Cannot create vehicle of the requested make.");
        return usableFactory.CreateVehicle(model, color, numDoors, options);
    }
}
{% endhighlight %}

<h3>Rinse and Repeat</h3>
Now that the basics have made themselves apparent, you should be able to figure out how to get rid of the remainder of the if/else blocks of this code. If you need further guidance, keep reading. Otherwise, I suggest you jump to the <a href="#Summary">summary</a>. 

To get rid of the remainder of the if/else statements we have in our individual make factories, we apply the same principles that we did the first time around. We need yet another factory responsible for each model of the car. We then need a way to determine if that factory can handle the creation of the requested model. It's time for yet another interface:

{% highlight csharp %}
public interface IMakeVehicles
{
    Vehicle CreateVehicle(string color, int numDoors, string[] options = string[0]);
    bool CanCreateModel(string model);
}
{% endhighlight %}

So, let's create our first vehicle, a Civic:

{% highlight csharp %}
public class CivicFactory : IMakeVehicles
{
    public Vehicle CreateVehicle(string color, int numDoors, string[] options = string[0])
    {
        Civic vehicle = new Civic();
        vehicle.Doors = numDoors;
        vehicle.Color = color;
        vehicle.Options = options;
        return vehicle;
    }

    public bool CanCreateModel(string model) 
    {
        return model.Equals("Civic");
    }
}
{% endhighlight %}

We do the same thing for all of our other models. The conditional evaluator is moved from the if block into the <code>CanCreateModel</code> method, and the body of the if statement is moved into <code>CreateVehicle</code>. All that's left is to apply the same trick that we did in the <code>VehicleFactory</code> to auto-discover our model factories. But - how do we make sure the Honda Factory only discovers factories relating to it, rather than <strong>all</strong> makes? The simplest approach here is to refactor IMakeVehicles to be a generic interface:

{% highlight csharp %}
public interface IMakeVehicles<TModelType> where TModelType : Vehicle
{
    TModelType CreateVehicle(string color, int numDoors, string[] options = string[0]);
    bool CanCreateModel(string model);
}
{% endhighlight %}

We then update our <code>CivicFactory</code> to use the following definition:

{% highlight csharp %}
public class CivicFactory : IMakeVehicles<Honda>
{
    public Honda CreateVehicle(...);
}
{% endhighlight %}

This allows us to use the same Assembly trick from earlier on a strongly-typed interface. The assumption here is that <code>Civic : Honda</code> and <code>Honda : Vehicle</code>. Without that relationship, this trick will not work.

We finish up by changing our <code>HondaFactory</code> to look like the following:

{% highlight csharp %}
public class HondaFactory : IVehicleFactory
{
    private IList<IMakeVehicles<Honda>> factories = new List<IMakeVehicles<Honda>>();

    public VehicleFactory()
    {
        var discoveredFactories = Assembly.GetExecutingAssembly().GetTypes()
            .Where(type => type.GetInterfaces().Any(intrfce => intrfce.Equals(typeof(IVehicleFactory<Honda>))));
        this.factories.AddRange(discoveredFactories);
    }

    public Vehicle buildVehicle(string model, string color, int numDoors, string[] options = string[0])
    {
        IVehicleFactory usableFactory = this.factories.SingleOrDefault(fac => fac.CanCreateModel(model));
        if (usableFactory == null) throw new InvalidArgumentException("Cannot create vehicle of the requested model.");
        return usableFactory.CreateVehicle(color, numDoors, options);
    }

    public bool CanCreateMake(string make) 
    {
        return make.Equals("Honda");
    }
}
{% endhighlight %}

<a href="#" name="Summary"></a>
<h3>Summary</h3>
As we have seen, you can easily refactor your logic in such a way that's a lot more straight-forward to maintain. You've created a factory that can be reused in multiple places across your application. Instead of having to maintain a gargantuan and growing class, you being to worry about micro-factories that are focused on your specific needs. Your micro-factories are able to be reused across components. You have encapsulated all logic associated with the creation of a particular vehicle in a single class, rather than splitting the determination of when to create the class and how to create it in separate classes. Your unit test classes for each of these components are so small, you stop worrying about how to create your 18-level chain mock to test a single conditional statement. In short: you achieve OO bliss. 

What I've introduced is not new. In fact, this is a variation of the <a href="http://en.wikipedia.org/wiki/Command_pattern" target="_blank">Command Pattern</a>. I also <strong>heavily</strong> rely on this pattern when I'm implementing <a href="http://en.wikipedia.org/wiki/Strategy_pattern" target="_blank">strategies</a> within my code. Strategies change often, so when I need to introduce a new strategy, I create the class, implement the interface, rebuild, and go! Removing a strategy is as simple as pressing the delete key. One class and everything else is taken care of for me. 

If you have questions or comments about this pattern, please feel free to reach out to me via <a href="mailto:chris@chrisweldon.net">e-mail</a> or through the comment page below. I would love to hear other's ideas on this implementation. 
