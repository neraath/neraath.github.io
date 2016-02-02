---
layout: post
title: "git interactive rebase for svn without remotes"
keywords: "git,svn,subversion,rebase,interactive,amend,history"
date: 2013-04-26 12:30
comments: true
external-url: 
categories: 
- Software Development
tags:
- git
---
I've recently switched from using Subversion directly to using [git svn](https://www.kernel.org/pub/software/scm/git/docs/git-svn.html) to allow me to use a git workflow, but interact with a subversion repository. It works *great*, except when I needed to interactive rebase...
<!--more-->
When moving this workflow into my customer's environment, they require I specify a JIRA ticket on each commit to the repo. I had forgot to do that for the first few commits, which looked like this:

{% highlight text %}
$ git log --oneline

6fa0719 Fixing the handlebars template to render the target as parent.
21ad0cf Initial commit of the SiteSuggestions app
6430b3b Adding the .gitignore files
095d92e SP-34: Creating branch to track the new suggestions app part.
{% endhighlight %}

So, when I tried to commit, I got an error indicating that the commit failed. In looking at the error, I saw the pre-commit hook error requiring that I associate the commit with a JIRA ticket. So, my first comment was easy to fix:

{% highlight text %}
$ git commit --amend -m "SP-34: Fixing the handlebars template to render the target as parent."
[2013-sitesuggestions-svn 6b4bc64] SP-34: Fixing the handlebars template to render the target as parent."
 1 file changed, 1 insertion(+), 1 deletion(-)
{% endhighlight %}

Now I just had to figure out how to modify commits ``21ad0cf`` and ``6430b3b``. I tried to use git interactive rebase as per the [git svn tutorial](http://trac.parrot.org/parrot/wiki/git-svn-tutorial) and per the [git-scm book](http://git-scm.com/book/en/Git-Tools-Rewriting-History). However, in both cases, I got the following error message:

{% highlight text %}
$ git rebase -i HEAD-3
fatal: Needed a single revision
invalid branch HEAD-3
{% endhighlight %}

The solution was to specify the SHA for the commit:

{% highlight text %}
$ git rebase -i 6430b3b^
{% endhighlight %}

This started the rebase process and allowed me to amend the commits for every faulted commit. Now, everything looks correct:

{% highlight text %}
$ git log --oneline

6fa0719 SP-34: Fixing the handlebars template to render the target as parent.
21ad0cf SP-34: Initial commit of the SiteSuggestions app
6430b3b SP-34: Adding the .gitignore files
095d92e SP-34: Creating branch to track the new suggestions app part.
{% endhighlight %}

When I finally committed using ``git svn dcommit``, everything went perfectly!
