/* global check */
/* global Mongo */
/* global Messages */
/* global TransactColl */
/* global UserMapColl */
/* global DrivesAdvtColl */
/* global DriversAdvtColl */
/* global ULogsColl */
/* global MarkerColl */
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
                },
            });
            return true;
        }
    });
}