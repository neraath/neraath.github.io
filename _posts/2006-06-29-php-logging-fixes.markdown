---
comments: true
date: '2006-06-29 09:24:50'
layout: post
slug: php-logging-fixes
status: publish
title: PHP Logging Fixes
wordpress_id: '11'
categories:
- software development
tags:
- php
- logging
- code
---

I encountered a problem with an application I was working on the other day that was running on a machine with an older version of PHP (version 4.2.3 I believe). Essentially, the problem was with trying to set the PHP ini variable <code>error_prepend_string</code>. What this variable is supposed to do is the following:

Suppose I have the following blip of code:

{% highlight php %}
<?php
    $arr = array(0 => 'zero', 1 => 'one', two => 'Two?');

    for ($n = 0; $n &lt; sizeof($arr); $n++) {
        echo '['.$n.'] =&gt; "'.$arr[$n].'"<br />';
    }
{% endhighlight %}

For anyone that knows PHP, they will undoubtedly realize that their output will look like the following:

{% highlight html %}
[0] => "zero"
[1] => "one"
[2] => "" <strong>Notice: </strong> Undefined index: <strong>2</strong> in <strong>/www/code/file.php</strong> on line <strong>5</strong>
{% endhighlight %}

<!--more-->
Well, if I had the following blip of code, I would be able to see some more debugging information and/or some cool coloring:

{% highlight php %}
<?php
        $username = 'chris'; # Pretend this is set somewhere else to a legitimate username
        ini_set('error_prepend_string', '<p style="font-color: #F00;">Username: '.$username);
        ini_set('error_append_string', '</p>');
        $arr = array(0 => 'zero', 1 => 'one', two => 'Two?');

        for ($n = 0; $n &lt; sizeof($arr); $n++) {
            echo '['.$n.'] =&gt; "'.$arr[$n].'"<br />';
        }
{% endhighlight %}

and the output would look like the following:

{% highlight html %}
[0] => "zero"
[1] => "one"
[2] => "" <p style="font-color: #F00;">Username: chris<strong>Notice: </strong> Undefined index: <strong>2</strong> in <strong>/www/code/file.php</strong> on line <strong>5</strong></p>
{% endhighlight %}

Now, this makes it easier to debug, and you can do some cool styling to this to make it easier on the eyes. However, in production environments where you don't want these messages printed to the screen, you generally log it to a file. That's where PHP's <strong>log_errors</strong> and <strong>display_errors</strong> ini settings come into play. If you set them to <strong>1</strong> and <strong>0</strong>, respectively, PHP will log it to the error log set in apache by default. You can also set the ini setting <strong>error_log</strong> to a file and it will log to that, rather than Apache's error log (assuming the file has the appropriate write permissions on it).

So, we reach the actual problem with the logging. Somehow, in the version of PHP on the server, the error log only shows the following line for the same code above:

{% highlight text %}
[Wed Jun 28 14:46:53 2006] [error] PHP Notice: Undefined index: 2 in /www/code/file.php on line 5
{% endhighlight %}

So what happened to my prepended and appended settings? They're completely toast here. I haven't had a chance to look at the actual PHP source yet to figure out if this is an ongoing bug, but it's pretty apparent that we won't be able to get any debugging information here. 

Essentially, I was hoping to log the username prepended here so that I can tail the file (<strong>`tail -f log_file.txt | egrep '(neraath|chris)'`</strong>) and grep out just my username, since we have multiple developers on this thing, and it's a pain to see their errors and think they're yours.

So, what can I possibly do in this situation? Well, this is something I found out yesterday, but you just replace the standard PHP error_logging function with one you write on your own! Now, if you think about this, you might think that that's a big hoax, because you would have to code the actual source of PHP recompile it from scratch, yada yada yada. Well, no. That's not the case. You can actually write your own logging function inside PHP and then use a PHP built-in function to tell PHP to use it from now on. Here's how:

{% highlight php %}
<?php
        function error_handling ($level, $message, $file, $line) {
            global $user;

            if (!($level & error_reporting()) || !(ini_get('display_errors') || ini_get('log_errors'))) {
                return;
            }

            switch ($level) {
                case "E_NOTICE":
                case "E_USER_NOTICE":
                    $type = 'Notice';
                    break;
                case "E_WARNING":
                case "E_USER_WARNING":
                    $type = 'Warning';
                    break;
                case "E_ERROR":
                case "E_USER_ERROR":
                    $type = 'Fatal Error';
                    break;
            }

            if ((bool) ini_get('display_errors')) {
                printf("<p style='font-color: #F00;'>Username: <strong>%s</strong> ".
                         "- <strong>%s</strong>: %s in <strong>%s</strong> on line ".
                         "<strong>%d</strong></p>\n", $user, $type, $message, $file, $line);
            }

            if ((bool) ini_get('log_errors')) {
                error_log( sprintf("[%s] %s: %s in %s on line %d\n", $user, $type, $message, $file, $line));
            }

            if ($exit === true) {
                exit();
            }
        }

        set_error_handler('error_handling');

        // Rest of code from above
?>
{% endhighlight %}

That code will give me the desired result in the log file like such:

{% highlight text %}
[Wed Jun 28 14:46:53 2006] [error] [chris] PHP Notice: Undefined index: 2 in /www/code/file.php on line 38
{% endhighlight %}

Cheers. :-)
