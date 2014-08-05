// DEFINE GLOBAL-ISH VARIABLES
var zips_geojson, bgs_geojson;

// FORMATTERS:
// STANDARDIZE VARIABLES
function nullFormatter(e) {
  return e > 100 ? '<i><small>Insufficient Data<small></i>' : e > 0 && e <= 1 ?
    Math.round(e * 100).toFixed(0) + '%' : Math.round(e).toFixed(0) + '%';
};
function bmiFormatter(e) {
  return e > 100 ? '<i><small>Insufficient Data<small></i>' : e;
};

// DECIDE WHICH LEGEND TO USE WHEN SWITCHING LAYERS
function legendFormatter(f) {
  return (f == 'Percent_TC' || f == 'Percent_TC_bg') ?
    '<img class="img-responsive" src="legend_tree.png"/>' : (f == 'per_gdex' ||
      f == 'per_mvpa' || f == 'soc_cohes') ?
    '<img class="img-responsive" src="legend_positive.png"/>' :
    '<img class="img-responsive" src="legend_negative.png"/>'
};
// DEFINE MAP, ADD BASELAYER AND PLUGINS
L.mapbox.accessToken =
  'pk.eyJ1IjoibGFuZHBsYW5uZXIiLCJhIjoicUtlZGgwYyJ9.UFYz8MD4lI4kIzk9bjGFvg'
map = L.map("map", {
  zoom: 10,
  center: [38.574, -121.384],
});
map.zoomControl.setPosition('bottomleft');
var baseLayer = new L.mapbox.tileLayer('landplanner.map-khn9uycz').addTo(map);
var hash = L.hash(map);

// ADD THE REFERENCE OVERLAY
var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
var topLayer = new L.mapbox.tileLayer('sactree.h7id69df', {
  maxZoom: 17,
  opacity: 0.7
}).addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);

// ADD THE LAYER CONTROL FUNCTION
$('.layer').click(function() {
  var oldLayer = myLayers[$('.active').attr('id')];
  var newLayer = myLayers[$(this).attr('id')];
  console.log(oldLayer + ' --> ' + newLayer);
  $('#infobits').html('<h2>' + this.text + '</h2><hr>' + legendFormatter(
    this.id));
  map.removeLayer(oldLayer);
  $('.layer').removeClass('active');
  $(this).addClass('active');
  map.addLayer(newLayer);
});
// ADD TOOLTIPS
$('.layer').tooltip()

// DEFINE MAP INTERACTIVITY
popup = new L.Popup({
  autoPan: false
});
var closeTooltip;
var info;
document.getElementById('infobits').innerHTML =
  '<h2>Tree Cover - Block Groups</h2><hr><img class="img-responsive" src="legend_tree.png"/><hr><h4>Click on the map to learn more about tree cover or health outcomes at the zipcode level.</h4><hr>';

// DEFINE MAP LAYERS
var mean_bmi = L.geoJson(null, {
  style: getStyle2,
  onEachFeature: onEachFeature2
});
var per_ovw_ob = L.geoJson(null, {
  style: getStyle3,
  onEachFeature: onEachFeature3
});
var per_ob = L.geoJson(null, {
  style: getStyle4,
  onEachFeature: onEachFeature4
});
var per_mvpa = L.geoJson(null, {
  style: getStyle5,
  onEachFeature: onEachFeature5
});
var per_hi_bp = L.geoJson(null, {
  style: getStyle6,
  onEachFeature: onEachFeature6
});
var per_type2 = L.geoJson(null, {
  style: getStyle7,
  onEachFeature: onEachFeature7
});
var per_gdex = L.geoJson(null, {
  style: getStyle8,
  onEachFeature: onEachFeature8
});
var per_asthma = L.geoJson(null, {
  style: getStyle9,
  onEachFeature: onEachFeature9
});
var soc_cohes = L.geoJson(null, {
  style: getStyle10,
  onEachFeature: onEachFeature10
});
var Percent_TC = L.geoJson(null, {
  style: getStyle1,
  onEachFeature: onEachFeature1
});
var Percent_TC_bg = L.geoJson(null, {
  style: getStyle11,
  onEachFeature: onEachFeature11
});

var myLayers = {
    "Percent_TC_bg": Percent_TC_bg,
    "Percent_TC": Percent_TC,
    "mean_bmi": mean_bmi,
    "per_ovw_ob": per_ovw_ob,
    "per_ob": per_ob,
    "per_mvpa": per_mvpa,
    "per_hi_bp": per_hi_bp,
    "per_type2": per_type2,
    "per_gdex": per_gdex,
    "per_asthma": per_asthma,
    "soc_cohes": soc_cohes
};

// IMPORT DATA AND APPEND MAP LAYERS
$.getJSON("sactree_geoms3.json", function(data) {
  zips_geojson = topojson.feature(data, data.objects.zips).features;
  bgs_geojson = topojson.feature(data, data.objects.bgs).features;
  mean_bmi.addData(zips_geojson);
  per_ovw_ob.addData(zips_geojson);
  per_ob.addData(zips_geojson);
  per_mvpa.addData(zips_geojson);
  per_hi_bp.addData(zips_geojson);
  per_type2.addData(zips_geojson);
  per_gdex.addData(zips_geojson);
  per_asthma.addData(zips_geojson);
  soc_cohes.addData(zips_geojson);
  Percent_TC.addData(zips_geojson);
  Percent_TC_bg.addData(bgs_geojson);
});
map.addLayer(Percent_TC_bg);

// DEFINE THE STYLE AND BEHAVIOR OF EACH LAYER (THEN LEARN RECURSION, DAMMIT)
// 1 - Percent_TC
function getStyle1(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor1(feature.properties.Percent_TC)
  };
}

function getColor1(d) {
  return d > 100 ? 'rgba(0,0,0,0)' : d > 30.6917 ? '#588125' : d > 23.6632 ?
    '#729B3F' : d > 15.7562 ? '#8BB458' : d > 9.8709 ? '#A5CE72' : d > 5.4646 ?
    '#BEE78B' : d > 1.7676 ? '#D7FFA4' : '#fff';
}

function onEachFeature1(feature, layer) {
  layer.on({
    click: mouseclick1,
    mouseout: mouseout1
  });
}

function mouseclick1(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_tree.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout1(e) {
    Percent_TC.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 1
  // 2 - mean_bmi

function getStyle2(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor2(feature.properties.mean_bmi)
  };
}

function getColor2(d) {
  return d > 100 ? 'rgba(0,0,0,0)' : d > 30.4000 ? '#ff3030' : d > 28.7100 ?
    '#ff6756' : d > 27.4300 ? '#ff8c79' : d > 26.3700 ? '#ffac9b' : d > 25.1900 ?
    '#ffc8bc' : d > 23.9100 ? '#ffe5de' : '#ffffff';
}

function onEachFeature2(feature, layer) {
  layer.on({
    click: mousemove2,
    mouseout: mouseout2
  });
}

function mousemove2(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout2(e) {
    mean_bmi.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 2
  // 3 - per_ovw_ob

function getStyle3(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor3(feature.properties.per_ovw_ob)
  };
}

function getColor3(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.8500 ? '#ff3030' : d > 0.7100 ?
    '#ff6756' : d > 0.6200 ? '#ff8c79' : d > 0.5400 ? '#ffac9b' : d > 0.4500 ?
    '#ffc8bc' : d > 0.3700 ? '#ffe5de' : '#ffffff';
}

function onEachFeature3(feature, layer) {
  layer.on({
    click: mousemove3,
    mouseout: mouseout3
  });
}

function mousemove3(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout3(e) {
    per_ovw_ob.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 3
  // 4 - per_ob

function getStyle4(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor4(feature.properties.per_ob)
  };
}

function getColor4(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.4700 ? '#ff3030' : d > 0.3800 ?
    '#ff6756' : d > 0.3000 ? '#ff8c79' : d > 0.2300 ? '#ffac9b' : d > 0.1700 ?
    '#ffc8bc' : d > 0.0400 ? '#ffe5de' : '#ffffff';
}

function onEachFeature4(feature, layer) {
  layer.on({
    click: mousemove4,
    mouseout: mouseout4
  });
}

function mousemove4(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout4(e) {
    per_ob.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 4
  // 5 - per_mvpa

function getStyle5(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor5(feature.properties.per_mvpa)
  };
}

function getColor5(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.7500 ? '#4682b4' : d > 0.6600 ?
    '#6a95c0' : d > 0.6000 ? '#89aacd' : d > 0.5400 ? '#a7bfd9' : d > 0.4400 ?
    '#c5d4e6' : d > 0.2400 ? '#e2e9f2' : '#ffffff';
}

function onEachFeature5(feature, layer) {
  layer.on({
    click: mousemove5,
    mouseout: mouseout5
  });
}

function mousemove5(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout5(e) {
    per_mvpa.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 5
  // 6 - per_hi_bp

function getStyle6(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor6(feature.properties.per_hi_bp)
  };
}

function getColor6(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.3400 ? '#ff3030' : d > 0.2800 ?
    '#ff6756' : d > 0.2200 ? '#ff8c79' : d > 0.1600 ? '#ffac9b' : d > 0.100 ?
    '#ffc8bc' : '#ffffff';
}

function onEachFeature6(feature, layer) {
  layer.on({
    click: mousemove6,
    mouseout: mouseout6
  });
}

function mousemove6(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout6(e) {
    per_hi_bp.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 6
  // 7 - per_type2

function getStyle7(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor7(feature.properties.per_type2)
  };
}

function getColor7(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.1600 ? '#ff3030' : d > 0.0800 ?
    '#ff6756' : d > 0.06000 ? '#ff8c79' : d > 0.0400 ? '#ffac9b' : d > 0.0200 ?
    '#ffc8bc' : d > 0.0100 ? '#ffe5de' : '#ffffff';
}

function onEachFeature7(feature, layer) {
  layer.on({
    click: mousemove7,
    mouseout: mouseout7
  });
}

function mousemove7(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout7(e) {
    per_type2.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 7
  // 8 - per_gdex

function getStyle8(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor8(feature.properties.per_gdex)
  };
}

function getColor8(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.9 ? '#4682b4' : d > 0.84 ? '#6a95c0' :
    d > 0.8 ? '#89aacd' : d > 0.75 ? '#a7bfd9' : d > 0.7 ? '#c5d4e6' : d > 0.56 ?
    '#e2e9f2' : '#ffffff';
}

function onEachFeature8(feature, layer) {
  layer.on({
    click: mousemove8,
    mouseout: mouseout8
  });
}

function mousemove8(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout8(e) {
    per_gdex.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 8
  // 9 - per_asthma

function getStyle9(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor9(feature.properties.per_asthma)
  };
}

function getColor9(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.2800 ? '#ff3030' : d > 0.1700 ?
    '#ff6756' : d > 0.13000 ? '#ff8c79' : d > 0.100 ? '#ffac9b' : d > 0.0700 ?
    '#ffc8bc' : d > 0.0200 ? '#ffe5de' : '#ffffff';
}

function onEachFeature9(feature, layer) {
  layer.on({
    click: mousemove9,
    mouseout: mouseout9
  });
}

function mousemove9(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout9(e) {
    per_asthma.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 9
  // 10 - soc_cohes

function getStyle10(feature) {
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor10(feature.properties.soc_cohes)
  };
}

function getColor10(d) {
  return d > 1 ? 'rgba(0,0,0,0)' : d > 0.9380 ? '#4682b4' : d > 0.8300 ?
    '#6a95c0' : d > 0.7320 ? '#89aacd' : d > 0.6370 ? '#a7bfd9' : d > 0.5520 ?
    '#c5d4e6' : d > 0.3150 ? '#e2e9f2' : '#ffffff';
}

function onEachFeature10(feature, layer) {
  layer.on({
    click: mousemove10,
    mouseout: mouseout10
  });
}

function mousemove10(e) {
  var feature = e.target.feature;
  info = '<h2>' + feature.properties.NAME + ' - ' + feature.properties.ID +
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr><td>>150min MVPA/wk</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr><tr><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr></table><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout10(e) {
    soc_cohes.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 10
  // 11 - Percent_TC_bg

function getStyle11(feature) {
  return {
    weight: 1,
    opacity: 0.3,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColor11(feature.properties.Percent_TC)
  };
}

function getColor11(d) {
  return d > 100 ? 'rgba(0,0,0,0)' : d > 41.17 ? '#588125' : d > 31.832 ?
    '#729B3F' : d > 25.264 ? '#8BB458' : d > 19.533 ? '#A5CE72' : d > 13.713 ?
    '#BEE78B' : d > 0.5 ? '#D7FFA4' : '#fff';
}

function onEachFeature11(feature, layer) {
  layer.on({
    click: mousemove11,
    mouseout: mouseout11
  });
}

function mousemove11(e) {
  var feature = e.target.feature;
  info = '<h2>Census Block Group: ' + feature.properties.GEOID10 +
    '</h2><img class="img-responsive" src="legend_tree.png"/><hr>Tree Cover: <b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b><br><small><i>Select other layers for additional information, including health outcomes.</i></small><hr>';
  document.getElementById('infobits').innerHTML = info;
  //A better way, but not working:
  //document.getElementsByName('path')[0].style.weight=1;
  e.target.setStyle({
    opacity: 0.8,
    weight: 5,
    color: '#444',
    fillOpacity: 0.9
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    e.target.bringToFront();
  }
};

function mouseout11(e) {
    Percent_TC_bg.resetStyle(e.target);
    //document.getElementById('infobits').innerHTML = '';
  }
  // End 11