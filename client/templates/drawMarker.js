Template.drawMarker.helpers({
	draw: function(){
		var index = this._id;
		var decMarker = geohash.decode(this.gh);
		//console.log(decMarker);
		var marker = {
			lat:decMarker[0],
			lng:decMarker[1],
			id: index
		};	
		if(gmap.markers[index] === undefined){
			console.log(marker);
			gmap.addMarker(marker,this.type,'gmapMarker');
		}else{
			if(this.valid){
				var latlng = new google.maps.LatLng(marker.lat, marker.lng);
				gmap.markers[index].setPosition(latlng);
			}else{
				console.log(this.id);
			}
			
		}
		
	},
});