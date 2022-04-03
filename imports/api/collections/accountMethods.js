import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  setDisplayName(displayName) {
    check(displayName, String);
    check(this.userId, String);
    const newdisplayName = displayName.substring(0, 40);

    Meteor.users.update(this.userId, { $set: { 'profile.name': newdisplayName, 'profile.updatedAt': new Date() } });
  },

  setStatus(status) {
    check(status, String);
    check(this.userId, String);
    const newStatus = status.substring(0, 80);

    Meteor.users.update(this.userId, { $set: { 'profile.status': newStatus, 'profile.updatedAt': new Date() } });
  },


  setNotification(value) {
    check(value, Boolean);
    Meteor.users.update(this.userId, { $set: { 'profile.notifications': value, 'profile.updatedAt': new Date() } });
  },

    // search users by email
  searchUser(searchId) {
    check(searchId, String);
    const newSearchId = searchId.toLowerCase();
    return Meteor.users.findOne({ 'emails.address': newSearchId }, { fields: { profile: 1 } });
  },

    // add email field to profile
  addEmail(cat, index, email) {
    check(this.userId, String);
    check(cat, String);
    check(email, String);
    check(index, Number);
    if (cat === 'emails') {
      Meteor.users.update(this.userId, { $push: {
        emails: {
          address: email, verified: false,
        },
      },
      });
    } else if (cat === 'works') {
      Meteor.users.update(this.userId, { $pull: { 'works.emails': { address: null } } });
      Meteor.users.update(this.userId, { $push: {
        'works.emails': {
          address: email, verified: false,
        },
      },
      });
    } else {
      throw new Meteor.Error('error', 'Server Error, Try again!');
    }
  },

    // add number to profile
  addNumber(number) {
    check(this.userId, String);
    check(number, String);
    if (number.length === 10) {
      Meteor.users.update(this.userId, { $pull: { mobile: { number: null } } });
      Meteor.users.update(this.userId, { $push: {
        mobile: {
          number, verified: false,
        },
      } });
    }
  },

    // delete an email from profile
  deleteEmail(cat, index, email) {
    check(this.userId, String);
    check(cat, String);
    check(email, String);
    check(index, Number);
  },
});
