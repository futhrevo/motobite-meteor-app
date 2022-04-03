import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { MarkerColl, DriversAdvtColl, DrivesAdvtColl, ULogsColl, TransactColl, Messages, SafeHouseColl, CommColl } from '../../api/collections/collectionsInit';
import { createRoom } from '../../api/helpers';

Meteor.publish('theMarkers', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return MarkerColl.find({ id: userid });
});

Meteor.publish('theDrivers', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return DriversAdvtColl.find({ id: userid });
});

Meteor.publish('theDrives', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return DrivesAdvtColl.find({ id: userid });
});

Meteor.publish('theLogs', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  return ULogsColl.find();
});

Meteor.publish('theRiderReqs', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return TransactColl.find({ $or: [{ requestee: userid }, { requester: userid }] }, { sort: { 'request.at': -1 } });
});
Meteor.publish('thefences', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return TransactColl.find({ $and: [{ $or: [{ requestee: userid }, { requester: userid }] }, { 'request.starts': { $gt: 1436079608 } }, { status: true }] });
});

Meteor.publish(null, function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  const userid = this.userId;
  return Meteor.users.find(
        { _id: userid },
        { fields: { roles: 1, mobile: 1, works: 1, settings: 1, registered_emails: 1 } });
});

Meteor.publish('friends', function (userIds) {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  check(userIds, [String]);
  return Meteor.users.find(
        { _id: { $in: userIds } },
    { fields: { _id: 1,
      'profile.name': 1,
      'profile.status': 1,
      'profile.updatedAt': 1,
      'profile.avatarUrl': 1 } });
});

Meteor.publish('acquaintance', function (userIds) {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  check(userIds, Array);
  return Meteor.users.find(
        { _id: { $in: userIds } },
    { fields: { _id: 1,
      'profile.name': 1,
      'profile.status': 1,
      'profile.updatedAt': 1,
      'profile.avatarUrl': 1 } });
});

Meteor.publish('recentChats', function (friendId) {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  check(friendId, String);
  const room = createRoom(this.userId, friendId);

  return Messages.find({ room, users: this.userId }, { sort: { time: -1 }, limit: 1 });
});

Meteor.publish('profile', function (id) {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  check(id, String);
  return Meteor.users.find(
        { _id: id },
    { fields: { _id: 1,
      'profile.name': 1,
      'profile.status': 1,
      'profile.updatedAt': 1,
      'profile.avatarUrl': 1 } });
});

Meteor.publish('chat', function (friendId, limit) {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  check(friendId, String);
  check(limit, Number);
  const room = createRoom(this.userId, friendId);

  return Messages.find({ room, users: this.userId }, { sort: { time: -1 }, limit });
});

Meteor.publish('theHouses', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return SafeHouseColl.find({ id: userid });
});

Meteor.publish('myOwnGroups', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return CommColl.find({ owner: userid });
});
Meteor.publish('myGroups', function () {
  if (!this.userId) {
    this.stop();
    return [];
  }
  check(this.userId, String);
  const userid = this.userId;
  return CommColl.find({ members: userid }, { fields: { pending: 0, blocked: 0, members: 0 } });
});
