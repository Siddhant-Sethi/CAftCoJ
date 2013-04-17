
var login {
  initLogin: function() {

  }

  signup: function() {
    signup.userTaken = false;
    signup.passDiff = false;
    var user = $("#username");
    var firstName = $("#first");
    var lastName = $("#last");
    var password1 = $("#password1");
    var password2 = $("#password2");
    if (password2.val() !== password1.val()) signup.passDiff = true;
    //if (user.val() in database) signup.userTaken = true;
    if (signup.passDiff === false && signup.userTaken === false) {
      var newUser = {
                    first: firstName.val(),
                    last: lastName.val(),
                    password: password1.val()
                    };
      database[user.val()] = newUser;
      signup.addUser(user.val(), newUser);
    }
    signup.refreshSignup();
  },

  addUser: function(user, data) {
    $.ajax({
    type: "post",
    data: {"user": user, "data": data},
    url: "/database/newUser",
    success: function(data) { 
      window.location.href = 'addclass.html#' + encodeURI(user);
    }
    });
  },
}




var gmap {
  initMap: function() {
    gmap.loadScript();
    gmap.events = [];
    gmap.markerIndex = -1;
  }

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
  }

  placeMarker: function(location) {
      var marker = new google.maps.Marker({
          position: location,
          map: gmap.map,
          id: markerIndex,
          content: "",
        });
      gmap.events.push(marker);
      gmap.popupEventAdder(marker);
      gmap.markerIndex = gmap.markerIndex + 1;
  }
  addEvent: function() {
    var marker = gmap.events[markerIndex];
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
  }

  popupEventAdder: function(marker) {
    var canvas = $("#map-canvas");
    canvas.css("height", "80%");
    var popup = $("#eventAdder");
    popup.css("height", "20%");
  }

  revertEventAdder: function() {
    var canvas = $("#map-canvas");
    canvas.css("height", "100%");
    var popup = $("#eventAdder");
    popup.css("height", "0");
  }

  loadPeople: function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("cock");
        gmap.createNewPerson(position.coords.latitude, position.coords.longitude);
      });
  }
  loadScript: function() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDsRQOK6mSlZxIcx35mNf_h2dbcsF4DBAo&sensor=true&callback=loadPeople";
      document.body.appendChild(script);
      console.log(script);
      

  }
}





function init() {
  var socket = io.connect("http://localhost:8888");
  gmap.initMap();
}

window.onload = init;
