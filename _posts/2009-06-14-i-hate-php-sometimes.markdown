---
comments: true
date: '2009-06-14 22:07:59'
layout: post
slug: i-hate-php-sometimes
status: publish
title: I Hate PHP Sometimes
wordpress_id: '223'
categories:
- software development
tags:
- php
- code
---

As one of the first few languages I learned, PHP has a special place in my heart. I am able to do a lot with the language. But sometimes, I wish that the core development team would actually make it into a full object-oriented language. See more of the story for the exact reason.
<!--more-->
I was writing a compare function in one of my objects. However, I ran into a problem with trying to use the original <code>compare()</code> function I created because it was static, and the way I was trying to call it won't be around until PHP 5.3.0:
{% highlight php %}
<?php
public function itemExists($item)
{
    $className = get_class($item);
    foreach ($this->_items as $lItem) {
        if ($className == get_class($lItem) &&
            $className::compare($item, $lItem) == 0) {
            return true;
        }
    }
    return false;
}
{% endhighlight %}

In a nutshell, being able to call a static function for a class through a variable won't be around till PHP 5.3.0. This is one of my pet peeves about PHP - not having all the OO features that other real OO languages already have.

Now, onto the second facet I hate - not being able to overload functions:

{% highlight php %}
<?php
/**
 * Performs a comparison between two objects of this type to determine if they're equal or different
 * 
 * Currently, the return value returns -1 if $a->_id < $b->_id, otherwise +1 if $a->_id > $b->_id. 
 * It returns 0 if the ids are equal.
 * 
 * @param   Module $a
 * @param   Module $b
 * @return  int
 */
public static function compare($a, $b)
{
	if ($a->getId() == $b->getId()) return 0;
	return ($a->getId() > $b->getId()) ? 1 : -1;
}

/**
 * Performs a comparison between this object and another object to determine if they're equal or equivalent
 * 
 * Refer to the rules of the static <code>compare()</code> function for the results of the comparison. 
 * 
 * @param   Module $object
 * @return  int
 */
public function compare($object)
{
	return self::compare($this, $object);
}
{% endhighlight %}

The result when running unit tests:
{% highlight text %}
Fatal error: Cannot redeclare Group::compare()
{% endhighlight %}

<strong>*fumes*</strong>
