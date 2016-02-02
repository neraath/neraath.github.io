---
comments: true
date: '2006-06-26 15:30:09'
layout: post
slug: xorg-and-nvidia-drivers-for-linux
status: publish
title: xOrg and nvidia drivers for Linux
wordpress_id: '9'
categories:
- systems administration
tags:
- linux
---

This is for a Debian system, but should work for any Linux box. The essential problem is that whenever you run an update for the nVidia drivers or xOrg or your Kernel, you might not be able to get into X. After laboriously trying to figure out still why X doesn't load, you go to Google and miraculously come here. Then, you continue reading to find the solution.

Starting in xOrg version 7, they are no longer using the <code>/usr/X11R6</code> as the primary directory for all the X stuff. They still have some lingering items in there, but the move towards <code>/usr/lib/xorg</code> is happening very quickly. As such, the traditional nVidia driver installer is still trying to use the <code>/usr/X11R6</code> rather than the new <code>/usr/lib/xorg</code> as the directory to install it's glx module into. 

So, here's what happens when you update your drivers. nVidia compiles it and installes the nvidia module hopefully in the proper location, but the glx module does not get put in the proper directory. So, when you try to start X after loading the new nvidia module, you get logs that look like the following:

{% highlight text %}
--snip--

(II) Loading sub module "GLcore"
(II) LoadModule: "GLcore"
(WW) Warning, couldn't open module GLcore
(II) UnloadModule: "GLcore"
(II) UnloadModule: "glx"
(II) Unloading /usr/lib/xorg/modules/extensions/libglx.so
(EE) Failed to load module "glx" (a required submodule could not be loaded, 0)
(II) LoadModule: "int10"
(II) Loading /usr/lib/xorg/modules/libint10.so
(II) Module int10: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.0.0
        ABI class: X.Org Video Driver, version 0.8
(II) LoadModule: "record"
(II) Loading /usr/lib/xorg/modules/extensions/librecord.so
(II) Module record: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.13.0
        Module class: X.Org Server Extension
        ABI class: X.Org Server Extension, version 0.2
(II) Loading extension RECORD
(II) LoadModule: "type1"
(II) Loading /usr/lib/xorg/modules/fonts/libtype1.so
(II) Module type1: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.0.2
        Module class: X.Org Font Renderer
        ABI class: X.Org Font Renderer, version 0.4
(II) Loading font Type1
(II) LoadModule: "vbe"
(II) Loading /usr/lib/xorg/modules/libvbe.so
(II) Module vbe: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.1.0
        ABI class: X.Org Video Driver, version 0.8
(II) LoadModule: "nvidia"
(WW) Warning, couldn't open module nvidia
(II) UnloadModule: "nvidia"
(EE) Failed to load module "nvidia" (module does not exist, 0)
(II) LoadModule: "kbd"
(II) Loading /usr/lib/xorg/modules/input/kbd_drv.so
(II) Module kbd: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.0.1
        Module class: X.Org XInput Driver
        ABI class: X.Org XInput driver, version 0.5
(II) LoadModule: "mouse"
(II) Loading /usr/lib/xorg/modules/input/mouse_drv.so
(II) Module mouse: vendor="X.Org Foundation"
        compiled for 7.0.0, module version = 1.0.4
        Module class: X.Org XInput Driver
        ABI class: X.Org XInput driver, version 0.5
(EE) No drivers available.

Fatal server error:
no screens found
{% endhighlight %}

Great, so first you notice glx is unable to be loaded and then nvidia can't be loaded. Now what to do? Well, time to go back and recompile the nVidia driver with new options.

Basically, you need to point the installer at the new modules directory. Don't try to run the installer with the '--x-prefix' directive, as the nVidia driver won't compile correctly. You need to run the following command:

{% highlight text %}
#> ./NVIDIA-Linux-x86-1.0-8762-pkg1.run -anN --x-module-path=/usr/lib/xorg/modules
{% endhighlight %}

You don't technically need the '-anN' on the front, but I used it to auto accept the license and not to download updates from the nVidia website (I was having problems with the internet at the time). It should compile correctly and install in the proper place. 

Cheers. 
