import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Messages } from './collectionsInit';
import { createRoom } from '../helpers';
import { SendNotification } from '../mobileUtilities';

Meteor.methods({
  sendMessage(to, msg, type, fileURL) {
    check(msg, String);
    check(to, String);
    check(type, String);
    check(fileURL, String);
    check(this.userId, String);

    const from = this.userId;

    if (from === to) {
      return 'You can not send message to yourself';
    }
    const friend = _.filter(Meteor.user().profile.friends, mfriend => mfriend._id === to);
    if (friend) {
      const state = friend[0].state;
      if (state === 'active') {
        const room = createRoom(from, to);
        const time = Date.now();

        const message = {
          room,
          from,
          to,
          users: [to, from],
          msg,
          type,
          state: 'new-msg',
          time,
        };
 // if (type === 'image') {
//    var username = Meteor.users.findOne({_id: this.userId}, {fields: {username: 1}}).username;
//    if (!isValidUploadURL(username, fileURL)) {
 //        return 'Forbidden!';
//    }
//    message.fileURL = fileURL;
 //    message.msg = 'Image message';
  // }
        Messages.insert(message, (err, msgId) => {
          if (msgId) {
            if (Meteor.isServer) {
              const senderName = Meteor.user().profile.name;
              const title = senderName;
              const text = message.msg;
              const query = { userId: to };
              const payload = { msgId, sender: senderName };
              SendNotification(title, text, query, payload);
            }
          }
        });
      } else if (state === 'pending') {
        return 'User have not accepted your friendship yet!';
      } else if (state === 'was-blocked') {
        return 'You was blocked by this user';
      } else if (state === 'new-request') {
        return 'Please accept friendship first!';
      } else if (state === 'blocked') {
        return 'You have blocked this user!';
      }
    } else {
      return 'Youd do not have such kind of friend!';
    }
  },
  readMessage(msgId) {
    check(msgId, String);

    Messages.update({ _id: msgId }, { $set: { state: 'read' } });
  },
  deleteMessage(msgId) {
    check(msgId, String);
    Messages.update({ _id: msgId, users: this.userId }, { $pull: { users: this.userId } });
  },
  deleteAllMessages(room) {
    check(room, String);
    check(this.userId, String);
    Messages.update({ room, users: this.userId },
        { $pull: { users: this.userId } }, { multi: true });
  },
});
