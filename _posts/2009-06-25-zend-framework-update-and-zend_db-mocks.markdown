---
comments: true
date: '2009-06-25 19:02:22'
layout: post
slug: zend-framework-update-and-zend_db-mocks
status: publish
title: Zend Framework Update and Zend_Db Mocks
wordpress_id: '232'
categories:
- software development
tags:
- php
- code
- zend framework
- zend_db
---

Recently I upgraded one of my projects from 1.6.1 to the latest in branch-1.8.x of the Zend Framework. This resulted in most of my 1200+ unit tests breaking for that project. After several hours of trying to figure out the cause of the break, I managed to stumble onto the differences that is causing the problems I was experiencing.
<!--more-->
As I had blogged about in a recent post, the architecture of a couple of my Zend Framework applications involve me building a framework (of sorts) on-top of the Zend Framework, specifically for my applciation. This framework has it's own Data Access Layer (DAO) which utilizes the <code>Zend_Db_Table_Abstract</code> to query against the database. However, when I wanted to test just the DAO logic (and not the Zend logic), I needed a way to help make sure that happens. This is where mocking comes into play. 

In order to undertsand why PHPUnits mocking was not working, and what I had to do to fix it, it's necessary for me to explain the concept of mocking. Assume that you have 2 classes, a controller and a DAO. Assume the controller talks to the DAO to make queries against the database. When running unit tests against the controller, you don't want the DAO to actually connect to the database, much less worry about whether the logic in the DAO is valid or not. Mocking will help emulate the DAO, but because it's a runtime-configurable object, you can tell it what to expect and what to do if the conditions are met. This helps you present assumptions that everything is handled correctly by the DAO, leaving the controller tests to truly test only the controller. 

Now, typcially you will not actually mock an object, but rather mock an interface. The purpose behind this is important. When you mock an implemented class, typically the mock will execute the logic already programmed into that class, especially if it's declared <code>final</code>. When mocking an interface, none of the methods are actually implemented, so it becomes a true mock - everything is 100% runtime-programmable.

Now, when I upgraded the version of Zend Framework I was using, this is the error I started getting:

{% highlight text %}
Fatal error: Call to a member function quoteInto() on a non-object
{% endhighlight %}

This was for the following code:

{% highlight php %}
<?php
public final function deleteById($id)
{
    try {
        $where = $this->_dao->getAdapter()->quoteInto('id = ?', $id);
        $this->_dao->delete($where);
    } catch (Zend_Db_Exception $e) {
        throw new Cfegroup_Db_Exception('Unable to delete record from database.', $e->getCode(), $e);
    }
}
{% endhighlight %}

Note that <code>$this->_dao</code> is an instance of a <code>Zend_Db_Table_Abstract</code> object as a <code>StaticDao</code>. Now, when stepping through the code, everything seemed okay. In fact, the <code>Zend_Db_Table_Abstract</code> object held the instance of the <code>Zend_Db_Adapter_Abstract</code> that it was supposed to hold, but the getAdapter() method did not return it. 

The following subtle difference appeared between Zend Framework 1.6.1 and Zend Framework 1.8.x:

{% highlight diff %}
<     public function getAdapter()
---
>     public final function getAdapter()
{% endhighlight %}

The top is the newest version of the file and the bottom is the old. The <code>final</code> declaration had previously prevented the mock from being able to extend it and program it, whereas now the <code>getAdapter()</code> method is free to override and re-implement the method. However, when it's not progarmmed via runtime code, it fails to do anything - not even revert back to it's originally intended purpose. 

In short, I had to add a method to the <code>StaticDao</code> that declared the <code>getAdapter()</code> method as final. Once that was done, the mocks stopped overriding the method and the unit tests continued working. 
