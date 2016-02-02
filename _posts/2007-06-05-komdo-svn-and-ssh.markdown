---
comments: true
date: '2007-06-05 14:35:34'
layout: post
slug: komodo-svn-and-ssh
status: publish
title: Komodo, svn, and ssh
wordpress_id: '87'
categories:
- software development
- systems administration
tags:
- linux
- php
- mac os
- komodo
- subversion
- ssh
---

For many of you who use <a href="http://www.activestate.com/komodo" target="_blank">Komodo</a>, you will have undoubtedly come across the Source Code Control feature available within it. This feature works GREAT with MacOS X and Linux systems, but if you have ever tried to use it within Windows, it's a bit tricky to get working properly (if you've even been able to do that).

I've been tackling the issue for the past hour or so (after having tried it in the past - but to no avail), but now I think I've figured out what's up with this damn thing. It revolves around using a combination of PuTTY, Subversion (<strong>NOT</strong> TortoiseSVN), and (of course) Komodo. 

Before we get started, you might want to check out <a href="http://www.zend.com/forums/index.php?t=msg&goto=8258&S=b8c666393017831ca4bb4710ff706ed1" target="_blank">this forum thread</a> as this is what gave me some hints as to what to do, though I had to take it all with a grain of salt since it was so messy. If you don't care, then read onward!

These first steps are really quite quick, and I don't care to explain how to do them (as I expect you to figure out how to install applications yourself). If all else fails, RTFM.

<ol><li><a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/" target="_blank">Install Putty</a><br><strong>Note:</strong> You <em>must</em> install the full application (this includes putty.exe, puttygen.exe, plink.exe, etc.)</li><li><a href="http://subversion.tigris.org/" target="_blank">Install Subversion</a></li><li>Restart the computer (this will populate your PATH with the environment variables for PuTTY and Subversion)</li><li>Generate your Public/Private Key Pairs<br>(<strong>Note:</strong> The following section was copied from the Komodo Documentation):<br>

Run the puttygen utility. Configure as follows:

   1. Set Parameters: Select either "SSH2 RSA" or "SSH2 DSA".
   2. Generate Key Pair: Click the Generate button to generate the key pair. While the key is being generated, move the mouse pointer around the blank space to provide key randomness.
   3. Enter Key Passphrase: Enter and confirm a passphrase for the key. Remember the passphrase - it is required later.
   4. Save Public Key: Click the "Save public key" button and store the key in a file called public1.key.
   5. Save Private Key: Click the Save private key button and store the key in a file called private1.key, in the same directory as the public key.
      Note: The extension .ppk will be appended to the name specified (i.e. private1.key.ppk).
   6. Copy Key Contents: Copy the contents of the public key field (at the top of the dialog box) to a file named public1-openssh.key. This key is required later.
   7. Close puttygen
</li><li>Load and Configure Pageant<br>(<strong>Note:</strong> This section was copied from the Komodo Documentation):

Run the pageant program. This loads the Putty Authentication Agent into the Windows System Tray.

Right-click the Pageant icon in the Windows System Tray. Select Add Key. Navigate to the directory where you saved the public and private keys in the previous step, and select the file private1.key.ppk.
</li><li>Configure PuTTY Session

Run PuTTY. <strong>Note:</strong> Before reading the next section, you <em>MUST</em> realize that the naming convention used for the session name is CRITICAL for checking out and committing over SSH. Once you understand this, read the documentation that was copied from the Komodo documentation:

   1. Specify Server: On the Session page of the Configuration form, enter the host name or IP address of the server.
   2. Specify Protocol: On the Session page, in the Protocol field, select the "SSH" protocol.
   3. Create Saved Session: In the Saved Sessions field, enter the host name again. Click the Save button.
   4. Configure Connection: on the Connection page of the Configuration form, enter your username for the server in the Auto-login username field.
   5. Configure SSH Protocol: On the SSH page of the Configuration form, specify "2" for the Preferred SSH protocol version.
   6. Enable Agent Forwarding: On the Auth page of the Configuration form, check Allow agent forwarding. In the Private key file for authentication field, specify the path and filename of the private key created above (private1.key).
   7. Save Session Information: On the Session page of the Configuration form, click the Save button.
</li><li>Store the Public Key on the Server<br><strong>Note:</strong> Copied from the Komodo Documentation:

You must store the public key file generated in step 2 (public1-openssh.key) on the CVS or Subversion server.

   1. Open Command Prompt Window: Type cmd in the Windows Run dialog box.
   2. Copy Public Key to Server: At the command prompt, enter:

{% highlight bash %}
pscp c:\path\to\public1-openssh.key username@server.com:public1-openssh.key
{% endhighlight %}

      ...where c:\path\to\public1-openssh.key specifies the location of the key file created in step two, and username@server.com specifies your username and URL on the remote server. You are prompted to confirm the legitimacy of the host, and may be prompted to enter your password for the server.
   3. Connect Using Putty: If necessary, run the putty program. In the Saved Sessions field, double-click the configuration created in Step 4. This establishes a connection to the server.
   4. Configure the Key on the Server: After logging on to the server, enter the following commands to configure the SSH key:

{% highlight bash %}
mkdir ~/.ssh
chmod 700 .ssh
cat ~/public1-openssh.key >> ~/.ssh/authorized_keys
rm ~/public1-openssh.key
chmod 600 ~/.ssh/*
{% endhighlight %}

   5. Log Off and Exit Putty: Enter exit to close the session of the server.
</li><li>Setting Up Environment Variables

Go to your Control Panel and then to the System. Click the <strong>Advanced</strong> tab and then the <strong>Environment Variables</strong> button. Add 2 new Global Variables:

{% highlight text %}
SVN_SSH = "C:\Path\to\plink.exe" -i "C:\Path\to\Private\Key.ppk"
PLINK_PROTOCOL = ssh
{% endhighlight %}

<strong>NOTE</strong> that the quotes around the paths are critical to SVN working appropriately. If you don't use quotes, subversion will try to use the entire string as the path to plink, which will obviously fail. If you put quotes around the entire thing, the same occurs. </li>
<li>Checking out files

This is CRITICAL in order to make certain that Komodo works appropriately. If you do not check out files appropriately, Komodo will hang and then you'll go hang yourself. The syntax of the command used to check out files should be:

{% highlight text %}
C:\> svn co svn+ssh://PuTTY Session Name/Path To Repository/ directory
{% endhighlight %}

If you use a hostname rather than a PuTTY Session name, you are guaranteed failure. 
</li></ol>

Enjoy. :-)
