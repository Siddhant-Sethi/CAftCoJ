var events = [];
var markerIndex = -1;

function createNewPerson(latitude, longitude) {
        var mapOptions = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var infowindow = new google.maps.InfoWindow({
          content: "<img src=kim-kardashian-huge-tits.jpeg width=304 height=228>"
        });
        map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        var image = 'person.png';
        var marker = new google.maps.Marker({
          position: map.getCenter(),
          map: map,
          icon: image,
        });

  google.maps.event.addListener(map, 'center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 30000);
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, this);
    console.log("shit");
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });

  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        id: markerIndex,
        content: "",
      });
    events.push(marker);
    popupEventAdder(marker);
    markerIndex = markerIndex + 1;
}
function addEvent() {
  var marker = events[markerIndex];
  var infowindow = new google.maps.InfoWindow();
  console.log(marker);
  console.log(events);
  console.log(marker.id);
  marker.content = "Event Name: " + $("#name").val() + "\nTime: " + $("#time").val();
  infowindow.setContent(marker.content);
 // markerIndex = markerIndex +1;
  google.maps.event.addListener(events[markerIndex], 'click', function() {
    infowindow.open(map, this);
    map.setCenter(marker.getPosition());
  });
  revertEventAdder();
}

function popupEventAdder(marker) {
  var canvas = $("#map-canvas");
  canvas.css("height", "80%");
  var popup = $("#eventAdder");
  popup.css("height", "20%");
}

function revertEventAdder() {
  var canvas = $("#map-canvas");
  canvas.css("height", "100%");
  var popup = $("#eventAdder");
  popup.css("height", "0");
}

function loadPeople() {
  navigator.geolocation.getCurrentPosition(function(position) {
      console.log("cock");
      createNewPerson(position.coords.latitude, position.coords.longitude);
    });
}
function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDsRQOK6mSlZxIcx35mNf_h2dbcsF4DBAo&sensor=true&callback=loadPeople";
    document.body.appendChild(script);
    console.log(script);
    

}

function init() {
  var socket = io.connect("http://localhost:8888");
  loadScript();

}

  window.onload = init;
