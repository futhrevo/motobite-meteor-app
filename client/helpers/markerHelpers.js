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
MarkerManager.prototype.addMarker = function(loc,options,type){
  var me = this;
  options = options || {};
  var opts = {};
  opts.icon = '/marker.svg';
  opts.position = new google.maps.LatLng(loc.lat,loc.lng);
  opts.title = loc.title || "TODO";
  var mymarker = me.Marker_(opts);


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

};

//Prototype to remove one marker
MarkerManager.prototype.delMarker = function(){

};

//Protype to query a user to get marker
MarkerManager.prototype.queryUser = function(){

};
