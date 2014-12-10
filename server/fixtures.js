if (MarkerColl.find().count() === 0){
	MarkerColl.insert({
		gh: 'tdr38juym8ns',
		_id: 'tEsTdAtA',
		type: "taxi",
		at: new Date,
		valid: true
	});
} 


Meteor.methods({
	rideQuery: function(post){
		//TODO use $and to query from and to which is not working in current mongodb < 2.55
		var result = DriversAdvtColl.find({"locs": {$near: {$geometry : {type : "Point", coordinates:post[0]},$maxDistance : 200}}},{fields: {"locs":0}});
		console.log("found "+ result.count()+" drivers");
		return result.fetch();
	}
});
