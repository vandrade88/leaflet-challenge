// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMarkers(data.features);
});

function createMarkers(feature) {
    var earthquakes = L.geoJSON(feature, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><strong>Date & Time: </strong>${ new Date(feature.properties.time)}<br><strong>Magnitude: </strong>${feature.properties.mag}`)
        },
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng,
                {
                fillOpacity: 0.75,
                color: "white",
                weight: 0.8,
                fillColor: colorDepth(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag)
                })
        }
    // L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
    //     fillOpacity: 0.75,
    //     color: "white",
    //     fillColor: colorDepth(feature.properties.mag),
    //     radius: markerSize(feature.properties.mag)
    // })
    // .bindPopup(`<h3>${feature.properties.title}</h3><hr><strong>Time: </strong>${ new Date(feature.properties.time)}<br><strong>Magnitute: </strong>${feature.properties.mag}`)
    // )

});

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(feature, {
    // pointToLayer: function(feature, latlng) {
    //     return L.circleMarker(latlng);
    //   },
      // circle style
    // style: createFeatures,
    // onEachFeature: onEachFeature // takes a function that you want to apply to each feature
//   });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
    }
// });
// define a color function that will give each marker a different color based on its magnitude
function colorDepth(depth) {
    switch (true) {
    case depth > 90:
        return "#ff6066";
    case depth < 89 && depth > 70:
        return "#fca35d";
    case depth < 69 && depth > 50:
        return "#feb72a";
    case depth < 49 && depth > 30:
        return "#f7dc11";
    case depth < 29 && depth > 10:
        return "#ddf400";
    default:
        return "#a4f600";
    }
}

// set radiuss from magnitude
function markerSize(magnitude) {
if (magnitude <= 1) {
    return 8;
}

return magnitude * 50000;
}

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) { // feature is the data
//     layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><strong>Time: </strong>${ new Date(feature.properties.time)}<br><strong>Magnitute: </strong>${feature.properties.mag}`);
//   }

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

      // Set up the legend
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = [
            "-10",
            "10",
            "30",
            "50",
            "70",
            "90"
        ]
        var colors = [
            "#a4f600",
            "#ddf400",
            "#f7dc11",
            "#feb72a",
            "#fca35d",
            "#ff6066"
        ]
        var labels = []

        // Add min & max
        div.innerHTML = '<h4><strong>Earthquake Depth Legend</strong></h4>';
            for (var i = 0; i < limits.length; i++) {

                div.innerHTML +=
                '<i style="background:' + (limits[i] + 1) + '"></i> ' +
                limits[i] + (limits[i + 1] ? ' &ndash; ' + limits[i + 1] + '<br>' : '+');
        }

        // limits.forEach(function (limit, index) {
        // labels.push('<limit style="background-color: ' + colors[index] + '"></limit>' + 
        // limits[i] + (limits[i + 1])
        // )
        // })


        // for (var i = 0; i < limits.length; i++) {
        //     div.innerHTML +=
        //     labels.push(
        //         '<i style="background:' + colors[i] + '"></i>' + limits[i] + (limits[i + 1])
        //     )  

        // }
        // Add min & max
        // div.innerHTML = '<h1>Earthquake Depth</h1>' + '<div class="labels"><div class="min">' + limits[0] + '</div> \
        //         <div class="max">' + limits[limits.length - 1] + '</div></div>'

        // limits.forEach(function (limit, index) {
        // labels.push('<limit style="background-color: ' + colors[index] + '"></limit>' + 
        // limits[i] + (limits[i + 1])
        // )
        // })

        // div.innerHTML += labels.join('<br>');
        return div
    }
        // Adding legend to the map
    legend.addTo(myMap);

  };