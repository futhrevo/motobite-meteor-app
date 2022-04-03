/**
 * Created by rakeshkalyankar on 15/07/15.
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

Meteor.methods({
  sendRequest(friendId) {
    check(friendId, String);
    check(this.userId, String);

    const userId1 = this.userId;
    const userId2 = friendId;

    if (userId1 === userId2) {
      return 'You can not add yourself to your friends. Are you hacking :)';
    }

        // check whether users exists
    const userExists = Meteor.users.findOne({ _id: userId2 }, { fields: { _id: 1 } });
    if (!userExists) {
      return 'There is no user with given ID!';
    }

        // check friendship state
    const user = Meteor.users.findOne({ _id: userId1, 'profile.friends._id': userId2 }, { fields: { _id: 0, 'profile.friends': 1 } });

    if (user) {
      const state = _.find(user.profile.friends, u => u._id === userId2).state;

      if (state === 'new-request') {
        Meteor.users.update({ _id: userId1, 'profile.friends._id': userId2 },
                    { $set: { 'profile.friends.$.state': 'active' } });

        Meteor.users.update({ _id: userId2, 'profile.friends._id': userId1 },
                    { $set: { 'profile.friends.$.state': 'active' } });
        return 'You are now friends';
      } else if (state === 'pending') {
        return 'You have alrady sent friend request to this user!';
      } else if (state === 'was-blocked') {
        return 'You was blocked by this user';
      } else if (state === 'active') {
        return 'You are already friends!';
      }
    } else {
            // there was not any friend request from any side
            // add userId2 to userId1 as state=pending
            // add userId1 to userId2 as state=new-request

      Meteor.users.update({ _id: userId1 }, { $addToSet: { 'profile.friends': { _id: userId2, state: 'pending' } } });
      Meteor.users.update({ _id: userId2 }, { $addToSet: { 'profile.friends': { _id: userId1, state: 'new-request' } } });

      return 'Friend request has been sent!';
    }
    return 'unable to process';
  },

  acceptFriendship(friendId) {
    check(friendId, String);
    check(this.userId, String);

    const userId1 = this.userId;
    const userId2 = friendId;

    if (userId1 === userId2) {
      return false;
    }
        // check friendship state
    const user = Meteor.users.findOne({ _id: userId1, 'profile.friends._id': userId2 },
            { fields: { _id: 0, 'profile.friends': 1 } });

    if (user) {
      const state = _.find(user.profile.friends, u => u._id === userId2).state;

            // unblock only if was blocked
      if (state === 'new-request') {
        Meteor.users.update({ _id: userId1, 'profile.friends._id': userId2 },
                    { $set: { 'profile.friends.$.state': 'active' } });

        Meteor.users.update({ _id: userId2, 'profile.friends._id': userId1 },
          { $set: { 'profile.friends.$.state': 'active' } });
        return true;
      }
    }
    return false;
  },

  cancelFriendship(friendId) {
    check(friendId, String);
    check(this.userId, String);

    const userId1 = this.userId;
    const userId2 = friendId;

    if (userId1 === userId2) {
      return false;
    }

        // remove _id s from friends array of both users
    Meteor.users.update({ _id: userId1 }, { $pull: { 'profile.friends': { _id: userId2 } } });
    Meteor.users.update({ _id: userId2 }, { $pull: { 'profile.friends': { _id: userId1 } } });
    return true;
  },

  blockFriend(friendId) {
    check(friendId, String);
    check(this.userId, String);

    const userId1 = this.userId;
    const userId2 = friendId;

    if (userId1 === userId2) {
      return false;
    }

        // userId1 blocked userId2
        // userId2 was-blocked by userId1
    Meteor.users.update({ _id: userId1, 'profile.friends._id': userId2 },
            { $set: { 'profile.friends.$.state': 'blocked' } });

    Meteor.users.update({ _id: userId2, 'profile.friends._id': userId1 },
      { $set: { 'profile.friends.$.state': 'was-blocked' } });
    return true;
  },

  unblockFriend(friendId) {
    check(friendId, String);
    check(this.userId, String);

    const userId1 = this.userId;
    const userId2 = friendId;

    if (userId1 === userId2) {
      return false;
    }

        // check friendship state
    const user = Meteor.users.findOne({ _id: userId1, 'profile.friends._id': userId2 },
            { fields: { _id: 0, 'profile.friends': 1 } });

    if (user) {
      const state = _.find(user.profile.friends, u => u._id === userId2).state;

            // unblock only if was blocked
      if (state === 'blocked') {
        Meteor.users.update({ _id: userId1, 'profile.friends._id': userId2 },
                    { $set: { 'profile.friends.$.state': 'active' } });

        Meteor.users.update({ _id: userId2, 'profile.friends._id': userId1 },
          { $set: { 'profile.friends.$.state': 'active' } });
        return true;
      }
    }
    return false;
  },
});

