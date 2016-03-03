/* global CommColl, SafeHouseColl, Messages, TransactColl, UserMapColl, DrivesAdvtColl, DriversAdvtColl, ULogsColl, MarkerColl, check, Mongo */
/* exported CommColl, SafeHouseColl, Messages, TransactColl, UserMapColl, DrivesAdvtColl, ULogsColl, MarkerColl */


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

Messages = new Mongo.Collection('messages');

// collection to add safe house addresses
SafeHouseColl = new Mongo.Collection('house');

// collection for user communities
CommColl = new Mongo.Collection('communities');

if(Meteor.isServer){
    DriversAdvtColl.allow({
        insert: function(userId, doc){
            check(doc,{
                overview : String,
                summary : String,
                bounds : Object,
                distance : Number,
                duration : Number,
                startTime : Number,
                origin : [String],
                destination : [String],
                gh6 : [String],
                locs : {
                    type : String,
                    coordinates : [[Number]]
                }
            });
            return true;
        }
    });
    // MarkerColl.allow({
    //     update: function(userId, doc, fieldNames, modifier){
    //         console.log(userId);
    //         console.log(doc);
    //         console.log(fieldNames);
    //           return false;
    //     }
    // });
}