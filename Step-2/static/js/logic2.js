

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(url).then(data => {
    d3.json(plateUrl).then(plateData => {

        createFeatures(data.features);
        createOverlay(plateData.features);

    });
});
// return marker color base on magnitude   
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
}
// assign marker size base on magnitude
function markerSize(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 3;
};

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

// create markers and pop-ups
function createMarkers(data) {
    var earthquakes = L.geoJSON(data, {
        pointToLayer: function(feature) {
            return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                style: markerStyle});
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    });
    createMap(earthquakes);
}

// create layers 
function createMap(earthquakes) {
    
    var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    var baseMap = { "Base": baseLayer
    };

    var overlayMap = {"Earthquakes": earthquakes};

    myMap = L.map("map2", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [baseLayer, earthquakes]
    });


    controlLayers = L.control.layers(baseMap, overlayMap).addTo(myMap);
}

// create legend
var legend = L.control({position: "bottomright"});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5], 
            labels = [],
            from, to;

        div.innerHtml = 'Magnitude<br><hr>'
            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + markerColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }
        div.innerHtml = labels.join('<br>');
        return div;
};

// create tetonic plate boundaries layer
function createOverlay(plateData) {
    var plate = L.geoJSON(plateData, {
        style: {
            color: "red",
            opacity: 0.7,
            fill: false
        }
    })
    myMap.addLayer(plate);

    controlLayers.addOverlay(plate, "Fault Lines");
};












