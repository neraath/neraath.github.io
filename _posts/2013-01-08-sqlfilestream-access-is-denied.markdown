---
layout: post
title: "SqlFileStream Access is Denied"
date: 2013-01-08 13:16
comments: true
external-url: 
categories: 
- software development
---
I started playing around with SQL filestreams yesterday. We have a need to store large binary objects both quickly and efficiently from SharePoint in our SQL database for regulatory purposes. I found a great [article on Code Project](http://www.codeproject.com/Articles/32216/How-to-store-and-fetch-binary-data-into-a-file-str) on how to actually store binary data in a filestream column. However, as I ran the code, I encountered a ``Win32Exception`` with the message "Access is denied.". 

I double (and triple) checked that the permissions for the account executing the code were correct. Since we're using SharePoint, we are using only Windows authentication. Furthermore, I made sure that our connection string was using Integrated Security:

```
Server=sqlserver01;Database=Journaling;Integrated Security=true;
```

Ultimately, it came down to the fact that the SQL Server was not setup to allow remote server connections to filestream. I managed to fix this by following the [Enable and Configure FILESTREAM](http://msdn.microsoft.com/en-us/library/cc645923.aspx) article on MSDN. The *Allow remote clients to have streaming access to FILESTREAM data.* box was not checked, thus causing my problems. 
