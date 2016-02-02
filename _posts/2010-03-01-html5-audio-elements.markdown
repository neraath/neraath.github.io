---
comments: true
date: '2010-03-01 21:33:07'
layout: post
slug: html5-audio-elements
status: publish
title: HTML5 Audio Elements
wordpress_id: '264'
categories:
- software development
tags:
- chrome
- firefox
- html
- html5
- safari
- webkit
---

One of the side projects I'm working on involves having users listen to audio files and fill out information in response to the audio files they listen to. Some audio files will be short (e.g. 5 seconds or less), but others may be long, say a few minutes to an hour or longer. These audio files are typically voicemails or ditcations, so people can have a tendency to leave long breaks between words, will talk slowly, etc., thus slowing down the listening process. The goal: figure out a way to allow the users to speed up (or slow down) the audio files as much as they would like without having to process the audio files on the server ahead of time. The possible solution? HTML5
<!--more-->
I figured the solution here would be HTML5! The <a href="http://dev.w3.org/html5/spec/Overview.html#dom-media-playbackrate">HTML5 Spec</a> supports <code>&lt;audio&gt;</code> and <code>&lt;video&gt;</code> elements. <strong>Furthermore</strong>, it calls for the support of varying the playback speeds through a nice little object property called <code>playbackRate</code>. This object allows audio to be played back in multiples of speeds either faster (or slower) than the original audio file speed (which is governed by the <code>defaultPlaybackRate</code> property). The specification even states that browser should support a negative <code>playbackRate</code> to allow audio and video files to be played in reverse. Really cool stuff!

I start my development on <a href="http://www.getfirefox.com/">Mozilla Firefox</a> for the most part. And, I've been fairly satisfied with their speed of development and keeping up with developer trends. No, I won't go into flaming Mozilla for choosing not to support MP3s in this post, but rather state my perplexity as to why they're the only browser that doesn't support the <code>playbackRate</code> property and the <code>ratechange</code> event. 

However, for the browsers that did correctly increase or decrease the speed of the audio playback, I was quite impressed at their ability to maintain pitch. This is key for what we're trying to accomplish in this project. However, where there was lack of pitch variances, there was not a lack of noise being introduced. Granted, when I checked the process monitor while the rate of playback was being adjusted, I was surprised that there was no change in CPU or memory utilization for either Chrome or Webkit. So, by gaining performance, we unfortunately have to sacrifice the cleanliness of the output. 

Here's my results thus far:

<table border="1" cellpadding="5" cellspacing="0" style="margin-bottom: 1em;">
<tr><th>Browser Name</th><th>ratechange Supported?</th><th>Noise?</th></tr>
<tr><td>Mozilla Firefox</td><td></td><td>N/A</td></tr>
<tr><td>Google Chrome 4</td><td>Yes</td><td>Yes (minimal)</td></tr>
<tr><td>Webkit (aka Apple Safari)</td><td>Yes</td><td>Yes (heavy)</td></tr>
<tr><td>Opera 10</td><td>N/A</td><td>N/A</td></tr>
<tr><td>Internet Explorer</td><td>N/A</td><td>N/A</td></tr>
</table>

As for Opera 10, I had immense problems getting it to wire up and play successfully that I eventually abandoned it. Internet Explorer? You've got to be joking. Like they'll support a standard anytime in the near future. :-P

Other oddities that I noticed was skipping around audio files in <strong>any</strong> of the browsers caused some unexpected turmoil for the playback. Many times, playback would altogether stop, and many other times I couldn't resume the playback from the current position even after being stopped. Other oddities include seeking simply resetting the position back to 0. 

In a nutshell, the browsers are well on their way to supporting <code>&lt;audio&gt;</code> and <code>&lt;video&gt;</code>, but for production use I'm very apprehensive about supporting it at this time because of the sheer number of bugs/unimplemented features. 
