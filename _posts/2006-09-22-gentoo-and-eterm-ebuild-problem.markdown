---
comments: true
date: '2006-09-22 17:20:01'
layout: post
slug: gentoo-and-eterm-ebuild-problem
status: publish
title: Gentoo and Eterm Ebuild Problem
wordpress_id: '37'
categories:
- systems administration
tags:
- gentoo
- eterm
- ebuild
- linux
---

If you by chance be building <strong>eterm</strong> in Gentoo and get the following error:

{% highlight text %}
gcc -Os -march=pentium4 -pipe -o .libs/Eterm main.o  -L/usr/lib -L/usr/X11R6/lib ./.libs/libEterm.so /usr/lib/libImlib2.so
/usr/lib/libfreetype.so -lz /usr/lib/libttf.so -ldl -lutempter /usr/lib/libast.so -lSM -lICE /usr/lib/libpcre.so -lXmu -lXext -lX11
-lutil -lm -Wl,--rpath -Wl,/usr/lib:/usr/lib/Eterm
./.libs/libEterm.so: undefined reference to `imlib_render_pixmaps_for_whole_image'
./.libs/libEterm.so: undefined reference to `imlib_context_set_display'
./.libs/libEterm.so: undefined reference to `imlib_render_pixmaps_for_whole_image_at_size'
./.libs/libEterm.so: undefined reference to `imlib_context_set_colormap'
./.libs/libEterm.so: undefined reference to `imlib_context_set_drawable'
./.libs/libEterm.so: undefined reference to `imlib_context_set_visual'
./.libs/libEterm.so: undefined reference to `imlib_free_pixmap_and_mask'
collect2: ld returned 1 exit status
make[2]: *** [Eterm] BÂ³Â±d 1
make[2]: Leaving directory `/var/tmp/portage/eterm-0.9.3-r4/work/Eterm-0.9.3/src'
make[1]: *** [all-recursive] BÂ³Â±d 1
make[1]: Leaving directory `/var/tmp/portage/eterm-0.9.3-r4/work/Eterm-0.9.3'
make: *** [all-recursive-am] BÂ³Â±d 2 

!!! ERROR: x11-terms/eterm-0.9.3-r4 failed.
!!! Function src_compile, Line 54, Exitcode 2
!!! make failed
{% endhighlight %}

Then you have a USE flag problem. I'm seeing a lot more of them recently. 

Anywho, your solution is:
{% highlight text %}
root#> USE="X" emerge imlib imlib2 eterm
{% endhighlight %}

This should compile it nicely. :-)
