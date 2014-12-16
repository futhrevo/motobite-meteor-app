//Publications from the server after removal of autopublish

Meteor.publish('theMarkers',function(){
	return MarkerColl.find();
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

DriversAdvtColl.before.insert(function (userId, doc) {
	doc.at = new Date();
	doc.id = userId;
});
