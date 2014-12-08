if (Marker.find().count() === 0){
	Marker.insert({
		gh: 'tdr38jvym8ns',
		id: 123456789,
		type: "taxi",
		at: new Date,
		valid: true
	});
} 

console.log(DrivesAdvt.find({"nodes.locs": {$near: {$geometry : {type : "Point", coordinates:[77.6762463,12.9260308]},$maxDistance : 10}}}).fetch());