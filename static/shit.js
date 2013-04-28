
var login = {
  init: function() {
    $('#login').css({'display': 'block'});
    $("#signupButton").click(function() {
      $("#SignUp").css({'display': 'block'});
      $("#Login").css({'display': 'none'});
    });
    $("#BackToLogIn").click(function()  {
      $("#SignUp").css({'display': 'none'});
      $("#Login").css({'display': 'block'});
    });
  },

  login: function() {
    var user = $("#user-input");
    var password = $("#password-input");
    var newlogin = {
                    username: user.val(),
                    password: password.val()
                    };
    login.loginServer(newlogin, 
                 function success(data){
                    //alert(JSON.stringify(data));
                    localStorage.user = user.val();
                    chat.initSocket();
                    //chat.addSocketToGroups();
                    //login.user = user.val();
                    $('#login').css({'display': 'none'});
                    $('#groups').css({'display': 'block'});
                    groups.init();
                    //window.location.href = 'groups.html#' + encodeURI(user.val());
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });
  },

  loginServer: function(data, onSuccess, onError) {
    $.ajax({
    type: "post",
    data: data,
    url: "/login",
    success: onSuccess,
    error: onError
    });
  },

  signup: function() {
    //signup.userTaken = false;
    login.passDiff = false;
    var user = $("#username");
    var firstName = $("#first");
    var lastName = $("#last");
    var password1 = $("#password1");
    var password2 = $("#password2");
    if (password2.val() !== password1.val()) login.passDiff = true;
    //if (user.val() in database) signup.userTaken = true;
    if (login.passDiff === false) {
      var newUser = {
                    first: firstName.val(),
                    last: lastName.val(),
                    username: user.val(),
                    password: password1.val()
                    };
      login.addUser(newUser, 
                function success(data){
                    //alert(JSON.stringify(data));
                    localStorage.user = user.val();
                    $('#login').css({'display': 'none'});
                    $('#groups').css({'display': 'block'});
                    chat.initSocket();
                    //window.location.href = 'groups.html#' + encodeURI(user.val());
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });
    }
    
  },

  addUser: function(data, onSuccess, onError) {
    $.ajax({
    type: "post",
    data: data,
    url: "/register",
    success: onSuccess,
    error: onError
    });
  }
}

function logoutPerson() {
  $.ajax({
    type: "get",
    url: "/logout",
    success: function() {
      window.location.href = "index.html";
    },
    error: function() {console.log("error")}
    });
}

var groups = {
  init: function() {
    //groups.plusImage = 'plus.png';
    //$("#addGroupButton").click(groups.newGroup());
    groups.getGroups(function(groupsArray) {
      console.log("Got groups Array!:", groupsArray);
      groups.displayGroups(groupsArray.success);
    }, function(err) {
      console.log("Could not get user's groups from server because: ", JSON.stringify(err));
    });
  },

  displayGroups: function(grps) {
    var container = $("#listOfGroups");
    container.empty();
    for (var i = 0; i < grps.length; i++) {
      console.log(container);
      var li = $("<li>");
      li[0].id = grps[i]._id;
      li.addClass("groupEntry");
      var nameDiv = $("<div>");
      nameDiv.html(grps[i].name);
      nameDiv.css("padding", "10px");
      nameDiv.css("font-size", "27px");
      li.append(nameDiv);
      li.mousedown(function() {
        $(this).css("background-color", "#99FFCC");
      });
      li.mouseup(function() {
        $(this).css("background-color", "#FFFFFF");
        $('#groups').css({'display': 'none'});
        $('#chat').css({'display': 'block'});
        chat.init($(this)[0].id);
        container.empty();
        // if ($(this)[0].className.indexOf("true") !== -1) {
        //   $(this).removeClass("true");
        //   $(this).css("background-color", "#99FFFF");
        // }
        // else {
        //   $(this).addClass("true");
        //   $(this).css("background-color", "#99FFCC"); 
        // }
      });
      container.append(li);
    }
  },

  newGroup: function() {
    console.log("it came here");
    $('#groups').css({'display': 'none'});
    $('#addgroup').css({'display': 'block'});
    addgroup.init();
    $("#listOfGroups").empty();
  },

  getGroups: function(onSuccess, onError) {
    $.ajax({
      type: "post",
      data: {user: localStorage.user},
      url: "/getGroups",
      success: onSuccess,
      error: onError
      });
  }

}

var addgroup = {
  init: function() {
    
    gmap.getAllUsers(function(data){
      addgroup.userArray = data.userArray;
      console.log("data.userArray ",data.userArray);
      addgroup.displayUsers();
      $("#backButton").dblclick(addgroup.back());
      //gmap.createOtherPeople(data.userArray);
    },
    function() {
      console.log("Error: Did not get users from default group");
    });
  },

  displayUsers: function() {
    var a = addgroup.userArray;
    var container = $("#listOfUsers");
    container.empty();
    for (var i = 0; i < a.length; i++) {
      if (a[i].username === localStorage.user) continue;
      var li = $("<li>");
      li[0].id = a[i].username;
      li.addClass("userEntry");
      var nameDiv = $("<div>");
      nameDiv.html(a[i].first + " " + a[i].last);
      nameDiv.css("padding", "10px");
      nameDiv.css("font-size", "27px");
      li.append(nameDiv);
      li.mousedown(function() {
        $(this).css("background-color", "#99FFCC");
      });
      li.mouseup(function() {
        if ($(this)[0].className.indexOf("true") !== -1) {
          $(this).removeClass("true");
          $(this).css("background-color", "#99FFFF");
        }
        else {
          $(this).addClass("true");
          $(this).css("background-color", "#99FFCC"); 
        }
      });
      container.append(li);
    }
  },

  createNewGroup: function() {
    var groupName = $("#groupName").val();
    console.log("groupName", groupName);
    if (groupName === "") {
      alert("Please enter a group name!");
      return; 
    }
    var users = [localStorage.user];
    var allEntries = $(".true");
    for (var i = 0; i < allEntries.length; i++) {
      //console.log(allEntries[i].id);
      users.push(allEntries[i].id);
    }
    if (users.length < 2) {
      alert("Please select users");
      return;
    }
    //console.log(users);
    var data = {name: groupName, users: users};
    addgroup.sendGroupToServer(data, function() {
      console.log("successfully sent group to server");
      $('#groups').css({'display': 'block'});
      $('#addgroup').css({'display': 'none'});
      groups.init();
      $("#groupName").val("");
      $("#listOfUsers").empty();
      chat.initUserSocket();
    }, function() {
      console.log("failed to send group to server");
    })

    //window.location.href = 'map.html';
  },

  back: function() {
    console.log("CLICKED BK");
    // $('#groups').css({'display': 'block'});
    // $('#addgroup').css({'display': 'none'});
    // groups.init();
    // $("#groupName").val("");
    // $("#listOfUsers").empty();
  },

  sendGroupToServer: function(data, onSuccess, onError) {
    $.ajax({
      type: "post",
      data: data,
      url: "/addgroup",
      success: onSuccess,
      error: onError
      });
  }

}

var chat = {
  init: function(grpID) {
    chat.configureDisplays();
    chat.getGroup(grpID, function(data) {
      console.log("got group from server!");
      chat.group = data.group;
      chat.initSocket();
      chat.initStuff();
      chat.loadPastMessages();
    }, function(err) {
      console.log("could not get group for chat from server because:", JSON.stringify(err));
    });
    
  },

  configureDisplays: function() {
    $('#chat').css({'display': 'block'});
    $('#groups').css({'display': 'none'});
    $('#login').css({'display': 'none'});
    $('#addgroup').css({'display': 'none'});
  },

  initStuff: function() {
    $("#chatBarTitle").html(chat.group.name);
  },

  initUserSocket: function() {
    console.log("CUrrentUser:", localStorage.user);
    if (localStorage.user === undefined) return;
    var data = {user: localStorage.user};
    chat.socket.emit("init", data);
  },

  initSocket: function() {
    console.log("this is the chat group:", chat.group);
    chat.socket = io.connect("http://128.237.207.74:8888");
    console.log("this is the socket session id:", chat.socket.socket);
    chat.initUserSocket();
    $('#input').keydown(function() {
          if (event.keyCode == 13) {
              chat.sendMessageClick();
              return false;
           }
      });
    $("#chatform").submit(chat.sendMessageClick);
    chat.status();
    chat.newmsg();
  },

  loadPastMessages: function() {
    $("#messages").empty();
    var num = 0;
    if (chat.group.chat.length > 30) num = chat.group.chat.length - 30;
    for (var i = num; i < chat.group.chat.length; i++) {
      var input = chat.group.chat[i].body;
      var currentTime = new Date(chat.group.chat[i].date);
      var msgAlign;
      var user1;
      if (chat.group.chat[i].user === localStorage.user) msgAlign = "right";
      else {
        msgAlign = "left";
        user1 = chat.group.chat[i].user;
      }
      chat.repeat(input, currentTime, msgAlign, user1);
    }

  },


  getGroup: function(id, onSuccess, onError) {
    $.ajax({
      type: "post",
      data: {id: id},
      url: "/getGroup",
      success: onSuccess,
      error: onError
      });
  },

  addSocketToGroups: function(user, socketID) {

  },

  back: function() {
    $('#chat').css({'display': 'none'});
    $('#groups').css({'display': 'block'});
    groups.init();
    $("#messages").empty();
  },

  map: function() {
    localStorage.grpID = chat.group._id;
    window.location.href = "map.html";
  },

  sendMessageClick: function() {
  // send the msg event, with some data
    var input = $("#input").val();
    if (input === "") return; 
    $("#input").val("");
    var date = new Date();
    var data = {body: input, date: date.toString(), grpID: chat.group._id, user: localStorage.user};
    chat.socket.emit('msg', data);
    //console.log("data.date", data.date);
    //console.log("new date", new Date());
    chat.writeMessage(input, date);
    return false;
  },

  //input = message text; currentTime = data object, msgAlign = right 
  //or left, user1 = other username from server
  repeat: function(input, currentTime, msgAlign, user1)  {
    var stamp = "AM";
    if (currentTime.getHours() >= 12) stamp = "PM";
    var hour = 12;
    if (currentTime.getHours() !== 12) hour = currentTime.getHours() % 12;
    var minute = currentTime.getMinutes();
    if (minute < 10) minute = "0" + minute;
    var time = hour + ":" + minute + stamp;

      var li = $("<li>");
      li.addClass("chatEntry");
      var innerDiv = $("<div>");
      innerDiv.addClass("entry");
      var timeDiv = $("<div>");
      if (msgAlign === "right") time = localStorage.user + " - " + time;
      else time = user1 + " - " + time;
      timeDiv.html(time);
      timeDiv.css("text-align", "center");
      timeDiv.css("padding", "2px");
      timeDiv.css("font-size", "11px");
      timeDiv.css("color", "gray");
      var user = $("<div>");
      user.addClass('chatMsgUser');
      var innerP = $("<p>");
      innerP.css("padding", "10px");
      innerP.css("text-align", msgAlign);
      innerP.html(input);
      innerDiv.append(timeDiv);
      innerDiv.append(user);
      innerDiv.append(innerP);
      if (msgAlign === "right")
        innerDiv.css("background-color", "rgba(175,238,238,.2)");
      li.append(innerDiv);
      $("#messages").append(li);
      var bigDiv = $("#messagesContainer");
      bigDiv[0].scrollTop = bigDiv[0].scrollHeight;
  },

  status: function() {
    chat.socket.on("status", function(data) {
        if (data.success) {
          console.log("Message successfully sent");
        } else {
          console.log("Message failed to send");
        }
    });
  },

  writeMessage: function(input, date) {
    var currentTime = date;
    chat.repeat(input, currentTime, "right");
  },


  newmsg: function() {
    chat.socket.on("newmsg", function(data) {
      if (data.grpID !== chat.group._id) return;
      var currentTime = new Date(data.date);
      chat.repeat(data.body, currentTime, "left", data.user);
    });
  }
}


var gmap = {
  init: function() {
    if (localStorage.grpID === undefined) alert("WTF");
    chat.getGroup(localStorage.grpID, function(data) {
      console.log("got group from server!");
      gmap.group = data.group;
      gmap.serverEvents = data.group.events;
      gmap.events = [];
      gmap.markerIndex = -1;
      gmap.loadScript();
      $("#logoutButton").click(function() {
        logoutPerson();
      });
      $("#backToChat").click(function() {
        window.location.href = "index.html#chat";
      });
      $("#mapTab").css('background-color', "#23BF7F");
      $("#logTab").click(function() {
        $(this).css('background-color', "#23BF7F");
        $("#mapTab").css('background-color', "#23BF00");
        $('#eventLog').css({'display': 'block'});
        $('#map-canvas').css({'display': 'none'});
        log.init();
      });
      $("#mapTab").click(function() {
        $(this).css('background-color', "#23BF7F");
        $("#logTab").css('background-color', "#23BF00");
        $('#eventLog').css({'display': 'none'});
        $('#map-canvas').css({'display': 'block'});
        //gmap.init();
      });
    }, function(err) {
      console.log("could not get group for chat from server because:", JSON.stringify(err));
    });
    
  },

  createNewPerson: function(latitude, longitude) {
    var mapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var infowindow = new google.maps.InfoWindow({
      //content: firstName + " " + lastName
      content: "<img src=kim-kardashian-huge-tits.jpeg width=304 height=228>"
    });
    gmap.map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    var image = 'person.png';
    console.log("myshit", gmap.map.getCenter());
    var marker = new google.maps.Marker({
      position: gmap.map.getCenter(),
      map: gmap.map,
      icon: image,
    });

    console.log(marker);

    

    // google.maps.event.addListener(gmap.map, 'center_changed', function() {
    //   // 3 seconds after the center of the map has changed, pan back to the
    //   // marker.
    //   window.setTimeout(function() {
    //     gmap.map.panTo(marker.getPosition());
    //   }, 3000);
    // });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(gmap.map, this);
      console.log("shit");
      gmap.map.setZoom(8);
      gmap.map.panTo(marker.getPosition());
    });

    google.maps.event.addListener(gmap.map, 'dblclick', function(event) {
      gmap.placeMarker(event.latLng);
    });
    console.log("comes here");
    

    gmap.createOtherPeople(gmap.userArray);
    gmap.createGroupEvents(gmap.serverEvents);


  },

  createGroupEvents: function(events) {
    for (var i = 0; i < events.length; i++) {
      var myLatLong = new google.maps.LatLng(events[i].lat, events[i].lon);
      var marker = new google.maps.Marker({
          position: myLatLong,
          map: gmap.map,
          content: "",
        });

      var infowindow = new google.maps.InfoWindow({
        content: "Event Name: " + events[i].name + "\n<br>Start Time: " + events[i].start 
                      + "\n<br>End Time: " + events[i].end + "\n<br>Date: " + events[i].date + "\n<br>Created: " + events[i].created
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(gmap.map, this);
        //gmap.map.setZoom(8);
        gmap.map.panTo(marker.getPosition());
      });
    }
  },

  getGroupEvents: function(onSuccess, onError) {
    $.ajax({
      type: "get",
      url: "/getEvents",
      success: onSuccess,
      error: onError
      });
  },

  updateLocation: function(latitude, longitude, onError, onSuccess) {
      console.log("this current user", localStorage.user);
      $.ajax({
      type: "post",
      data: {user: localStorage.user, latitude: latitude, longitude: longitude},
      url: "/updateLocation",
      success: onSuccess,
      error: onError
      });
  },

  placeMarker: function(location) {
      var marker = new google.maps.Marker({
          position: location,
          map: gmap.map,
          id: gmap.markerIndex,
          content: "",
        });
      //console.log(marker);
      //console.log("placemarker marker", marker);
      gmap.events.push(marker);
      //gmap.map.panTo(marker.getPosition());
      //gmap.popupEventAdder(marker);
      gmap.markerIndex = gmap.markerIndex + 1;
      $('#event').css({'display': 'block'});
      $('#map').css({'display': 'none'});
      //window.location.href = 'event.html#' + encodeURI(userString) + "$" + JSON.stringify(marker.getPosition());
  },

  addEvent: function() {
    //gmap.getMarkerPosition();
    //console.log(gmap.events);
    //var position = JSON.parse.(pos);
    //console.log("markerPos:", pos.jb);
    // console.log("addevent marker", marker);
    // console.log(gmap.events);
    // console.log(marker.id);
    var marker = gmap.events[gmap.markerIndex];
    var pos = marker.getPosition();
    var date = new Date();
    var infowindow = new google.maps.InfoWindow({
          content: "Event Name: " + $("#name").val() + "\n<br>Start Time: " + $("#start").val() 
                      + "\n<br>End Time: " + $("#end").val() + "\n<br>Date: " + $("#chooseDate").val() + "\n<br>Created: " + date
    });
    //infowindow.setContent(marker.content);
    //gmap.map.setCenter(marker.getPosition());
    //infowindow.open(gmap.map, this);
    google.maps.event.addListener(gmap.events[gmap.markerIndex], 'click', function() {
      infowindow.open(gmap.map, this);
      gmap.map.panTo(marker.getPosition());
    });
    //gmap.revertEventAdder();

    var newEvent = {name: $("#name").val(), start: $("#start").val(), end: $('#end').val(), date: $("#chooseDate").val(),
                    group: gmap.group._id, lat: pos.jb, lon: pos.kb, created: date}

    gmap.addEventToServer(newEvent, function(){
      console.log("Event added to group");
    },
    function() {
      console.log("Error: event not added");
    });
    $('#event').css({'display': 'none'});
    $('#map').css({'display': 'block'});
    //window.location.href = 'map.html';
  },

  addEventToServer: function(data, onSuccess, onError) {
    $.ajax({
    type: "post",
    data: data,
    url: "/newEvent",
    success: onSuccess,
    error: onError
    });
  },

  getAllUsers: function(onSuccess, onError) {
    $.ajax({
    type: "get",
    url: "/getAllUsers",
    success: onSuccess,
    error: onError
    });
  },

  popupEventAdder: function(marker) {
    var canvas = $("#map-canvas");
    canvas.css("height", "80%");
    var popup = $("#eventAdder");
    popup.css("height", "20%");
  },

  revertEventAdder: function() {
    var canvas = $("#map-canvas");
    canvas.css("height", "100%");
    var popup = $("#eventAdder");
    popup.css("height", "0");
  },

  loadPeople: function() {
    gmap.getAllUsers(function(data){
      gmap.userArray = data.userArray;
      console.log("data.userArray ",data.userArray);
      //gmap.createOtherPeople(data.userArray);
    },
    function() {
      console.log("Error: Did not get users from group");
    });
    navigator.geolocation.getCurrentPosition(function(position) {
        gmap.createNewPerson(position.coords.latitude, position.coords.longitude);
      });
  },

  createOtherPeople: function(userArray) {
    console.log(userArray);
    for (var i = 0; i <userArray.length; i++) {
      console.log(userArray[i].username, localStorage.user);
      if (userArray[i].username === localStorage.user) continue;
      var firstName = userArray[i].first;
      var lastName = userArray[i].last;
      
      var lat = userArray[i].lastLocation.lat;
      var lon = userArray[i].lastLocation.lon;
      var lastLogin = userArray[i].lastLoginTimestamp;
      console.log(lat, lon);

      var infowindow = new google.maps.InfoWindow({
        content: firstName + " " + lastName + "\n<br>" + "Last Login: " + lastLogin
        //content: "<img src=kim-kardashian-huge-tits.jpeg width=304 height=228>"
      });
      var myLatLong = new google.maps.LatLng(lat, lon);
      console.log("latlong", myLatLong);
      var image = 'shit.png';
      var marker = new google.maps.Marker({
        position: myLatLong,
        map: gmap.map,
      });
      console.log("marker", marker);
      // google.maps.event.addListener(gmap.map, 'center_changed', function() {
      //   // 3 seconds after the center of the map has changed, pan back to the
      //   // marker.
      //   window.setTimeout(function() {
      //     gmap.map.panTo(marker.getPosition());
      //   }, 3000);
      // });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(gmap.map, this);
        console.log("shit");
        gmap.map.setZoom(8);
      });
      //gmap.placeMarker(marker.getPosition());
    }
  },

  loadScript: function() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDsRQOK6mSlZxIcx35mNf_h2dbcsF4DBAo&sensor=true&callback=gmap.loadPeople";
      document.body.appendChild(script);
      //console.log(script);
      

  }
}

var log = {
  init: function() {
    chat.getGroup(gmap.group._id, function(data) {
      console.log("got group from server!");
      log.group = data.group;
      log.displayEvents();
    }, function(err) {
      console.log("could not get group for chat from server because:", JSON.stringify(err));
    });
    
  },

  displayEvents: function() {
    console.log("in display events. events:", log.group.events);
    var container = $("#listOfEvents");
    container.empty();
    for (var i = 0; i < log.group.events.length; i++) {
      var li = $("<li>");
      li.addClass("eventEntry");
      var nameDiv = $("<div>");
      nameDiv.html("Name: " + log.group.events[i].name);
      nameDiv.css("padding", "10px");
      nameDiv.css("font-size", "27px");
      li.append(nameDiv);
      var dateDiv = $("<div>");
      dateDiv.html("Date: " + log.group.events[i].data);
      dateDiv.css("padding", "10px");
      dateDiv.css("font-size", "20px");
      li.append(dateDiv);
      var timeDiv = $("<div>");
      timeDiv.html("Start: " + log.group.events[i].start + ", End: " + log.group.events[i].end);
      timeDiv.css("padding", "10px");
      timeDiv.css("font-size", "20px");
      li.append(timeDiv);
      var createdDiv = $("<div>");
      createdDiv.html("Created: " + log.group.events[i].created);
      createdDiv.css("padding", "10px");
      createdDiv.css("font-size", "27px");
      li.append(createdDiv);
      li.mousedown(function() {
        $(this).css("background-color", "#99FFCC");
      });
      li.mouseup(function() {
        $(this).css("background-color", "#FFFFFF");
      });
      container.append(li);
    }
  }
}

function updateYourLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    gmap.updateLocation(position.coords.latitude, position.coords.longitude, function(){
      console.log("failed to update your location in the server");
    }, function() {
      console.log("successfully updated your location in the server");
    });
  });
}


function checkLocation() {
  var pathname = window.location.pathname;
  var pages = ["index", "map"];
  var currentState = undefined;
  for (i = 0; i < pages.length; i++) {
    if (pathname.indexOf(pages[i]) !== -1) {
      currentState = pages[i];
    }
  }
  return currentState;
}

function manageState(state) {
  if (state === "index") {
    //window.location.href = "index.html";
    login.init();
  }
  if (state === "map") {
    gmap.init();
    chat.initSocket();
  }
  if (state === "groups") groups.init();
  if (state === "addgroup") addgroup.init();
  if (state === "event") gmap.getMarkerPosition();
}

$(document).ready(function() {
    itIsReady();
    updateYourLocation();
    //chat.initSocket();
   });



// function checkCurrentUser(onSuccess, onError) {
//   $.ajax({
//     type: "get",
//     url: "/getUser",
//     success: onSuccess,
//     error: onError
//     });
// }


function itIsReady () {
    var index = window.location.href.indexOf("#");
    pathfinder = undefined
    if (index !== -1) pathfinder = decodeURI(window.location.href.slice(index+1));
    if (pathfinder !== undefined) {
      chat.init(localStorage.grpID);
      return;
    }
    var currentState = checkLocation();
    manageState(currentState);
}

