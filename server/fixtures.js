if (Posts.find().count() === 0 ){
	Posts.insert({
		lat: 12.9525812,
		lng: 77.7034538,
		title: "Home",
		user: "Admin"
	});
}

if (Marker.find().count() === 0){
	Marker.insert({
		gh: 'tdr38jvym8ns',
		id: 123456789,
		type: "taxi",
		valid: true
	});
}