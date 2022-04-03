import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

// Collections to store marker data
export const MarkerColl = new Mongo.Collection('marks');

// Collection to store user ride logs
export const ULogsColl = new Mongo.Collection('ulogs');

// collection to store driver advertisements
export const DriversAdvtColl = new Mongo.Collection('drivers');

// collection to store rider advertisements
export const DrivesAdvtColl = new Mongo.Collection('drives');

// collection to store and map each user advertisements
export const UserMapColl = new Mongo.Collection('mappings');

// collection to store user transactions
export const TransactColl = new Mongo.Collection('transActs');

export const Messages = new Mongo.Collection('messages');

// collection to add safe house addresses
export const SafeHouseColl = new Mongo.Collection('house');

// collection for user communities
export const CommColl = new Mongo.Collection('communities');

// create collection for deleting task of photos on bucket
export const AvatarOpsColl = new Mongo.Collection('avatarOps');

// create emailotp for user
export const EmailOtpColl = new Meteor.Collection('emailotp');
// create smsotp for user
export const SmsOtpColl = new Meteor.Collection('smsotp');

// to enable indexing based on 2d sphere for DrivesAdvtColl
DrivesAdvtColl._ensureIndex({ 'nodes.locs': '2dsphere' }, { background: true });
DriversAdvtColl._ensureIndex({ locs: '2dsphere' }, { background: true });
DriversAdvtColl._ensureIndex({ ends: 1 }, { expireAfterSeconds: 300 });
EmailOtpColl._ensureIndex({ id: 1 });
EmailOtpColl._ensureIndex({ at: 1 }, { expireAfterSeconds: 3600 });
SmsOtpColl._ensureIndex({ id: 1 });
SmsOtpColl._ensureIndex({ at: 1 }, { expireAfterSeconds: 900 });
SafeHouseColl._ensureIndex({ id: 1 });
MarkerColl._ensureIndex({ id: 1 });
MarkerColl._ensureIndex({ loc: '2dsphere', at: -1 }, { background: true });
    // Messages.find({room: room, users: this.userId}, {sort: {time: -1}, limit: 1})
Messages._ensureIndex({ room: 1, users: 1, time: -1 });
CommColl._ensureIndex({ owner: 1 });
CommColl._ensureIndex({ id: 1 });
CommColl._ensureIndex({ members: 1 });
CommColl._ensureIndex({ name: 'text' });
TransactColl._ensureIndex({ requestee: 1, requester: 1, advtRequest: 1 });
TransactColl._ensureIndex({ ends: 1 }, { expireAfterSeconds: 300 });

// TODO: check if duration calculation is right
DriversAdvtColl.before.insert((userId, doc) => {
  doc.at = new Date();
  doc.id = userId;
  doc.ends = new Date((doc.startTime + (doc.duration * 60)) * 1000);
});

// update user collection when a group is deleted
CommColl.after.remove((userId, doc) => {
  if (doc.members.length > 0) {
    _.each(doc.members, (member) => {
      Meteor.users.update({ _id: member }, { $pull: { 'profile.communities': { _id: doc._id } } });
    });
  }
});

if (Meteor.isServer) {
  if (MarkerColl.find().count() === 0) {
    MarkerColl.insert({
      gh: 'tdr38juym8ns',
      type: 'taxi',
      at: Date.now(),
      valid: true,
      heading: null,
      loc: {
        type: 'Point',
        coordinates: [77, 12],
      },
      id: 'tEsTdAtA',
    });
  }
  if (AvatarOpsColl.find().count() === 0) {
    AvatarOpsColl.insert({
      _id: 'deleteOps1',
      ops: [],
    });
  }
  DriversAdvtColl.allow({
    insert(userId, doc) {
      check(doc, {
        overview: String,
        summary: String,
        bounds: Object,
        distance: Number,
        duration: Number,
        startTime: Number,
        origin: [String],
        destination: [String],
        gh6: [String],
        locs: {
          type: String,
          coordinates: [[Number]],
        },
      });
      return true;
    },
  });
}

