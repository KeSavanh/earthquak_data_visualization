
// Store our API endpoint as queryUrl.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(url).then(data => {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
})
/////////////
function markerColor(magnitude) {
    if (magnitude >= 5) {return "#fb0000"
    } else
    if (magnitude >= 4) {return "#fd5e1b"
    } else
    if (magnitude >= 3) {return "#fb8a34"
    } else
    if (magnitude >= 2) {return "#f6b14c"
    } else
    if (magnitude >= 1) {return "#edd565"
    } else
    if (magnitude >= 0) {return "#def87e"
    };
};
//////////////
//////////////
function markerSize(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 3;
};
/////////////
/////////////
function markerStyle(feature) {
    return {
        fillOpacity: 0.8,
        fillColor: markerColor(feature.properties.mag),
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.4,
        color: "darkgrey",
    };
};
////////////
////////////
function createFeatures(earthquakeData) {
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature) {
            return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        },
            style: markerStyle,
        
        
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<h4>Location: " + feature.properties.place + 
                "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
                "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
            }
    });
   
    createMap(earthquakes);
};
//////////////////
/////////////////
function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map" : street
    };

    var overlayMaps = {
        Earthquakes : earthquakes
    };
    // Creat a map object.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });
     // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // add grid to map
    L.latlngGraticule({
        showLabel: true,
        zoomInterval: [
            {start: 2, end: 2, interval: 40},
            {start: 3, end: 3, interval: 20},
            {start: 4, end: 4, interval: 10},
            {start: 5, end: 7, interval: 5},
            {start: 8, end: 20, interval: 1}
        ]
    }).addTo(myMap);
    // legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5];

        div.innerHtml = 'Magnitude<br><hr>'

        for (var i = 0; i < grades.length; i++) {
            div.innerHtml += 
                '<i style="background:' + markerColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
};


