---
comments: true
date: '2009-03-31 13:05:09'
layout: post
slug: php-meet-master-pages
status: publish
title: PHP, Meet Master Pages
wordpress_id: '107'
categories:
- software development
tags:
- php
- code
- layouts
- master pages
- zend framework
---

<strong>This was an article I began writing several months ago. I didn't want to abandon it, so I'm finishing it up now. It's merely an informational and doesn't contain a lot of depth. It's meant for the introductory users.</strong>

For those PHP developers who have been frustrated with how to create a standard layout for pages other than having to remember to put an opening div block after the header includes and a closing div block before the footer includes, listen up. Things are about to get much easier. In fact, those PHP developers who have done ASP.Net programming in the past, you're about to get much more pleased with PHP. The only drawback, which is more of a gain anyways, is you have to use the Zend Framework. Note that this topic is for those people who are not blessed withing already using a layout or template engine and are forced to do things <strong>the old way</strong>. Those of you who are using something like Smarty may not benefit from this, but keep reading anyways. :-D
<!--more-->
Meet <strong><a href="http://framework.zend.com/manual/en/zend.layout.html" target="_blank">Zend_Layout</a></strong>. This little friendly class is going to rock your world. Imagine, for a second, that you can create a single file with all of the static content pre-layed and in an almost strictly-HTML format and stop having to use <code>include()</code> or <code>require()</code> statements to make sure headers, footers, and other static content are loaded into your files. Imagine further that you can use this same file to load up content that's dynamically generated and not have to worry about the order in which your application processes to place it on your page. Both of these critical parts of web application development can now be achieved through <strong><a href="http://framework.zend.com/manual/en/zend.layout.html" target="_blank">Zend_Layout</a></strong>. 

So, you're probably wondering what horrific code I'm trying to get away from using. Imagine an application with code that looks like this:

{% highlight headers.php %}
<?php
$siteTitle = "Joe's eCommerce Website";

echo <<<EOD
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>{$siteTitle}</title>
    <link rel="stylesheet" href="css/style.css" type="text/css" />
    <meta name="description" content="{$siteDescription}" />
</head>
<body>
    <div id="navBlock">
EOD;

// Some nasty PHP code to generate a navigation bar right here.

echo <<<EOD
    </div>
    <div id="content">
EOD;
?>
{% endhighlight %}

{% highlight footers.php %}
<?php

echo <<<EOD
    </div>
    <div id="footers">
        <ul>
            <li><a href="aboutUs.php">About Us</a></li>
            <li><a href="faq.php">FAQ</a></li>
            <li><a href="privacy.php">Privacy Policy</a></li>
        </ul>
    </div>
</body>
</html>
EOD;
?>
{% endhighlight %}

Then, you're actual page that's supposed to do something looks like:

{% highlight listProducts.php %}
<?php
require_once "headers.php";

// Do some code that displays something like a table

require_once "footers.php";
?>
{% endhighlight %}

Or worse, suppose your file that actually does something looks like:

{% highlight anotherWeirdFile.php %}
<?php
require_once dirpath(__FILE__)."/../../config/site.conf.php";
require_once $_sys['application_root']."/includes/common/headers.php";
require_once $_sys['application_root']."/includes/common/javascript.php";
require_once $_sys['application_root']."/includes/common/css.php";
require_once $_sys['application_root']."/includes/common/openingBody.php";

// Again, code to do real work

require_once $_sys['application_root']."/includes/common/closingBody.php";
require_once $_sys['application_root']."/includes/common/footers.php";
?>
{% endhighlight %}

We can go further and show worse code samples than that, but I think you get the picture now, especially if you take into account an application where you have at least 25+ files all displaying data. Having to make sure that all of those files are 1) included at the top and bottom of your PHP files and 2) are in the correct order becomes a real big pain in the arse really quickly. Furthermore, the situation is complicated if you need to change the view based on certain criteria based in the processing section. You then have to do your processing first, and make sure that the data is returned rather than echo'ed straight to the response screen, or you have to buffer the output, capture the output and echo the buffer when rendering the view. It's all very nasty, and I've come across my fair share of poorly implemented rendering for PHP applications.

So, how do we fix this? Well, I will spare the details of how an application needs to be setup for use within the Zend Framework (because it's quite a detailed discussion). You'd be better off reading the Zend Framework documentation than reading what I'd have to say about it. The following is the only script like this in my software application. There's no repitition of this code, and none of my scripts have to include it via <code>require_once()</code>. 

{% highlight php %}
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
	// Set the title of the site last and the separator for the title
	$this->headTitle('CFEGroup');
	$this->headTitle()->setSeparator(' - ');
	
	echo $this->headTitle();
	echo $this->headStyle();
	if ($this->dojo()->isEnabled()) {
		$this->dojo()->setLocalPath('/js/dojo/dojo.js')
		             ->addStyleSheetModule('dijit.themes.tundra');
		echo $this->dojo();
	}
	echo $this->headScript();
	
	// Other Header information
	echo $this->partial('header.phtml');
?>
</head>
<body class="tundra">
<?php
    // Display the user status block
    echo $this->layout()->userstatus;
    
    // Display the navigation bar
    echo $this->layout()->navwidget;
    
    // fetch 'content' key using layout helper:
    echo $this->layout()->content; 
    
    // Display the footer
    echo $this->partial('footer.phtml');
    
    // Display any inline JavaScript (used by Dojo)
    echo $this->inlineScript();
?>
</body>
</html>
{% endhighlight %}

As you can see, though, there is PHP in the script. However, the sheer number of lines of code that this normally occupies is a LOT less. Furthermore, hooks are in place that allow me to specify in the view script of the application whether I depend on additional resources (e.g. CSS or JavaScript). So, below is an example of a view script I use on one of my pages.

{% highlight php %}
<?php
// Enable Dojo for this view
$this->dojo()->enable()
             ->setDjConfigOption('parseOnLoad', true)
             ->requireModule('dijit.Dialog')
             ->requireModule('dijit.form.Form')
             ->requireModule('dijit.form.ComboBox')
             ->requireModule('dijit.form.TextBox')
             ->requireModule('dijit.form.Button');
?>
<script type="text/javascript">
djConfig = { parseOnLoad: true }
</script>

<div dojoType="dijit.Dialog" id="deleteAddressDialog" title="Delete Address">
    <div dojoType="dijit.form.Form" name="deleteAddress" jsId="deleteAddress" id="deleteAddress" method="post"
          action="<?php echo $this->url(array(), 'addressDelete'); ?>">
        <script type="dojo/method" event="onSubmit">
            return true;
        </script>
        <input type="hidden" name="addressId" id="addressId" value="" />
        <p class="center">
            Are you sure you want to delete the following address?<br />
            <span id="delAddress"></span>
        </p>
        <div class="center">
            <button dojoType="dijit.form.Button" type="submit" onClick="dijit.byId('deleteAddressDialog').hide(); return false;"
                    iconClass="dijitEditorIcon dijitEditorIconCancel">No</button>&nbsp;
            <button dojoType="dijit.form.Button" type="submit" 
                    iconClass="dijitCheckBoxIcon">Yes</button>
        </div>
    </div>
</div>

<!-- Begin Display -->
<h2>My Addresses</h2>
<table cellpadding="0" cellspacing="0" border="0" class="data">
    <tr>
        <td colspan="8" class="create_row">
            <button dojoType="dijit.form.Button" iconClass="plusIcon" value="Add" 
                    onClick="window.location = '<?php echo $this->url(array(), 'addressAdd'); ?>'">Add</button>
        </td>
    </tr>
    <tr>
        <th>Action</th>
        <th>Type</th>
        <th>Street 1</th>
        <th>Street 2</th>
        <th>City</th>
        <th>State</th>
        <th>Zip Code</th>
        <th>Country</th>
    </tr>
    <tbody>
    <?php if (empty($this->addresses)): ?>
        <tr>
            <td colspan="8" class="emptyTable">
                <p class="center">
                    No addresses were found. Please add an address by clicking the <em>Add</em> button above.
                </p>
            </td>
        </tr>
    <?php else: ?>
    <?php foreach($this->addresses as $address): ?>
        <tr>
            <td>
                <button dojoType="dijit.form.Button" type="button" iconClass="dijitEditorIcon dijitEditorIconCut"
                        onClick="window.location.href = '<?php echo $this->url(array(
                            'addressId' => $address->getId()), 'addressEdit'); ?>'">Edit</button>&nbsp;
                <button dojoType="dijit.form.Button" type="button" iconClass="dijitEditorIcon dijitEditorIconDelete"
                        onClick="displayAddressDeleteDialog('<?php echo $address->getId(); ?>',
                                                            '<?php echo $address->getStreet1(); ?>',
                                                            '<?php echo $address->getStreet2(); ?>',
                                                            '<?php echo $address->getCity(); ?>',
                                                            '<?php echo $address->getState(); ?>',
                                                            '<?php echo $address->getZipCode(); ?>',
                                                            '<?php echo $address->getCountry(); ?>')">Delete</button>
            </td>
            <td><?php echo Core_Enum::getEnumOption($address->getType(), new Cfegroup_Person_Address_Type()); ?></td>
            <td><?php echo $address->getStreet1(); ?></td>
            <td><?php echo $address->getStreet2(); ?></td>
            <td><?php echo $address->getCity(); ?></td>
            <td><?php echo $address->getState(); ?></td>
            <td><?php echo $address->getZipCode(); ?></td>
            <td><?php echo $address->getCountry(); ?></td>
        </tr>
    <?php endforeach; ?>
    <?php endif; ?>
    </tbody>
</table>

<br />
{% endhighlight %}

This view script is rendered in the <code>echo $this->layout()->conent</code> area. This facet of the Zend Framework makes it really powerful with respect to being able to completely change the look-and-feel of a web site without having to change anything but HTML. Furthermore, you can build in areas for plugins that are supposed to be rendered by doing something similar to the following:

{% highlight php %}
<div class="headers">
    <div class="pluginArea">
        <?php echo $this->layout()->pluginArea; ?>
    </div>
    <div class="navigation">
        <?php echo $this->layout()->nav; ?>
    </div>
</div>
<div class="content">
    <?php echo $this->layout()->content; ?>
</div>
{% endhighlight %}

The above is a small snippet of a layout. If it were a partial, though, that would still be acceptable and the full layout would render the partial. 

In any case, this is just a small introduction to PHP Layouts. You'll find more information about layouts in the Zend Framework Reference manual and the many different books written on the Zend Framework. 
