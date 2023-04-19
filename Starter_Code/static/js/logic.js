//Create the map object
var map = L.map("map", {
  center: [40.7587, -111.8761],
  zoom: 4
});

// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize() function that will give each earthquake a different radius based on its magnitude.
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 5;
};

// Define a markerColor() function that will give each earthquake a different color based on its depth.
function markerColor(depth) {
  switch (true) {
    case depth > 90:
      return "#ff00ff";
    case depth > 70:
      return "#ffb6c1";
    case depth > 50:
      return "#7fffd4";
    case depth > 30:
      return "#008080";
    case depth > 10:
      return "#4169e1";
    case depth > -10:
      return "coral";
    default:
      return "#871008";
  }
};

// Create a legend for the marker colors
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  var colors = ["coral", "#4169e1", "#008080", "#7fffd4", "#ffb6c1", "#ff00ff"];

  // Loop through the grades and add each color and corresponding label to the legend
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(map);

// Getting our GeoJSON data
d3.json(link).then(function(data) {

  // Creating a GeoJSON layer with the retrieved data
  var earthquakes = L.geoJson(data, {
    pointToLayer: function(feature, coord) {
      return L.circleMarker(coord)
    },
    style: function(feature) {
      return {
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      }
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h1>Magnitude:  ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}</h1> <hr> <h3>${feature.properties.place}</h3>`)

    }
  }).addTo(map);

});
