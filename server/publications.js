//Publications ffrom the server after removal of autopublish

Meteor.publish('theMarkers',function(){
	return MarkerColl.find();
});

// Meteor.publish('theDrivers',function(){
// 	return DriversAdvtColl.find();
// });

Meteor.publish('theDrives',function(){
	return DrivesAdvtColl.find();
});

Meteor.publish('theLogs',function(){
	return ULogsColl.find();
});