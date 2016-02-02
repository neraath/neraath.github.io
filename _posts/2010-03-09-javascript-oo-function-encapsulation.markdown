---
comments: true
date: '2010-03-09 01:13:56'
layout: post
slug: javascript-oo-function-encapsulation
status: publish
title: JavaScript OO Function Encapsulation
wordpress_id: '266'
categories:
- software development
tags:
- javascript
---

I'll admit, I'm a bit of a JavaScript n00b when it comes to doing UI development. One of the outside consulting projects that I'm working on is asking me to push the limits of my JavaScript knowledge, and I can definitely say the past couple of days have given me a sad realization that there are some strange oddities to JavaScript development. Once you understand that Prototyping is much like Extension Methods in .Net, that part's pretty easy. What's not easy is trying to figure out how to do event handing with Object Oriented classes.
<!--more-->
Here it is in a nutshell. I have a function (<code>keystrokeListener</code>) defined for a class (<code>KeystrokeHandler</code>). The idea is I want to <code>addEventListener</code> the <code>keydown</code> event for a particular object using the <code>keystrokeListener</code> method in my object. No matter what I was doing (whether that be declaring the method as a static method, registering the event within the class constructor, or declaring the method name on an instance of the <code>KeystrokeHandler</code>) yielded the following error for a call within <code>keystrokeListener</code>:

{% highlight text %}
this.getRealKeycode is not a function 
{% endhighlight %}

Let's look at my code for just a moment:

{% highlight javascript %}
/**
 * KeystrokeHandler object definition.
 */
function KeystrokeHandler() {
    /**
     * Proceeds to fetch the mapped keycode, including value for any special keybindings.
     *
     * @param {Event} event The event that was triggered.
     */
    this.getRealKeycode = function(event) {
        var realCode = (event.keyCode ? event.keyCode : event.charCode);

        // Check to see if the various special keys are also depressed (ALT, CTRL, SHIFT, and META)
        if (event.altKey) {
            realCode += QT.ALT;
        }
        if (event.ctrlKey) {
            realCode += QT.CTRL;
        }
        if (event.shiftKey) {
            realCode += QT.SHIFT;
        }
        if (event.metaKey) {
            realCode += QT.META;
        }

        return realCode;
    };

    /**
     * A generic keystroke keyNotify used for debugging purposes.
     *
     * @param {Event} nsEvent The keydown event that triggered this keyNotify to be called.
     */
    this.keyNotify = function(nsEvent) {
        var trueEvent = (nsEvent) ? nsEvent : window.event;
        alert("Keystroke: " + trueEvent.keyCode);
    };

    /**
     * The generic keystroke listener that is called upon each keystroke.
     *
     * @param {Event} nsEvent The keypress event that triggered this method call.
     */
    this.keystrokeListener = function(nsEvent) {
        var trueEvent = (nsEvent) ? nsEvent : window.event;
        this.keyNotify(nsEvent);
        var realCode = this.getRealKeycode(trueEvent);
    };

    return this;
}

function registerTextareaEvents() {
    var mainArea = document.getElementById('textarea-transcription');
    var keystrokeHandler = new KeystrokeHandler();
    //mainArea.addEventListener('keydown', function(evt) { keystrokeHandler.keystrokeListener(evt) }, true);
    mainArea.addEventListener('keydown', keystrokeHandler.keystrokeListener, true);
}
{% endhighlight %}

What was happening was the event was firing and actually calling the method appropriately. However, it was not resolving properly, as within the event handler, it was unable to find the other methods associated with the object. 

The solution to fix this is actually commented out at the bottom of the code sample above. What you have to do is wrap the handler registration in an anonymous function and call it explicitly if you want this to work correctly. More specifically:

{% highlight javascript %}
function registerTextareaEvents() {
    var mainArea = document.getElementById('textarea-transcription');
    var keystrokeHandler = new KeystrokeHandler();
    mainArea.addEventListener('keydown', function(evt) { keystrokeHandler.keystrokeListener(evt) }, true);
}
{% endhighlight %}
