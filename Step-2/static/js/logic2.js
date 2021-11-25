
// Store our API endpoint as queryUrl.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

var myMap = {};
// Perform a GET request to the query URL
d3.json(url).then(data => {
        createFeatures(data.features);
});
d3.json(plateUrl).then(plateData => {
    createOverlay(plateData.features);
});
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
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satelite Map" : satMap,
        "Gray Map" : grayMap,
        "Outdoors" : outdoorMap
    };

    var overlayMaps = {
        "Earthquakes" : earthquakes
    };
    // Creat a map object.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [satMap, earthquakes]
    });
     // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    var layersControl = L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    });
    layersControl.addTo(myMap);

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

//////
function createOverlay(plateData) {
    var tectonicLine = L.geoJSON(plateData, {
        style : {
            color: "red",
            weight: 1.5,
            opacity: 1
        }
    });
    myMap.addLayer(tectonicLine);
    layersControl.addOverlay(tectonicLine, "Fault Lines");
};

