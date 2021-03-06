function initmap(){
  // Create the script tag, set the appropriate attributes
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + MAP_API_TOKEN + '&callback=initMap&v=beta&map_ids=8e25363590309254';
  script.defer = true;
  // Attach your callback function to the `window` object
  window.initMap = function() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: LATITUDE, lng: LONGITUDE },
      zoom: 14,
      mapId: "8e25363590309254",
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      // scaleControl: false,
      // rotateControl: false
    });

    const loc_marker = new google.maps.Marker({
      map,
      position: { lat: LATITUDE, lng: LONGITUDE },
      animation: google.maps.Animation.DROP,
    });

    // map.addListener("center_changed", () => {
    //   // 3 seconds after the center of the map has changed, pan back to the marker.
    //   window.setTimeout(() => {
    //     map.panTo(loc_marker.getPosition());
    //   }, 3000);
    // });

    loc_marker.addListener("click", () => {
      // map.setZoom(20);
      map.setCenter(loc_marker.getPosition());
    });

  };

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
}

function create_marker(shop, search_keyword){
    shop = json_formatter(shop);
    // console.log(shop);
    const icon = {
      url: "/juice_2.svg",
      scaledSize: new google.maps.Size(30, 30),
      origin: new google.maps.Point(0,0), // origin
      // anchor: new google.maps.Point(0, 0) // anchor
    };

    const infowindow = new google.maps.InfoWindow({
      content: shop.name
    });

    const marker = new google.maps.Marker({
      map,
      position: { lat: shop.latitude, lng: shop.longitude},
      icon: icon,
      animation: google.maps.Animation.DROP,
      collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
    });

    marker.addListener("mouseover" , () => {
      infowindow.open(map, marker);
    });

    marker.addListener("mouseout" , () => {
      infowindow.close();
    });

    marker.addListener("click", () => {
      make_toast_info(shop, search_keyword);
      $('#toast').toast('show');

      infowindow.open(map, marker);
      move_center_by_offset(marker);
      bounce_marker(marker);
    });
}

//bounce marker for x seconds when click
function bounce_marker(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(function(){
    marker.setAnimation(null);
  }, 5000);
}

// set map center by offset
function move_center_by_offset(marker){
  map.setZoom(16);

  var span = map.getBounds().toSpan(); // a latLng - # of deg map spans
  var offsetX = 0.20; // move center left by width percent offset
  var offsetY = 0; // move center down by height  percent offset

  var newCenter = {
    lat: marker.getPosition().lat() + span.lat()*offsetY,
    lng: marker.getPosition().lng() + span.lng()*offsetX
  };

  map.panTo(newCenter);
}

function change_map_zoom_and_center(zoom_level){

  var span = map.getBounds().toSpan(); // a latLng - # of deg map spans
  var offsetX = -0.20; // move center left by width percent offset
  var offsetY = 0; // move center down by height  percent offset

  var newCenter = {
    lat: map.getCenter().lat() + span.lat()*offsetY,
    lng: map.getCenter().lng() + span.lng()*offsetX
  };

  map.setZoom(zoom_level);
  map.panTo(newCenter);
}


function json_formatter(string){
  string = string.replace(/&quot;/g, '"');
  string = string.replace(/&gt;/g, '');
  string = string.replace(/\n/g, ' ');
  json_format_string = JSON.parse(string);
  return json_format_string
}

$(document).ready(function(){
  initmap();
});
