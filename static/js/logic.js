// store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  createMarkers(data.features);

});

function createMarkers(feature) {
    var earthquakes = L.geoJSON(feature, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.title}</h3><hr><strong>Date & Time: </strong>${ new Date(feature.properties.time)}<br><strong>Magnitude: </strong>${feature.properties.mag}<br><strong>Depth: </strong>${feature.geometry.coordinates[2]}`)
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
});

    createMap(earthquakes);
}

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

// set radius from magnitude
function markerSize(magnitude) {
if (magnitude <= 1) {
    return 8;
}

return magnitude * 50000;
}

function createMap(earthquakes) {

    // define layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Street Map": streetmap,
      "Satelite Map": satmap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

      // set up the legend
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var labels = [
            "-10-10",
            "10-30",
            "30-50",
            "50-70",
            "70-90",
            "90+"
        ];
        var colors = [
            "#a4f600",
            "#ddf400",
            "#f7dc11",
            "#feb72a",
            "#fca35d",
            "#ff6066"
        ];
        var limits = [0,1,2,3,4,5];
        var legendInfo = "<h4>Earthquake Depth</h4>"
        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
          div.innerHTML += "<li style=\"background-color: " + colors[index] + "\">"+labels[index]+"</li>"
        });
        return div;
      };
  legend.addTo(myMap);
}