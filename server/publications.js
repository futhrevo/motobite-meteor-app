//Publications from the server after removal of autopublish

Meteor.publish('theMarkers',function(){
	var userid = this.userId;
	return MarkerColl.find({_id:userid});
});

Meteor.publish('theDrivers',function(){
	var userid = this.userId;
	return DriversAdvtColl.find({id:userid});
});

Meteor.publish('theDrives',function(){
	var userid = this.userId;
	return DrivesAdvtColl.find({id:userid});
});

Meteor.publish('theLogs',function(){
	return ULogsColl.find();
});

Meteor.publish('theRiderReqs',function(){
	var userid = this.userId;
	return TransactColl.find({ $or: [ {requestee:userid },{requester:userid} ] });
});
Meteor.publish('thefences',function(){
	var userid = this.userId;
	return TransactColl.find({$and:[{ $or: [ {requestee:userid },{requester:userid} ] },{'request.starts':{$gt:1436079608}},{status:true}]});
});

Meteor.publish(null ,function(){
	var userid = this.userId;
	return Meteor.users.find (
		{_id: this.userId},
		{fields: { roles: 1}});
});
DriversAdvtColl.before.insert(function (userId, doc) {
	doc.at = new Date();
	doc.id = userId;
});
