---
comments: true
date: '2008-03-27 09:55:48'
layout: post
slug: php-arrays-in-html
status: publish
title: PHP Arrays in HTML
wordpress_id: '109'
categories:
- software development
tags:
- php
- code
- html
---

One of my friends who has used PHP in the past, but hasn't touched it in a while, recently asked me what the best was to handle mass edits and deletions on a page. To understand more what he's talking about, he has a form with a table of data, each containing checkboxes in a column labeled as <strong>Delete?</strong> He wants to know how he should handle the deleting multiple rows in a fast and efficient way. 

How it may have been done (and you may be doing it right now) might look like this:

{% highlight html %}
<form action="deleteCategories.php" method="post">
    <input type="checkbox" name="deleteCategory1" /> Category 1<br />
    <input type="checkbox" name="deleteCategory2" /> Category 2<br />
    <input type="checkbox" name="deleteCategory3" /> Category 3<br />
</form>
{% endhighlight %}

{% highlight php %}
<?php
if (isset($_POST['deleteCategory1'])) {
    deleteCategory(1);
}
if (isset($_POST['deleteCategory2'])) {
    deleteCategory(2);
}
if (isset($_POST['deleteCategory3'])) {
    deleteCategory(3);
}
{% endhighlight %}

The above code is highly inefficient, and if you're dealing with database records, I honestly don't see how your application would survive. You would have to add lines to deal with other records, which would make your application severely crippled, or extremely difficult to maintain - one of the two. 

The solution to this is simple: use an "HTML Array". When I say this, some people who have spent their lives working in HTML are going to say that HTML doesn't have arrays. Of course they don't. It's PHP, though, that does. However, you have to pass to PHP the "array" in a certain fashion so that when it loads up it's scripts, it knows its an array. Here's how it works.

In PHP, arrays are usually written to and read from like this:

{% highlight php %}
<?php
$phpArray['key']['subKeyPointsToValue'] = "Some value";
$phpValue = $phpArray['key']['subKeyPointsToValue'];

// Iterating is generally done as follows:
foreach ($phpArray as $key => $subArray) {
    foreach ($subArray as $subKey => $value) {
        // prints "subKeyPointsToValue = Some value"
        print $key." = ".$value; 
    }
}
{% endhighlight %}

So, in HTML, how on earth do you do arrays? You don't have an <array> element in HTML and you don't have any array attributes for any tags. The key is in how you name your input cells:

{% highlight html %}
<form action="deleteCategories.php" method="post">
    <input type="checkbox" name="delete[category][]" value="1" />Category 1<br />
    <input type="checkbox" name="delete[category][]" value="2" />Category 2<br />
    <input type="checkbox" name="delete[category][]" value="3" />Category 3<br />
</form>
{% endhighlight %}

What you see is I've named the checkbox fields the same name. In normal HTML land, this would be a no-no, and there's a way to get around it if it doesn't validate. That is, you simply switch to the following:

{% highlight html %}
<form action="deleteCategories.php" method="post">
    <input type="checkbox" name="delete[category][1]" />Category 1<br />
    <input type="checkbox" name="delete[category][2]" />Category 2<br />
    <input type="checkbox" name="delete[category][3]" />Category 3<br />
</form>
{% endhighlight %}

Now each checkbox has it's own name and doesn't overlap with others. We'll consider the first HTML set case 1 and the second case 2. Here's where the true PHP "magic" takes over and makes this a really powerful solution. You don't have to then check and delete with the following code:

{% highlight php %}
<?php
if (isset($_POST['delete[category][1]'])) {
    deleteCategory(1);
} // etc. for 2 and 3
{% endhighlight %}

The above code is horrible. If you're currently writing code like that above, slap yourself in the face with a nice wet fish. You're about to get a rude awakening. Here's how you're actually going to use it:

{% highlight php %}
<?php
// Case 1
foreach ($_POST['delete']['category'] as $id) {
    deleteCategory($id);
}
// Case 2
foreach ($_POST['delete']['category'] as $id => $dontcare) {
    deleteCategory($id);
}
{% endhighlight %}

In either case, only the checkboxes that are selected come through as the array, but in either case, PHP converts what looks like a name with special characters in HTML to an actual PHP array. It's very powerful and you can script code to handle what you need to and not have to worry about adding or changing it as your database grows. 
