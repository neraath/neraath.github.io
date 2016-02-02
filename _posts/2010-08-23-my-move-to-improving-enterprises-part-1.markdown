---
comments: true
date: '2010-08-23 12:03:10'
layout: post
slug: my-move-to-improving-enterprises-part-1
status: publish
title: My Move to Improving Enterprises, Part 1
wordpress_id: '281'
categories:
- personal
- software development
- systems administration
tags:
- .net
- automation
- continuous integration
- gentoo
- linux
- PHP
- phpunit
- postgresql
- Systems Administration
- wcf
- wpf
- zend framework
---

This blog article has turned into a ridiculously long posting that I'm splitting into 2, possibly 3 parts. The series pretty much recaps what I did at the College of Architecture and what I'm doing at Improving Enterprises. Enjoy!

For those who have been following my <a href="http://twitter.com/neraath">Twitter</a> stream, I am no longer employed by the <a href="http://www.arch.tamu.edu/" target="_blank">College of Architecture</a> at <a href="http://www.tamu.edu" target="_blank">Texas A&M University</a>. I have joined the ranks of <a href="http://www.improvingenterprises.com/">Improving Enterprises</a> (<a href="http://twitter.com/improving">@improving</a> on Twitter) as a Consultant! I have been a consultant for quite some time. My consulting started with my business, <a href="http://www.cerberusonline.com/">Cerberus</a>, then with the work I did on behalf of CIS Customer Applications, and finally consulting on my own. There were several reasons why I decided to leave the university, and continuing down the path of being a consultant was certainly one of them. In this post, I plan on discussing some of the reasons why I left the university, and what life has been like at Improving Enterprises since I've left. 
<!--more-->
My tenure at the College of Architecture was fun and exciting (initially) and we (the IT team) managed to <strong>completely</strong> revamp our infrastructure from the ground-up. When we inherited the infrastructure after the latest IT team turnover, it was in a very poor situation. There was no redundancy between services, no high availability, and no scalability. There was a single web server, a single Microsoft Exchange server, a couple of domain controllers, a single DHCP server, and two separate file servers. Some of these servers were dedicated hosts, and some of them were hosted using VMware Server. Backups were failing intermittently. The infrastructure was expect to support close to 250 faculty and staff and around 1500 students, and it goes without saying that it was struggling to do so. 

One of the first things we undertook was to get a current-state backup and ensure that backups continued both regularly and successfully. From there, we acquired nearly 12 new servers to replace the then 4-to-6-year-old servers that weren't standardized. We had dual needs to get both our Windows infrastructure in a stable state as well as to spool up a UNIX infrastructure (reasons below). While testing out which direction we wanted to go with, we tried Microsoft Hyper-V for Windows virtualized hosting. While it was certainly a strong competitor to that of VMware ESX, it definitely left a bitter taste in our mouth and left us wanting more. For starters, it didn't provide a way to over-budget resources on servers. Additionally, it didn't provide a way to dynamically migrate virtual machines from host-to-host without shutting it down (aka vMotion in VMware parlance). Finally, the performance of the virtual machines seemed to be slower than virtual machines hosted through VMware ESX. 

I started the journey with *NIX environment setup with Solaris 10, at the recommendation of our IT Director, Nolan Flowers. The reason he recommended it was because of the built-in Zones, which in essence was Solaris' virtual machine hosting environment. Sadly, however, the PowerEdge 2650s I was trying this out on were terribly slow for virtual machine hosting. Then, when I tried to put Solaris 10 on our then-new PowerEdge 1950s, the installation failed indicating that there was a problem loading hard disk drivers for our SAS controllers. This put a quick end to doing Solaris virtualization.

In any case, we decided to switch the direction we decided upon from Microsoft Hyper-V and Solaris Zones to VMware ESX. Thankfully, we made the decision at the right time as ESX 4.0 was just released and put vMotion at our fingertips with an Advance license purchase rather than an Enterprise license. Myself and Derek Groh managed to setup our environment to be highly available as a result of our purchase of an IBM-branded NetApp FAS 2050 and using iSCSI disk access. This device was pure genius and was <strong>extremely</strong> versatile and robust. We only had one disk throw and one incident where it contacted IBM support of an alert condition, only to find out that the controller was not seated properly. 

Once we got ESX up-and-running, I started spooling up our Linux virtual infrastructure. One of the other key responsibilities I had at the College was in setting up and maintaining a stable, scalable, and useful Linux infrastructure. This infrastructure was necessary to host the Atlassian software (see below) and to provide a better platform for web and application hosting within the College. Because the majority of the visible web presence for the College was due to be converted to PHP, I wanted to ensure that we were hosting on a Linux infrastructure. I say this because at the time of making that decision, PHP hosting on Windows was still a significant pain and would have taken me significantly longer to setup and maintain.

I spent a good deal of time talking with Nolan and having internal debates of whether to go with the universally-recognized RedHat or SuSE enterprise flavors of Linux, or go with what I know (Debian and Gentoo). I opted to go with the flavor that I had been running for so long at Cerberus - Gentoo. I love this distro. It's extremely configurable, super fast, and above-all: stable. While many of the complaints on Gentoo have been it's long computation times, I find that the stability of the distro far outweighs the length of compilation time of all the packages. For those anti-Gentoo enthusiasts out there, check out <a href="http://distcc.samba.org/">distcc</a> - that's what brings down the overall computation time. 

I knew from the get-go that individual logins on each of the virtual machines was not going to work out well. My previous sysadmin experience definitely taught me that having to manage individual accounts across dozens of systems gets to be an exponential pain REAL fast. Thus, I started looking into whether or not I wanted my machines integrated with Active Directory or to spawn my own OpenLDAP. When it got down to it, I knew I was going to have a much easier time moving towards OpenLDAP rather than integrating with Active Directory. The latter required modifications to the AD schema which was <strong>not</strong> possible because we were not Forest Administrators - <a href="http://cis.tamu.edu/">CIS</a> controlled that. Thus, I started my own OpenLDAP server and had integrated authentication and authorization on my Gentoo virtual machines rather quickly. Further revisions allowed me to enable sudo configuration via LDAP.  

Finally, the last piece of systems administration that I loved working with was <a href="http://www.puppetlabs.com/">Puppet</a>. For any individual running multiple Linux systems, this is an absolute <strong>must</strong> if you want to start automating your environment. When I started spooling up half a dozen new web servers and realizing that I was typing the same commands to install Apache, PHP, etc. on them, I then asked myself the same question that I do when I develop software: why am I repeating myself? Puppet helps to avoid that. In fact, if you have a way to have your provisioning steps automatically assign an IP address and hostname to your virtual machine, then you can have all packages and necessary updates installed to your VM template without touching the VM - Puppet handles all of this. It really allowed me to move away from systems administration and concentrate on software development (again) for the last 6 months of working at the College. 

During this entire process, I spent a good deal of time learning how to properly administrate the full <a href="http://www.atlassian.com/">Atlassian</a> suite of software. Our localized installation included <a href="http://www.atlassian.com/confluence/">Confluence</a>, <a href="http://www.atlassian.com/jira/">JIRA</a>, <a href="http://www.atlassian.com/crowd/">Crowd</a>, <a href="http://www.atlassian.com/bamboo/">Bamboo</a>, and <a href="http://www.atlassian.com/crucible/">Crucible</a>. Being able to administer these software installations had to have been one of my favorite tasks at the College. I managed to become quite well-versed in the various problems that could occur during any stage of using the software, became an expert at performing installations (both for the College and personally), and became very familiar with the various features available as an end-user and an administrator. This, in addition to the heavy amount of software development we were doing at the College, led me to documenting a plethora of infrastructure and software documentation. It also allowed me to be able to have the flexibility of being able to plan software projects in an Agile context. All of this has led me down the path of becoming an Atlassian Evangelist. Be prepared to see more posts on the use of the Atlassian software. 

In summary, all of the different systems software that I worked with and gained or continued to grow my expertise in were the following:
<ul>
<li>Solaris</li>
<li>Gentoo Linux</li>
<li>VMware ESX</li>
<li>Windows Server 2008</li>
<li>NetApp OnTap</li>
<li>Microsoft Hyper-V</li>
<li>Nagios</li>
<li>Cacti</li>
<li>Puppet</li>
<li>Atlassian JIRA, Confluence, Crowd, Fisheye, Crucible, and Bamboo</li>
<li>PostgreSQL</li>
<li>MSSQL Administration</li>
</ul>

<h3>Software</h3>

I know this is getting to be quite a long post, but I intend to encapsulate my <em>entire</em> experience at the College prior to my departure. For you software developers, this is the section for you. 

The first major software project undertaking wasn't the new <a href="http://www.arch.tamu.edu/">College web site</a>, nor was it the revamp of the <a href="http://its.arch.tamu.edu/">ITS web site</a>. Instead, it was the <a href="http://researchsymposium.arch.tamu.edu/">Research Symposium</a>. This was a quickly assembled web application that didn't have an administrative interface. It was dynamically-driven, but required manual entry of all information into the database. Why? Because we were given less than 3 weeks to put this application together and get information out to the public before the event occurred. Why so quickly? Our Assistant Dean of Research, Lou Tassinary, continued to allow late submissions to the symposium - up until about a week before the event occurred. This prevented the book that typically goes along with the symposium from being sent to the publisher with enough lead time for it to be available by the event. Thus, the alternative was the web application. 

Once that was complete, our focus did shift to the main <a href="http://www.arch.tamu.edu/">College of Architecture</a> web site. By this point in time, Jorge Vanegas had been appointed the interim Dean of the College and set our goals for revamping the College's web site. He set up the task force that included myself and my graduate assistants, and Phillip Rollfing and his grad assistants. We set about by polling everyone at the College (Staff, Faculty, and Students) what they thought was deficient, could be improved, etc. Furthermore, we applied what we knew was missing and validated those assumptions with the results that came back from the polls we performed. 

Before we even started considering a design, we needed to figure out the information architecture for the new site. We did this by analyzing what information we had that we must keep, what we needed to enhance, and ultimately, what we needed to add. From there, we had to figure out how best to organize it in order to drive users to the parts of the web site they want to get to. This was at least a one-month endeavor that entailed researching patterns of information architecture from other web sites, performing research by other information architects, etc. in order to finally decide in our final architecture. 

The last step before we could start working on the design was to figure out what dynamic elements we needed to have on the site. We knew that we would want a calendar of events and the top-most articles from the archone newsletter, but we also needed to consider what else might appear on the front of the web site. Once we figured that we needed spaces that could be interchanged into thirds, we set our designers to the task of developing a design for the site. While they did that, I started on the framework for our new web presence.

At this point, some of y'all will be asking why I didn't just simply start integrating the design within an existing CMS such as Plone, Drupal, or Wordpress. First: Wordpress is not a CMS. My arguments regarding this can easily take up another blog post, so I won't discuss this here. But, the ultimate reason we were developing our own framework was because we <strong>weren't</strong> rolling our own CMS. The Division of Marketing & Communications at the university level were working with the TAMU developer and systems administrator community to stand up and host a truly enterprise CMS - Percussion. This CMS worked exactly as I would want it to - it provided the appropriate controls to allow site administrators to setup the workflows of approvals that content changes would have to go through before being published, gave the ability to integrate (some) dynamic information that would be shared across multiple sites, and most importantly, was distributed. By distributed, I mean it is a push-based CMS. This was more idealistic than a database-driven CMS for multiple reasons:
<ul>
<li>If your database goes down, your web site goes down. With static pages, your web site does not necessarily have to go down if your database goes down.</li>
<li>If your CMS dies, your web sites are still available. If your web servers die and are completely unrecoverable, when you stand a new one up, you don't have to go to backups to recover your web content - just push it from the CMS again and all is well.</li>
<li>Dozens (if not hundreds) of sites can all be managed by a single CMS engine, but all of those sites can be hosted on any combination of IIS, Apache, lighthttpd, nginx, etc. web servers. Because the CMS pushes content down to the servers - it's completely agnostic of the delivery mechansim.</li>
</ul>

With this, we developed the new web framework with the expectation that we would be pushing the static content from the Percussion CMS. In this, we had a single directory dubbed <code>content</code> that we had all of our content pages and structure. Furthermore, I had to develop a breadcrumb generation system for this framework that could walk up the path of the directories to be able to generate all of the hyperlinks for the breadcrumbs. This was a simple, yet interesting, challenge, particularly when dealing with if you were directly referencing an index page or the directory. 

Other dynamic pieces that we started moving over from the old web framework to the new web framework were the Outstanding Alumni lists, scholarships, and In Memory Of, all of which were CRUD-based info. The next largest challenge was trying to move the directory into the new framework. 

The college directory was exactly what you think it was: a listing of all faculty and staff within the College of Architecture. However, since it is a dynamic set of pages driven from info in the database, we could filter results based on the department or center an individual was a part of, do name-part searches, and also restrict their type (staff or faculty). But, over the course of my first 6 months at the college, my analysis of the needs of the college, departments, and centers, in addition to IT needs, really brought up the fact that our problems extended much beyond that of a simple directory: we needed a system that gave all members with association at the college (employees and students) identity management. 

This was identified in multiple ways - the single most important way was inconsistent information across web sites. Since (most) center web sites and a couple of departmental web sites were not managed by ITS at the time of the evaluation, the information portrayed on the different sites regarding faculty and staff could vary quite a bit. By varying, it could present more or less information than other sites and in completely different style. Ultimately, the largest problem was ensuring the information was up-to-date. Anytime an employee changed their office, their phone number, their title, or any other piece of information that was (generally) consistent across web sites, they had to contact at least 3 people to ensure that update was recorded. Furthermore, <strong>none</strong> of the departments or centers listed all of the publications, ongoing research, or other achievements of their faculty - it was up to them to post to their own faculty web site. Because we had no centralized database of this information, we could not generate reports or metrics in any timely manner of the achievements of our faculty. We were not promoting them, and thus not promoting the College. 

When it came to terminating or hiring individuals, there was no consistency in terms of when their account was disabled and subsequently terminated. There was no consistency of when accounts were established, and ensuring the proper trail of who was responsible for vetting the account's creation didn't really exist. This was obviously a process that needed more formality. 

I started looking at identity management solutions that would provide us the most flexibility. Our core requirements were as follows:
<ul>
<li>Giving human resources the ability to create and disable accounts at-will, in addition to other account management tasks such as updating titles, contact information, etc.</li>
<li>Giving directory administrators (the dean's office staff) the ability to update directory and contact information for any staff and faculty member within the College.</li>
<li>Giving individuals the ability to manage their own directory information.</li>
<li>Being able to track the following items per faculty member:
<ul>
<li>Papers, articles, presentations, and other published materials</li>
<li>Research projects (current and completed)</li>
<li>Funds brought into the university</li>
<li>PhD students advised</li>
<li>Other information as necessary</li>
</ul></li>
</ul>

Without delving into too much detail, the most optimal solution for this was a web service, particularly a WCF web service. It was necessary that the information to be provided through this service was going to be consumed by multiple applications (both internal and external), thus the need to use a web service rather than a database. Furthermore, it was critical that we use a .Net platform for hosting since we needed the hooks to integrate with Microsoft Active Directory for lifecycle management. The design also had to use two different data contracts for much of the data. Some of the data was public to everyone (per State law), and some of the data was hidden (due to other regulations and policies). Thus, to certain web applications, it was necessary to have a data contract that exposed and received all information (that way our internal users could manage it). For other internal applications and some external users, it was important that we serve out a publicly consumable data contract that didn't expose the private information. 

Sadly, I almost got to the first production release. It took 2 iterations (roughly 6 weeks) to develop the database design and start implementing the basic service set. Using Spring.Net's IoC containers, though, really helped speed up the process of auto-wiring the dependencies and the translations between the service, business, and data layers. Furthermore, I worked very closely with NHibernate rather than using LINQ-to-SQL as I didn't want to have to run a build script to regenerate my data model after each change to the database. 

I have more software projects that I want to discuss, but will leave that for the topic of my next post. 
