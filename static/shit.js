
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
                    window.location.href = 'map.html';
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
                    window.location.href = 'map.html';
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




var gmap = {
  init: function() {
    gmap.events = [];
    gmap.markerIndex = -1;
    gmap.loadScript();
  },

  createNewPerson: function(latitude, longitude) {
    var mapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var infowindow = new google.maps.InfoWindow({
      content: "<img src=kim-kardashian-huge-tits.jpeg width=304 height=228>"
    });
    gmap.map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    var image = 'person.png';
    var marker = new google.maps.Marker({
      position: gmap.map.getCenter(),
      map: gmap.map,
      icon: image,
    });

    google.maps.event.addListener(gmap.map, 'center_changed', function() {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      window.setTimeout(function() {
        gmap.map.panTo(marker.getPosition());
      }, 3000);
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(gmap.map, this);
      console.log("shit");
      gmap.map.setZoom(8);
      gmap.map.setCenter(marker.getPosition());
    });

    google.maps.event.addListener(gmap.map, 'click', function(event) {
      gmap.placeMarker(event.latLng);
    });
  },

  placeMarker: function(location) {
      var marker = new google.maps.Marker({
          position: location,
          map: gmap.map,
          id: gmap.markerIndex,
          content: "",
        });
      gmap.events.push(marker);
      gmap.popupEventAdder(marker);
      gmap.markerIndex = gmap.markerIndex + 1;
  },

  addEvent: function() {
    var marker = gmap.events[gmap.markerIndex];
    var infowindow = new google.maps.InfoWindow();
    console.log(marker);
    console.log(gmap.events);
    console.log(marker.id);
    marker.content = "Event Name: " + $("#name").val() + "\nTime: " + $("#time").val();
    infowindow.setContent(marker.content);
    google.maps.event.addListener(gmap.events[gmap.markerIndex], 'click', function() {
      infowindow.open(gmap.map, this);
      gmap.map.setCenter(marker.getPosition());
    });
    gmap.revertEventAdder();
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
    console.log("comes to loadPeople");
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("cock");
        gmap.createNewPerson(position.coords.latitude, position.coords.longitude);
      });
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
  if (state === undefined) login.init();
  if (state === "map") gmap.init();
}

$(document).ready(function() {
    itIsReady();
   });

function itIsReady () {
    var currentState = checkLocation();
    manageState(currentState);
}

