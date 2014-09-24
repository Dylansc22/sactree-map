// DEFINE GLOBAL-ISH VARIABLES
var zips_geojson, bgs_geojson;

$(function () { $('#collapseOne').collapse({
      toggle: true
   })});

// FORMATTERS:
// STANDARDIZE VARIABLES
function nullFormatter(e) {
  return e > 100 ? '<small class="insufficient">Insuf. Data<small>' : e > 0 && e <= 1 ?
    Math.round(e * 100).toFixed(0) + '%' : Math.round(e).toFixed(0) + '%';
};
function bmiFormatter(e) {
  return e > 100 ? '<small class="insufficient">Insuf. Data<small>' : e;
};

// DECIDE WHICH LEGEND TO USE WHEN SWITCHING LAYERS
function legendFormatter(f) {
  return (f == 'Percent_TC' || f == 'Percent_TC_bg') ?
    '<img class="img-responsive" src="legend_tree.png"/>' : (f == 'per_gdex' ||
      f == 'per_mvpa' || f == 'soc_cohes') ?
    '<img class="img-responsive" src="legend_positive.png"/>' :
    '<img class="img-responsive" src="legend_negative.png"/>'
};

// FORMAT COLOR SCHEME BY QUANTILE
function getColorNegative(d) {
  return d > 100 ? 'rgba(0,0,0,0)'
    : d > ss.quantile(range,0.8) ? '#ff3030'
    : d > ss.quantile(range,0.6) ? '#ff7b68'
    : d > ss.quantile(range,0.4) ? '#ffac9b'
    : d > ss.quantile(range,0.2) ? '#ffd6cd'
    : d > ss.min(range) ? '#ffffff'
    : '#ffffff';
}

function getColorPositive(d) {
  return d > 100 ? 'rgba(0,0,0,0)'
    : d > ss.quantile(range,0.8) ? '#4682b4'
    : d > ss.quantile(range,0.6) ? '#7a9fc7'
    : d > ss.quantile(range,0.4) ? '#a7bfd9'
    : d > ss.quantile(range,0.2) ? '#d4deec'
    : d > ss.min(range) ? '#ffffff'
    : '#ffffff';
}

// BRING IN SEPARATE DATA FOR SS QUINTILE PARSING
var range,
  mean_bmi_range,
  per_ovw_ob_range,
  per_ob_range,
  per_mvpa_range,
  per_hi_bp_range,
  per_type2_range,
  per_gdex_range,
  per_asthma_range,
  soc_cohes_range;

// ASSIGN RANGES
$.getJSON("sactree_ranges.json", function(data) {
  mean_bmi_range = data.bmi;
  per_ovw_ob_range = data.ovw_ob;
  per_ob_range = data.ob;
  per_mvpa_range = data.mvpa;
  per_hi_bp_range = data.hi_bp;
  per_type2_range = data.type2;
  per_gdex_range = data.good_exc;
  per_asthma_range = data.asthma;
  soc_cohes_range = data.soc_coh;
});

// DEFINE MAP, ADD BASELAYER AND PLUGINS
L.mapbox.accessToken =
  'pk.eyJ1IjoibGFuZHBsYW5uZXIiLCJhIjoicUtlZGgwYyJ9.UFYz8MD4lI4kIzk9bjGFvg'
map = L.map("map", {
  zoom: 10,
  center: [38.574, -121.384],
});
map.zoomControl.setPosition('topleft');
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
var oldLayer,newLayer;
$('.layer').click(function() {
  oldLayer = myLayers[$('.active').attr('id')];
  newLayer = myLayers[$(this).attr('id')];
  console.log($('.active').attr('id') + ' --> ' + $(this).attr('id'));
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
  '<h2>Tree Cover - Census Block Groups</h2><hr><img class="img-responsive" src="legend_tree.png"/><hr><h4>Click on the map to learn more about tree cover or health outcomes at the zipcode level.</h4><hr>';

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
$.getJSON("sactree_geoms4.json", function(data) {
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

// DEFINE THE STYLE AND BEHAVIOR OF EACH LAYER
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
  return d > 100 ? 'rgba(0,0,0,0)' 
    : d > 30.6917 ? '#588125' 
    : d > 23.6632 ? '#729B3F' 
    : d > 15.7562 ? '#8BB458' 
    : d > 9.8709 ? '#A5CE72' 
    : d > 5.4646 ? '#BEE78B' 
    : d > 1.7676 ? '#D7FFA4' 
    : '#fff';
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
    '</h2><img class="img-responsive" src="legend_tree.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = mean_bmi_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.mean_bmi)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_ovw_ob_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.per_ovw_ob)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_ob_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.per_ob)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_mvpa_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorPositive(feature.properties.per_mvpa)
  };
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
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_hi_bp_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.per_hi_bp)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_type2_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.per_type2)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_gdex_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorPositive(feature.properties.per_gdex)
  };
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
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = per_asthma_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorNegative(feature.properties.per_asthma)
  };
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
    '</h2><img class="img-responsive" src="legend_negative.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
  range = soc_cohes_range;
  return {
    weight: 1,
    opacity: 0.8,
    color: '#444',
    fillOpacity: 0.9,
    fillColor: getColorPositive(feature.properties.soc_cohes)
  };
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
    '</h2><img class="img-responsive" src="legend_positive.png"/><hr><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td><b>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</b></td></tr><tr class="positive"><td>Physical Activity</td><td><b>' +
    nullFormatter(feature.properties.per_mvpa) +
    '</b></td></tr><tr class="positive"><td>Good/Excellent Health</td><td><b>' + nullFormatter(
      feature.properties.per_gdex) +
    '</b></td></tr><tr class="positive"><td>Social Cohesion</td><td><b>' +
    nullFormatter(feature.properties.soc_cohes) +
    '</b></td></tr><tr class="negative"><td>Mean BMI</td><td><b>' + bmiFormatter(feature.properties
      .mean_bmi) + '</b></td></tr><tr class="negative"><td>Overweight/Obese</td><td><b>' +
    nullFormatter(feature.properties.per_ovw_ob) +
    '</b></td></tr><tr class="negative"><td>Obese</td><td><b>' + nullFormatter(feature.properties
      .per_ob) + '</b></td></tr><tr class="negative"><td>High Blood Pressure</td><td><b>' + nullFormatter(
      feature.properties.per_hi_bp) +
    '</b></td></tr><tr class="negative"><td>Type 2 Diabetes</td><td><b>' + nullFormatter(
      feature.properties.per_type2) +
    '</b></td></tr><tr class="negative"><td>Asthma</td><td><b>' + nullFormatter(feature.properties
      .per_asthma) + '</b></td></tr></table><hr>';
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
    '</h2><img class="img-responsive" src="legend_tree.png"/><table class="table table-condensed"><tr class="tree"><td>Tree Cover</td><td>' +
    nullFormatter(feature.properties.Percent_TC) +
    '</td></tr></table><small><i>Select other layers for additional information, including health outcomes.</i></small><hr>';
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