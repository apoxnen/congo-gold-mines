var map;

var style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

// Define actual Google Maps object
function initMap() {
  // Initialize map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    mapTypeControl: false,
    streetViewControl: false,
    styles: style
  });

  // Center map on first mine using geocoding
  var geocoder = new google.maps.Geocoder();
  var address = 'Democratic Republic of the Congo';
  geocodeAddress(geocoder, map, address);

  function geocodeAddress(geocoder, map, address) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Load GeoJSON that contains geographic information
  map.data.loadGeoJson('https://raw.githubusercontent.com/apoxnen/congo-gold-mines/master/data.json')

  // display info window with more detailed information when item is selected
  var infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function(event) {
      createInfoWindow(map, event, infowindow);
  });

  function createInfoWindow(map, event){
    // Get properties from Data Layer to populate info window
    var village = event.feature.getProperty('village');
    var project= event.feature.getProperty('project');
    var worker_count = event.feature.getProperty('workers_numb');
    var is_gold_mine = event.feature.getProperty('is_gold_mine');
    var mineral1 = event.feature.getProperty('mineral1');
    var armed_group1 = event.feature.getProperty('armed_group1');
    var type_armed_group1 = event.feature.getProperty('type_armed_group1');

    // Create content for info window
    var contentString = '<div id="content"><div id="siteNotice"></div>'+
      '<h2 id="firstHeading" class="firstHeading">' + village + '</h2>'+
      '<h3>project: ' + project + '</h3>'+
      '<div id="bodyContent" style="font-size: 12pt;" >'+
      '</br>Number of Workers : '+ worker_count +
      '</br>Is Gold Mine: '+ is_gold_mine + ' ' +
      '</br>Mineral: '+ mineral1 + ' ' +
      '</br>Armed Group: '+ armed_group1 + ', ' + type_armed_group1 +'</p>'+
      '</div>'+
      '</div>';

    var bounds = new google.maps.LatLngBounds();
    var geometry = event.feature.getGeometry();

    geometry.forEachLatLng(function(point){
      bounds.extend({
        lat : point.lat(),
        lng : point.lng()
      });
    });
    var center = bounds.getCenter();

    // Create invisible marker for info window
    var marker = new google.maps.Marker({
      position: center,
      map: map,
      visible : false
    });
    // Create info window
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  }
};
