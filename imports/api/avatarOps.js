import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { AvatarOpsColl } from './collections/collectionsInit';
import { isValidUploadURL } from './helpers';

const addOps = function (url) {
    // var docField = new Date().toDateString().replace(/\s+/g, '');
  AvatarOpsColl.update({ _id: 'deleteOps1' }, { $push: { ops: url } });
};
Meteor.methods({
  changeAvatar(url) {
    check(url, String);

    if (!this.userId) {
      return false;
    }

    const me = this.userId;
    let setUrl = url;
        // allow files only from bucket
    if (!isValidUploadURL(me, url)) {
      setUrl = '/no_avatar.png';
    }
    const oldUrl = Meteor.users.findOne({ _id: me }, { fields: { 'profile.avatarUrl': 1 } }).profile.avatarUrl;
    if (oldUrl !== '/no_avatar.png') {
      addOps(oldUrl);
    }
    Meteor.users.update(this.userId, { $set: { 'profile.avatarUrl': setUrl } });
    return true;
  },
});

