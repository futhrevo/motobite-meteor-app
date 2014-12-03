if (Marker.find().count() === 0){
	Marker.insert({
		gh: 'tdr38jvym8ns',
		id: 123456789,
		type: "taxi",
		at: new Date,
		valid: true
	});
}