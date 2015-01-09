Meteor.startup(function () {

if (MarkerColl.find().count() === 0){
	MarkerColl.insert({
		gh: 'tdr38juym8ns',
		_id: 'tEsTdAtA',
		type: "taxi",
		at: new Date(),
		valid: true
	});
}
// to enable indexing based on 2d sphere for DrivesAdvtColl
DrivesAdvtColl._ensureIndex({"nodes.locs":"2dsphere"});

DriversAdvtColl._ensureIndex({"locs":"2dsphere"});
});


Meteor.methods({
	postLocation: function(postAttributes){
		check(this.userId, String);
		check(postAttributes,{
			gh: String
		});
		var userid = Meteor.user()._id;
		var qw = MarkerColl.findOne({_id:userid});
		if(!qw){
			console.log("new user");
			var post = _.extend(postAttributes,{
				_id:userid,
				type: "user",
				at: new Date(),
				valid : true
			});
			MarkerColl.insert(post);
		}else{
			console.log('user entry present at '+userid);
			ULogsColl.update({_id:userid},{$push:{logs : EJSON.stringify(qw)}},{upsert:true});
			var post = _.extend(postAttributes,{
				at: new Date(),
				valid : true
			});
			MarkerColl.update(userid,{$set:post});
		}

	},

	rideQuery: function(post){
		//TODO use $and to query from and to which is not working in current mongodb < 2.55
		//TODO mongo aggregation http://joshowens.me/using-mongodb-aggregations-to-power-a-meteor-js-publication/
		// var result = DriversAdvtColl.find({"locs": {$near: {$geometry : {type : "Point", coordinates:post[0]},$maxDistance : 200}}},{fields: {"locs":0}});
		var ids = [];
		var a = DriversAdvtColl.aggregate([{
			"$geoNear" : {near:{type : "Point", coordinates:[77.697839,12.951040]},
			distanceField:"dist.calculated",
			maxDistance:250,
			spherical:true}},{
				$match:{startTime:{$gt:1410529121}}},{
					$match:{gh6:"tdr1zf"}}])
					.map( function(u) {
						if(u.gh6.indexOf("tdr1zv") < u.gh6.indexOf("tdr1xf"))
							return {_id : u._id, dist : u.dist.calculated};
						else
							return null;
							} );

		var a = a.filter(function(element){return element != null});
		for(var i=0;i < a.length;i++){
			ids[i] = a[i]._id;
		}


		console.log(a);
		console.log("TODO limit the number of results for performance");
		console.log(ids);
		var driverpool = DriversAdvtColl.find({_id:{$in:ids}},{fields: {"locs":0,"origin":0,"originCoord" : 0}}).fetch();

		// var result = a;

		// console.log("found "+ result.count()+" drivers");
		// return result.fetch();
		return [a,driverpool];

	},

	postDriveAdvt : function(postAttributes){
		check(this.userId, String);
		//TODO find a better way to check for array of numbers
		check(postAttributes,[Match.Any]);
		// console.log(postAttributes[2]);
		var userid = this.userId;
		var post = {
				id		: userid,
				at		: new Date(),
				mapid	: null,
				duration: postAttributes[postAttributes.length-1],
				origin 	: postAttributes[3],
				destination : postAttributes[4],
				startTime : postAttributes[2],
				nodes	: [{
						addr:"from",
						locs:{
							type:"Point",
							coordinates:postAttributes[0]
						}
						},{
						addr:"to",
						locs:{
							type:"Point",
							coordinates:postAttributes[1]
						}
					}]
			};
		DrivesAdvtColl.insert(post);

	}
});
