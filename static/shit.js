
var login = {
  init: function() {

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
                    login.user = user.val();
                    window.location.href = 'map.html#' + encodeURI(user.val());
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
                    window.location.href = 'map.html#' + encodeURI(user.val());
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


var gmap = {
  init: function() {
    gmap.events = [];
    gmap.markerIndex = -1;
    gmap.loadScript();
    $("#logoutButton").click(function() {
      logoutPerson();
    });
    gmap.getGroupEvents(function(data) {
      gmap.serverEvents = data.events;
      console.log("got events from server:", gmap.serverEvents);
    }, function() {
      console.log("could not get events from server");
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

    google.maps.event.addListener(gmap.map, 'click', function(event) {
      gmap.placeMarker(event.latLng);
    });
    console.log("comes here");
    gmap.updateLocation(latitude, longitude, function(){
      console.log("failed to update your location in the server");
    }, function() {
      console.log("successfully updated your location in the server");
    });

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
        content: "Event Name: " + events[i].name + "\n<br>Time: " + events[i].time + "\n<br>Created: " + events[i].created
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
      console.log("this current user", userString);
      $.ajax({
      type: "post",
      data: {user: userString, latitude: latitude, longitude: longitude},
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
      gmap.map.panTo(marker.getPosition());
      gmap.popupEventAdder(marker);
      gmap.markerIndex = gmap.markerIndex + 1;
  },

  addEvent: function() {
    var marker = gmap.events[gmap.markerIndex];
    var pos = marker.getPosition();
    //var position = JSON.parse.(pos);
    console.log("markerPos:", pos.jb);
    var infowindow = new google.maps.InfoWindow();
    console.log("addevent marker", marker);
    console.log(gmap.events);
    console.log(marker.id);
    var date = new Date();
    marker.content = "Event Name: " + $("#name").val() + "\n<br>Time: " + $("#time").val() + "\n<br>Created: " + date;
    infowindow.setContent(marker.content);
    //gmap.map.setCenter(marker.getPosition());
    //infowindow.open(gmap.map, this);
    google.maps.event.addListener(gmap.events[gmap.markerIndex], 'click', function() {
      infowindow.open(gmap.map, this);
      gmap.map.setCenter(marker.getPosition());
    });
    gmap.revertEventAdder();

    var newEvent = {name: $("#name").val(), time: $("#time").val(), 
                    group: 'default', lat: pos.jb, lon: pos.kb, created: date}

    gmap.addEventToServer(newEvent, function(){
      console.log("Event added to group");
    },
    function() {
      console.log("Error: event not added");
    });
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
      console.log("Error: event not added");
    });
    navigator.geolocation.getCurrentPosition(function(position) {
        gmap.createNewPerson(position.coords.latitude, position.coords.longitude);
      });
  },

  createOtherPeople: function(userArray) {
    console.log(userArray);
    for (var i = 0; i <userArray.length; i++) {
      if (userArray[i].username === userString) continue;
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


function checkLocation() {
  var pathname = window.location.pathname;
  var pages = ["map"];
  var currentState = undefined;
  for (i = 0; i < pages.length; i++) {
    if (pathname.indexOf(pages[i]) !== -1) {
      currentState = pages[i];
    }
  }
  return currentState;
}

function manageState(state) {
  if (state !== undefined) {
  }
  if (state === undefined) login.init();
  if (state === "map") gmap.init();
}

$(document).ready(function() {
    itIsReady();
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
    var userIndex = window.location.href.indexOf("#");
    userString = undefined;
    if (userIndex !== -1) userString = decodeURI(window.location.href.slice(userIndex+1));
    console.log("userString", userString);
    var currentState = checkLocation();
    manageState(currentState);
}

