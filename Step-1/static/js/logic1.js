
// Creat a map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// API call for geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(response => {
    console.log(response);

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

    // adding pop-ups to each layer
    L.geoJson(response, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: markerStyle,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }

    }).addTo(myMap);

    // legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function () {
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
    legend.addTo(myMap);


    // add grid to map
    // L.graticule().addTo(myMap);
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
});