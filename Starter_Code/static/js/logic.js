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

// Getting our GeoJSON data
d3.json(link).then(function(data) {

    // Define a markerSize() function that will give each earthquake a different radius based on its magnitude.
    function markerSize(magnitude) {
        return Math.sqrt(magnitude) * 5;
    };

    function markerColor(depth) {
        switch(true) {
            case depth > 90: return "#500887";
            case depth > 70: return "#100887";
            case depth > 50: return "#086987";
            case depth > 30: return "#08874c";
            case depth > 10: return "#878108";
            default: return "#871008";
        }
    };

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: markerColor(feature.geometry.coordinates[2]), 
            color: "#000000", 
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    };

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, coord) {
            return L.circleMarker(coord)
        }, 
        style: styleInfo, 
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h1>Magnitude:  ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}</h1> <hr> <h3>${feature.properties.place}</h3>`)
            
        }
    }).addTo(map);

    let legend = L.control({
        position: "bottomright"
    });
    
    legend.onAdd = function (){
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#871008", "#878108", "#08874c", "#086987", "#100887", "#500887"];
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
      
        };

    legend.addTo(map);
});