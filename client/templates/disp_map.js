

Template.dispMap.events({
	'submit form':function(event,template){
		event.preventDefault();
		var element = template.find('input:radio[name=transit]:checked');
		var checked = $(element).val();
		//http://diveintohtml5.info/storage.html
		//using local storage to to store more permanently
		//TODO: add interface to clear/delete local storage data from above link

		localStorage["checked"] = checked;
		console.info("selected element is : " + checked);
		var placesSrc = gmap.searchBoxSrc.getPlaces();
		var placesDest = gmap.searchBoxDest.getPlaces();
		if (placesSrc == null||placesSrc == "" || placesDest == null||placesDest == "") {
			console.error("null places");
			return;
		}
		console.log("SourceLat : "+placesSrc[0].geometry.location.lat());
		console.log("SourceLong : "+placesSrc[0].geometry.location.lng());

		console.log("DestinationLat : "+placesDest[0].geometry.location.lat());
		console.log("DestinationLong : "+placesDest[0].geometry.location.lng());
		console.log(gmap.haversine(placesSrc[0].geometry.location, placesDest[0].geometry.location, "km"));
		console.log("google calculated without distancematrix : "+gmap.sphericalD(placesSrc[0].geometry.location, placesDest[0].geometry.location));
		//gmap.distanceMatrix(placesSrc[0].geometry.location,placesDest[0].geometry.location);
		
		if(checked == 'rider'){
			if(!$('#directions-panel').length){
				$('#map-canvas').addClass('col-sm-9 col-md-9 col-lg-9').removeClass('col-sm-12 col-md-12 col-lg-12');
				$(".mapd").append('<div class="col-xs-12 col-sm-3 col-md-3" id="directions-panel"></div>');
			}
			gmap.calcRoute(placesSrc[0].geometry.location,placesDest[0].geometry.location);
			gmap.calcBounds();
		}else{
			console.log('TODO show markers of riders from surrounding areas to destination');
		}
	}
});

Template.dispMap.destroyed = function(){
	Session.set('map', false);
}

Template.dispMap.helpers({
	marker: function(){
		if(Session.get('map'))
			return Marker.find({valid: true});
		else
			return null;
	}
});