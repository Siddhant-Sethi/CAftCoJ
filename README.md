CAftCoJ - Chat Application from the Crevices of Justice
========================================================

========================================================
Group Members:
Rob von Stange (rvonstan)
Siddhant Sethi (siddhans)
Shubhit Mohan Singh (shubhits)
========================================================

========================================================

Brief Description:

This is a group chat application that is location-centric. At the core, the app allows users to create multiple groups with different groups of friends and interact with them. This interaction is threefold. Firstly, the app provides a chat feature to allow users to communicate with groups of friends. Secondly, every group comes with an interactive map that displays the current location or last logged location of every member of the group. This way, users can keep track of the wherabouts of their friends by simply looking at the map. Lastly, the app provides an event creation feature. On the map, users can double-tap to create events on the map for a specific group. The event will appear show up for all other users in the group.

How to Use Our App:

1. Install MongoDB and Node.js if you do not have them already
2. Next you will need to modify two files so the client will be able to connect to the socket.io server.
	-The first file you will need to access is the client.js file. At line 357 it should currently read: chat.socket = io.connect("http://128.237.xxx.xxx:8888");, and you will need to change it to: chat.socket = io.connect("http://--Your IP Address goes here--:8888");
	-The second file you will need to access is the index.html file. At line 159 it should currently read: <script src="http://128.237.xxx.xxx:8888/socket.io/socket.io.js"></script>, and you will need to change it to: <script src="http://--Your IP Address goes here--:8888/socket.io/socket.io.js"></script>
*NOTE: If you don't know your IP address you can simply go to google and search "my ip" and google will give you the number you need
3. After the socket server is all set up, you will need open up two tabs of terminal/console. From there you must cd into the CAftCoJ-master folder and do the following:
	-In the first tab you will type: mongod --dbpath data/db  
	-In the second tab you will type: node app.js
*NOTE: The folder name may not be CAftCoJ-master, but it should be something similar
4. When running the app on your mobile device you need to go to the URL: --Your IP Address--:3000/static/index.html
5. The app should now be up and running. 

__________________________________________________________________

Project Video Link:

http://www.youtube.com/watch?v=iZm2a2kVrSo
