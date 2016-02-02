---
comments: true
date: '2006-10-20 16:05:30'
layout: post
slug: getting-yelled-at
status: publish
title: Getting "Yelled" At
wordpress_id: '42'
categories:
- personal
- software development
- systems administration
tags:
- php
- code
---

Okay, so when I got into Work this past Friday, I was greeted by an email in my inbox asking about my sending of email over the weekend. Here's a nice little box that the administrator sent me:

{% highlight text %}
Host/Domain Summary: Messages Received
 msg cnt   bytes   host/domain
 -------- -------  -----------
 125555   288377k  HOST.tamu.edu
{% endhighlight %}

<!--more-->
<b>Background:</b>

Over the previous weekend I had established a really cool auto populating script that would help to automatically populate the Keystone test database with "hopefully" 300K+ emails so that I could have a nice amount of data to test Keystone with (as compared to our current test server with <800 slips in it - not a representative amount compared to production.

I'll post the scripts here in a moment, but this email didn't frustrate me. It was the email thereafter which did:

{% highlight text %}
Hi Chris,
	While it may add variety, it really isn't an appropriate use of the
University relays.  Please don't do this anymore.  You could have also
gotten variety by using aliases at a directly routeable host.  Thank you!

--Tom

Christopher Weldon wrote:
> > Tom wrote:
>> >> Hi Chris,
>> >>     You came up in this morning's log report as having sent over 125,000
>> >> messages through the relays yesterday.  Mind if I ask what's going on?
>> >> Thanks!
>> >>
>> >> --Tom
>> >>
>> >>
>> >> Host/Domain Summary: Messages Received
>> >>  msg cnt   bytes   host/domain
>> >>  -------- -------  -----------
>> >>  125555   288377k  HOST.tamu.edu
>> >>
> > 
> > I'm populating my keystone test database. All messages are coming from
> > the system and going back to the system, but many of the automatic
> > replies are going to my various aliases such as 'neraath@tamu.edu',
> > 'linux@tamu.edu', which end up going back to the system. It adds a
> > little variety to the slips I'm creating.
{% endhighlight %}

Much to his dismay, I ended up using several "local" aliases so that mail wouldn't be bounced off the relays. However, this weekend script (which was going to take 7 days to produce 300K+ emails) didn't go as expected, because the database maxed out @ 4GB. So, once I remade the database with the new limit in the dozens of Terabytes range, I needed to populate it really quickly. Thus, I ran about 20 threads of the script offset in 1 second increments with no more 5 second delay between processing. This started to populate the database VERY quickly, but also ate system resources like no other!

So, in all, about 700K+ emails were generated from my host, and as can be seen, 125K made it to the TAMU relays. My opinion: Big deal. The relays are used for sending messages out, and any administrator would realize that a "properly configured" (something that never happens @ TAMU) mail relay will be able to handle TONS of traffic. Additionally, WAY more SPAM goes through the mail relays (in the millions per day) than that and at least I was using the relays to actually do work, as opposed to appeasing my own hobbies. Thus, this should have been considered an "acceptable use of the relays". All in all, I don't like being talked down to by an administrator that has enough problems on his own trying to keep the damn relays from failing.

But, I guess one thing that's cool out of this entire thing: I beat out Facebook on the number of emails through the relay. :-D

<b>Scripts</b>

The way these scripts work is that it has an array of sources, from emails, and to emails to choose from. The "randomness" is really only pseudo-random numbers generated with PHP's <b>rand()</b> function. The sources, are <b>fortune</b>, <b>Local files</b>, <b>Cached News Stories from RSS Feeds</b>, and a few other things. 

{% highlight php %}
<?php
#----------------------------------------------------
# mass_mailer_script.php
# 
# Created by: Christopher Weldon
#
# Purpose: To use a variety of different "from" addresses
# and mass-mail Keystone to populate it's database in a quick manner.
#
#-------------------------------------------------------

ini_set('error_reporting', 2047);
ini_set('display_errors', 1);

$feedcache = array();

function getArticleFromFeeds() {
    global $feedcache;

    // Listing of Feeds I'd like to retrieve from
    $feeds = array(
                'http://planet.gentoo.org/rss20.xml',
                'http://slashdot.org/index.rss',
                'http://slashdot.org/apple.rss',
                'http://slashdot.org/linux.rss',
                'http://slashdot.org/science.rss',
                'http://slashdot.org/developers.rss',
                'http://slashdot.org/askslashdot.rss',
                'http://www.phparchitect.com/discuss/rdf.php?mode=m&l=1&basic=1',
                'http://hades.phparch.com/hermes/feednews/index.php',
                'http://www.nytimes.com/services/xml/rss/nyt/Business.xml',
                'http://www.nytimes.com/services/xml/rss/nyt/Arts.xml',
                'http://www.nytimes.com/services/xml/rss/nyt/Science.xml',
                'http://www.nytimes.com/services/xml/rss/nyt/Technology.xml',
                'http://www.nytimes.com/services/xml/rss/nyt/WeekinReview.xml',
                'http://rss.news.yahoo.com/rss/topstories'
    );

    // Figure out which one we want to use
    $chosen_feed = $feeds[rand(0,(sizeof($feeds)-1))];
    echo "Chosen feed is: ".$chosen_feed."\n";

    if (array_key_exists($chosen_feed, $feedcache) && sizeof($feedcache) > 0) {
        echo "Using the cached feed.\n";
        $article = $feedcache[$chosen_feed][rand(0,(sizeof($feedcache[$chosen_feed])-1))];
        return $article;
    } else {
        // Open the feed using fopen
        $feed = fopen($chosen_feed, "r");
        if (!$feed) {
            echo "There was a problem opening the feed!\n";
            exit();
        }

        include_once('XML/RSS.php');
        // download and parse RSS data
        $rss =& new XML_RSS($chosen_feed);
        $rss->parse();

        // print headlines
        // print_r($rss->getItems());
        $articles = $rss->getItems();
        unset($rss);
        fclose($feed);
        echo "Caching the feed.\n";
        $feedcache[$chosen_feed] = $articles;
        return $articles[rand(0,(sizeof($articles)-1))];
    }
}

function gen_email() {
    $from_addresses = array(
                        'Christopher Weldon &lt;neraath@tamu.edu&gt;',
                        'Chris Weldon &lt;linux@tamu.edu&gt;',
                        'Chris Test &lt;chris-test2@tamu.edu&gt;'
    ); /* This is normally a lot longer, but I cut it short as you should get the basic gist. */

    $to_addresses = array(
                        'HDC &lt;helpdesk@HOST&gt;',
                        'Keystone &lt;test-submit@HOST&gt;',
                        'Operations-Keystone &lt;test-submit-keystone@HOST&gt;'
    );

    $sources = array(
        'exec:/usr/bin/fortune',
        'feed:getArticleFromFeeds',
        'feed:getArticleFromFeeds',
        'feed:getArticleFromFeeds',
        'feed:getArticleFromFeeds',
        'feed:getArticleFromFeeds',
        'feed:getArticleFromFeeds',
        'file:/var/log/Xorg.0.log',
        'file:/var/log/keystone/webapp/alpha_keystone.log',
        'file:/var/log/keystone/webapp/alpha_php_error_log.log'
    );

    // First, figure out the source
    $source = $sources[rand(0,(sizeof($sources)-1))];
    list($type,$loc) = explode(':', $source);

    switch($type) {
        case 'file':
            $subject = 'Contents of '.$loc;
            $body = file_get_contents($loc, false);
            $must_be_to = 'test-noreply@HOST.tamu.edu';
            break;
        case 'feed':
            $ret_data = $loc();
            $subject = $ret_data['title'];
            $body = strip_tags($ret_data['description']);
            if (array_key_exists('dc:creator', $ret_data)) {
                $author = $ret_data['dc:creator'];
            }
            break;
        case 'exec':
            $subject = 'A new fortune for you on '.time();
            $body = shell_exec($loc);
            break;
        default:
            echo "Could not determine type!\n";
        return;
    }

    // Assemble the message
    if (isset($author)) {
        $from = $author.' &lt;linux@tamu.edu&gt;';
    } else if (isset($must_be_from)) {
        $from = $must_be_from;
    } else {
        $from = $from_addresses[rand(0,(sizeof($from_addresses)-1))];
    }

    $headers =      'From: '.$from."\r\n".
                    'X-Mailer: PHP/'.phpversion()." \r\n".
                    'X-Comment: Created from mass_mailer_script.php'."\r\n";

    if (isset($must_be_to)) {
        $to = $must_be_to;
    } else {
        $to = $to_addresses[rand(0,(sizeof($to_addresses)-1))];
    }

    echo "The following message: \n".
            "\tFrom: ".$from."\n".
            "\tTo: ".$to."\n".
            "\tSubject: ".$subject."\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "was sent successfully!\n\n";
    } else {
        echo "was unsuccessful!\n\n";
    }

//      sleep(5);
}

// START HERE
for ($i = 0; $i < 30000; $i++) {
    gen_email();
}

?>
{% endhighlight %}

{% highlight php %}
<?php
function get_article_from_feeds() {
    // Listing of Feeds I'd like to retrieve from
    $feeds = array(
                    'http://planet.gentoo.org/rss20.xml',
                    'http://slashdot.org/index.rss',
                    'http://slashdot.org/apple.rss',
                    'http://slashdot.org/linux.rss',
                    'http://slashdot.org/science.rss',
                    'http://slashdot.org/developers.rss',
                    'http://slashdot.org/askslashdot.rss',
                    'http://www.phparchitect.com/discuss/rdf.php?mode=m&l=1&basic=1',
                    'http://hades.phparch.com/hermes/feednews/index.php',
                    'http://www.nytimes.com/services/xml/rss/nyt/Business.xml',
                    'http://www.nytimes.com/services/xml/rss/nyt/Arts.xml',
                    'http://www.nytimes.com/services/xml/rss/nyt/Science.xml',
                    'http://www.nytimes.com/services/xml/rss/nyt/Technology.xml',
                    'http://www.nytimes.com/services/xml/rss/nyt/WeekinReview.xml',
                    'http://rss.news.yahoo.com/rss/topstories'
            );

    // Figure out which one we want to use
    $chosen_feed = $feeds[rand(0,(sizeof($feeds)-1))];
    echo "Chosen feed is: ".$chosen_feed."\n";

    // Open the feed using fopen
    $feed = fopen($chosen_feed, "r");
    if (!$feed) {
            echo "There was a problem opening the feed!\n";
            exit();
    }

    include('XML/RSS.php');
    // download and parse RSS data
    $rss =& new XML_RSS($chosen_feed);
    $rss->parse();

    // print headlines
    // print_r($rss->getItems());
    $articles = $rss->getItems();
    return $articles[rand(0,(sizeof($articles)-1))];
}
?>
{% endhighlight %}
