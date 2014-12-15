if (MarkerColl.find().count() === 0){
	MarkerColl.insert({
		gh: 'tdr38juym8ns',
		_id: 'tEsTdAtA',
		type: "taxi",
		at: new Date(),
		valid: true
	});
}


Meteor.methods({
	postLocation: function(postAttributes){
		check(this.userId, String);
		check(postAttributes,{
			gh: String
		});
		var userid = Meteor.user()._id;
		var qw = MarkerColl.findOne({_id:userid});
		if(qw.length < 1){
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
		var result = DriversAdvtColl.find({"locs": {$near: {$geometry : {type : "Point", coordinates:post[0]},$maxDistance : 200}}},{fields: {"locs":0}});
		console.log("found "+ result.count()+" drivers");
		return result.fetch();
	},

	postDriveAdvt : function(postAttributes){
		check(this.userId, String);
		//TODO find a better way to check for array of numbers
		check(postAttributes,[Match.Any]);
		console.log(postAttributes[2]);
		var userid = this.userId;
		var post = {
				id		: userid,
				at		: new Date(),
				mapid	: null,
				duration: postAttributes[3],
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
