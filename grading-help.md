CAftCoJ - Chat Application from the Crevices of Justice
========================================================

========================================================
Group Members:
Rob von Stange (rvonstan)
Siddhant Sethi (siddhans)
Shubhit Mohan Singh (shubhits)
========================================================

========================================================

List of Required Elements:

1. Javascript: Our primary coding language for this project is javascript. To better organize our client code, in client.js, we created separate objects that hold all functions and variables associated with each section of the app. For example, there are objects for login, groups, addgroup and gmap. 

2. HTML: We used two separate HTML files for this app. The first, index.html, contains separate sections for the login, signup, groups, add group and chat features. We manipulate the display of these elements in javascript, such that only one of these elements are displayed at a time. This gives the impression that the user is traversing through separate pages in our app. Similarly, the second file, map.html, contains sections for the map, members page, and event log page. 

3. CSS: We use the file style.css for all our styling purposes. Most of our css is declared in this file. We occasionally use JQuery to manipulate css of DOM elements in client.js.

4. DOM Manipulation: This is done mostly in our client.js file. We manipulate the css and html of DOM elements in order to implement certain transitions and effects. For example, in the event log page of the app, the user can tap on a selected event name to expand the div and view more information about the event. Upon tapping on the event again, the user will be directed to the map page and the map will zoom in to the selected event. To view the code, go to the displayEvent function in client.js between lines 1050 and 1150.

5. JQuery: We use JQuery mostly to manipulate the DOM. For example, JQuery is used to display lists of users, groups, and events in various pages. An example, as stated above, is in the displayEvent function in client.js between lines 1050 and 1150. More examples can be found in the same file in functions that begin with ‘display’. JQuery is also used to append and prepend DOM elements to certain sections of the html in order to manipulate these lists. 

6. AJAX Client: AJAX is used in the client to communicate with the server. We use get, post and put calls in the file client.js. For example, between lines 800 and 850, there are get and post calls to get users from the server and post event information to the server.

7. AJAX Server: AJAX is used in the server to listen for the get, post and put calls from the client and respond by storing certain information in the database or by retrieving certain information and providing it back to the client. Examples of this can be found in app.js after line 190.

8. Node.js: In app.js lines 1-20 contain our node express server initialization. We continue using this technology together with the Mongoose database from lines 190 till the end of app.js. 

9. Websockets: In app.js lines 22-150 contain our socket.io server. The use of socket.io is seen through our applications chat feature, and the chat notifications feature. For the chat feature, when the client sends a message in a group, the socket server receives the message and emits a response to all the other clients in the same group. Groups in socket are implemented using the new socket feature, Rooms. Each group is a socket Room that is identified by the unique group id generated from the mongoose server. For chat notifications, the concept of socket Rooms still applies. Notifications go out to all members of the Room, and they pop up as alerts for all other clients. 

10. Client-Side Caching and localStorage - Localstorage is used primarily to store information about which user is currently logged in. For example, in client.js, between lines 23 and 26, the user’s username is stored in localStorage once the user logs in. This allows the user to remain logged in on the same browser, even after refreshing the page, until the user logs out. Once the user logs out, his or her information that was stored in localStorage gets cleared. LocalStorage is also used to store basic information about the current group in order to reduce the number of server calls required. 

11. Server-Side Databases - Mongoose: In app.js lines 150 till 190, our mongoose database is initialized. Throughout the rest of app.js, our implementation of the Mongoose database is used in conjunction with Ajax post, get and put calls to provide and store information to and from the client. The mongoose database holds a collection of our users, and a collection of all the groups the users create. We have separate schemas for each collection. The User schema is defined in User.js. Each document in the User collection hold information about a user. The Group schema is defined in Groups.js. Each document in the Groups collection holds information about each group. In addition, user authentication is handled in the file loginRoutes.js. This handles the login and signup features.

12. Google Maps API: We use the google maps API to display user sand events on a map for each group. The code for all things associated with the Google Maps API is in the gmap object from line 550 to line 880, approximately. 

