// Collections to store marker data
MarkerColl = new Mongo.Collection('marks');

// Collection to store user ride logs
ULogsColl = new Mongo.Collection('ulogs');

//collection to store driver advertisements
DriversAdvtColl = new Mongo.Collection('drivers');

//collection to store rider advertisements
DrivesAdvtColl = new Mongo.Collection('drives');

//collection to store and map each user advertisements
UserMapColl = new Mongo.Collection('mappings');

//collection to store user transactions
TransactColl = new Mongo.Collection('transActs');

Messages = new Meteor.Collection('messages');

