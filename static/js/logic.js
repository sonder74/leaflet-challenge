// Set URL for source data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Retrieve JSON string from source data, display it in console, and send it to createFeatures function
d3.json(url, function(data) {
    createFeatures(data.features);
});

// Retrieve features from JSON string, build pop-ups, and send data to createMap function
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<b>LOCATION:  </b>" + feature.properties.place + "<hr><b>TIME:  </b>" + new Date(feature.properties.time) + "<hr><b>MAGNITUDE:  </b>" + feature.properties.mag);
    };
    var earthquakeDataMag = 0;
    const earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            for (i = 0; i < earthquakeData.length; i++) {
                switch (true) {
                    case (feature.properties.mag >= 8):
                        return new L.CircleMarker(latlng, {
                            radius: 160,
                            fillColor: "black",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                    case (feature.properties.mag >= 6):
                        return new L.CircleMarker(latlng, {
                            radius: 80,
                            fillColor: "purple",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                    case (feature.properties.mag >= 4):
                        return new L.CircleMarker(latlng, {
                            radius: 40,
                            fillColor: "red",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                    case (feature.properties.mag >= 3):
                        return new L.CircleMarker(latlng, {
                            radius: 20,
                            fillColor: "orange",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                    case (feature.properties.mag >= 2):
                        return new L.CircleMarker(latlng, {
                            radius: 10,
                            fillColor: "yellow",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                    case (feature.properties.mag < 2):
                        return new L.CircleMarker(latlng, {
                            radius: 5,
                            fillColor: "white",
                            color: "black",
                            weight: .5,
                            opacity: 1,
                            fillOpacity: 0.4
                        });
                        break;
                };
            };
        },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
    console.log(earthquakeData);
};

// Create map
function createMap(earthquakes) {
    const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });
    const baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
    const overlayMap = {
        "Earthquakes in the Last 30 Days": earthquakes
    };
    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);


// Creating Legends:
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {
var div = L.DomUtil.create('div', 'info legend'),
grades = ["black", "purple", "red", "orange", "yellow", "white"],
labels = ["8+", "6-8" , "4-6" , "3-4" , "2-3", "<2"];
 // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML = "<h3>Earthquake<br>Magnitude</h3>";
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + grades[i] + '"></i> ' + labels[i] + "<br>";
        // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     };
return div;
};
// Adding legends to the Map:
legend.addTo(myMap);
};



