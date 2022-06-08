var map = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4,
});

var streetmap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

var quakeData = [];

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
).then(function (quakeRes) {
  quakeRes.features.forEach((feature) => {
    quakeData.push({
      location: [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ],
      dep: feature.geometry.coordinates[2],
      mag: feature.properties.mag,
    });
  });

  for (var i = 0; i < quakeData.length; i++) {
    // Conditionals for country points
    var color = "";
    if (quakeData[i].dep >= 90) {
      color = "red";
    } else if (quakeData[i].dep < 90 || quakeData[i].dep >= 60) {
      color = "orange";
    } else if (quakeData[i].dep < 60 || quakeData[i].dep >= 30) {
      color = "yellow";
    } else {
      color = "green";
    }

    // Add circles to the map.
    L.circle(quakeData[i].location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust the radius.
      radius: quakeData[i].mag * 20000,
    })
      .bindPopup(
        `<h1>Details</h1> <hr> <h3>Depth: ${quakeData[i].dep}</h3> <h3>Magnitude: ${quakeData[i].mag}</h3>`
      )
      .addTo(map);
  }

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth</h4>";
    div.innerHTML +=
      '<i style="background: green"></i><span>Less than 30</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>30-60</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>60-90</span><br>';
    div.innerHTML +=
      '<i style="background: red"></i><span>More than 90</span><br>';

    return div;
  };

  legend.addTo(map);
});
