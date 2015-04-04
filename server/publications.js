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
DriversAdvtColl.before.insert(function (userId, doc) {
	doc.at = new Date();
	doc.id = userId;
});
