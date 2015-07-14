Template.deleteMarker.helpers({
	marker: function(){
		if(Session.get('map'))
			return MarkerColl.find({valid: false});
		else
			return null;
	},
	deleteM:function(){
		var index = this.id;
		if(gmap.markers[index]){
			gmap.markers[index].setMap(null);
			gmap.markers[index] = undefined;
		}
	}
});
