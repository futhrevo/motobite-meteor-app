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
	rideQuery: function(){
		var result = DriversAdvtColl.find({"locs": {$near: {$geometry : {type : "Point", coordinates:[77.698649,12.947997]},$maxDistance : 150}}},{fields: {"locs":0}});
		console.log("found "+ result.count()+" drivers");
		return result.fetch();
	}
});
