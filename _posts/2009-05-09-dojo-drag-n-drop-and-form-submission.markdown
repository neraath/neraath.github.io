---
comments: true
date: '2009-05-09 15:00:44'
layout: post
slug: dojo-drag-n-drop-and-form-submission
status: publish
title: Dojo Drag-n-Drop and Form Submission
wordpress_id: '219'
categories:
- software development
tags:
- dojo
- php
- code
- javascript
---

While working on one of my consulting projects, I was having a difficult time finding documentation anywhere online on how to use the Dojo Drag-n-Drop (<a href="http://api.dojotoolkit.org/jsdoc/1.3/dojo.dnd">dojo.dnd</a>) features with forms. I wasn't too keen on making JSON calls or writing a whole-lotta JavaScript to solve my problem. Well, luckily I managed to derive a solution rather quickly. Read on for more details.

<!--more-->

The solution more or less was me plugging into the vast functionality that Dojo has in each of its objects and some of its base methods. Because Dojo interacts and operates with the DOM so well, it's very easy to write JavaScript code that will take what Dojo has already manipulated and continue to manipulate it some more. 

I found a really explanatory <a href="http://www.sitepen.com/blog/2008/06/10/dojo-drag-and-drop-1/">blog about Dojo DND</a> and this started my basis of trying to implement a solution. However, their blog article didn't address how to submit all of that data through a form - it was simply a live update and utilization of DND components. 

What I ended up doing was separating my form (form created using a <a href="http://api.dojotoolkit.org/jsdoc/1.3/dijit.form">dijit.form</a> object) from my DND object blocks. I then had my Dojo buttons that subscribed onClick to a custom JavaScript method which gathered the list of "Subscribed" objects, populated the form with new input objects, and then submitted the form. Let's look at the DND objects first. 

{% highlight html %}
<div class="view" width="100%" style="padding-left: 100px;">
	<div class="catalogContainer">
	    <h2>Available Chapters</h2>
	    <ul dojoType="dojo.dnd.Source" accept="normal,subscribed"
	        id="catalogNode" class="container">
	        <?php foreach ($this->chapters as $chapter): ?>
	           <li class="dojoDndItem normal" dndType="normal" id="<?php echo $chapter->getId(); ?>">
	               <?php echo $this->escape($chapter->getTitle()); ?>
	           </li>
	        <?php endforeach; ?>
	    </ul>
	</div>
	 
	<div class="cartContainer">
	    <h2>Chapters Subscribed</h2>
	    <ol dojoType="dojo.dnd.Source" accept="normal,subscribed"
	        id="cartNode" class="container">
	        <?php foreach ($this->module->getChapters() as $chapter): ?>
	           <li class="dojoDndItem subscribed" id="<?php echo $chapter->getId(); ?>" dndType="subscribed">
	               <?php echo $this->escape($chapter->getTitle()); ?>
	           </li>
	        <?php endforeach; ?>
	    </ol>
	</div>
	<div class="clear"></div>
	<ul class="actions">
        <li>
            <button dojoType="dijit.form.Button" type="button" iconClass="dijitEditorIcon dijitEditorIconDelete"
                    onClick="window.location.href = '<?php echo $this->url(array(
                        'moduleId' => $this->module->getId()), 'adminModuleView'); ?>'">Cancel</button>&nbsp;
        </li>
        <li>
            <button dojoType="dijit.form.Button" type="button" iconClass="saveIcon"
                    onClick="submitModuleChaptersAction()">Save</button>
        </li>
    </ul>
</div>
{% endhighlight %}

What you see above is the two DND divs (<code>catalogContainer</code> and <code>cartContainer</code>) and an unordered list of buttons (see <code>ul class="actions"</code>). This is not wrapped in a form, but is almost entirely driven by the Dojo engine. In short, I am able to drag-n-drop objects from either the <code>catalogContainer</code> or <code>cartContainer</code>. I click either the <strong>Cancel</strong> or the <strong>Save</strong> button to continue. 

The <strong>Save</strong> button is the key - it's onClick method calls <code>submitModuleChaptersAction()</code>. Let's take a look at what that's doing.

{% highlight javascript %}
/**
 * Submits the form for updating the list of available chapters
 *
 * This method gathers the list of chapters that are subscribed (in order) and drops them
 * into a Dojo form for submission to the action controller. 
 *
 * @return void
 */
function submitModuleChaptersAction() {
    var chapterSub = dojo.byId('cartNode');
    var chapterSubDndSrc = new dojo.dnd.Container(chapterSub);
    var chapterarray = new Array();
    var idx = 0;
    chapterSubDndSrc.getAllNodes().forEach(function(node) {
        chapterarray[idx++] = node.id;
    });
    for (var i = 0; i < idx; i++) {
        var inp = dojo.create('input', { type: "hidden", name: "chapterId[" + i + "]", value: chapterarray[i] }, 
            dojo.byId('moduleChapterForm'), 'last');
    }
    
    dojo.byId('moduleChapterForm').submit();
}
{% endhighlight %}

This method fetches each of the nodes in the <code>cartNode</code> Dojo ID (aka <code>cartContainer</code>) and for each of them creates a new DOM object (a hidden input element). This DOM object is appended last to the form, and then the form is submitted. I recognize that the JavaScript code could be cleaned up, and will likely do that soon.

Oh yea, what form? 

{% highlight html %}
<div dojoType="dijit.form.Form" name="moduleChapterForm" jsId="moduleChapterForm" id="moduleChapterForm" 
        method="post" action="<?php echo $this->url(array(), 'moduleChaptersSave'); ?>">
    <input type="hidden" name="moduleId" value="<?php echo $this->module->getId(); ?>" />
</div>
{% endhighlight %}

This is the dijit form that I use to add new input elements. Likely I could have used a regular form, but I don't really have the time to test it.

Hope this helps!
