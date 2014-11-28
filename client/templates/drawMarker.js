Template.drawMarker.helpers({
	draw: function(){
		var decMarker = geohash.decode(this.gh);
		console.log(decMarker);
		var marker = {
			lat:decMarker[0],
			lng:decMarker[1]
		};
		console.log(marker);
		gmap.addMarker(marker,this.type,'gmapMarker');
	}
});