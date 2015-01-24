// MarkerManager inspired from original MarkerManager
drivesMarkers = {};
driversMarkers = {};

MarkerManager = function (map, opt_opts) {
  var me = this;
  me.map_ = map;
  me.initialize(map,opt_opts);
};

MarkerManager.prototype.initialize = function (opt_opts) {
  var me = this;
  opt_opts = opt_opts || {};
};

//Prototype to add markers to manager
MarkerManager.prototype.addMarker = function(loc,options){
  var me = this;
  options = options || {};
  var opts = {};
  opts.icon = '/marker.svg';
  opts.position = new google.maps.LatLng(loc.lat,loc.lng);
  opts.title = loc.title || "TODO";
  var mymarker = me.Marker_(opts);
  if(options.hasOwnProperty("type")){
    if(options["type"] === "driver"){
      driversMarkers[loc.id] = mymarker;
    }else{
      drivesMarkers[loc.id] = mymarker;
    }
  }

};

MarkerManager.prototype.Marker_ = function(opts){
  var me = this;
  // To add the marker to the map, use the 'map' property
  var mymarker = new google.maps.Marker({
    position: opts.position,
    map: me.map_,
    title:opts.title,
    animation: google.maps.Animation.DROP,
    icon: opts.icon
  });

  return mymarker;
};


//Prototype to remove all markers
MarkerManager.prototype.clearMarkers = function(){
  for(var id in drivesMarkers){
    drivesMarkers[id]["setMap"](null);
    delete drivesMarkers[id];
  }

  for(var id in driversMarkers){
    driversMarkers[id]["setMap"](null);
    delete drivesMarkers[id];
  }
};

//Prototype to remove one marker
MarkerManager.prototype.delMarker = function(id){
  if (drivesMarkers.hasOwnProperty(id)) {
    drivesMarkers[id]["setMap"](null);
    delete drivesMarkers[id];
  }
  if (driversMarkers.hasOwnProperty(id)) {
    driversMarkers[id]["setMap"](null);
    delete driversMarkers[id];
  }
};

//Protype to query a user to get marker
MarkerManager.prototype.queryUser = function(id){
  var retMarker={};
  if (drivesMarkers.hasOwnProperty(id)) {
    retMarker.drives = drivesMarkers[id];
  }
  if (driversMarkers.hasOwnProperty(id)) {
    retMarker.drivers = driversMarkers[id];
  }
  return retMarker;
};
