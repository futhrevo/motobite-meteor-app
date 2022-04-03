import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { groupSchema } from './schema/group';
import { _ } from 'meteor/underscore';

/* global CommColl, Schema */
Meteor.methods({
  createGroup(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    check(doc, groupSchema);
    const me = this.userId;
    const dup = CommColl.findOne({ id: doc.id });
    if (dup !== null) {
      return { type: 'error', message: 'Group with this id already exists, please choose another' };
    }
    _.extend(doc, { owner: me, pending: [], blocked: [], members: [], createdAt: new Date() });
    const docid = CommColl.insert(doc);
    Meteor.users.update({ _id: me }, { $addToSet: { 'profile.communities': { _id: docid, private: doc.private, isowned: true } } });
    return { type: 'success', message: 'Success' };
  },
  searchGroup(doc, skip) {
    if (!this.userId) {
      return [];
    }
    check(this.userId, String);
    check(doc, String);
    check(skip, Number);
    const dup = CommColl.findOne({ id: doc });
    if (dup !== null) {
      return [dup];
    }
    console.log(doc);
    const cursor = CommColl.find({ $text: { $search: doc } },
      {
        fields: { score: { $meta: 'textScore' } },
        sort: { score: { $meta: 'textScore' } },
        limit: 20,
        skip,
      },
        );
    return cursor.fetch();
  },
  addGroup(id) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(id, String);
    const comm = CommColl.findOne({ _id: id });
    if (comm === null) {
      return { type: 'error', message: 'No group exists with this name' };
    }
        // if owner
    if (comm.owner === user) {
      return { type: 'info', message: 'You own this group' };
    }
        // if already added
    if (_.indexOf(comm.members, user) > -1) {
      return { type: 'info', message: 'You are already member of this group' };
    }
        // if request is pending
    if (_.indexOf(comm.pending, user) > -1) {
      return { type: 'info', message: 'You membership is pending by group owner' };
    }
        // if blocked
    if (_.indexOf(comm.blocked, user) > -1) {
      return { type: 'error', message: 'You are blocked from entering this group' };
    }
        // none
    if (comm.private) {
            // private group
      CommColl.update({ _id: id }, { $push: { pending: user } }, { upsert: true });
      return { type: 'success', message: 'You request is sent' };
    }
        // not private
    CommColl.update({ _id: id }, { $push: { members: user } }, { upsert: true });
    Meteor.users.update({ _id: user }, { $addToSet: { 'profile.communities': { _id: id, private: false, isowned: false } } });
    return { type: 'success', message: 'You are added to this group' };
  },
  deleteGroup(id) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(id, String);
    const comm = CommColl.findOne({ _id: id, owner: user });
    if (comm === null) {
      return { type: 'error', message: 'You cannot delete group you dont own' };
    }
    // if (comm.members.length() > 0) {
    // return {type:"info",message:"Your group has members, consider transferring your ownership"}
    // }

    console.log(`Delete Group with id: ${id}`);
    CommColl.remove({ _id: id, owner: user });
    return { type: 'success', message: 'Deleted' };
  },
  blockMember(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(doc, {
      groupId: String,
      memId: String,
    });
    const comm = CommColl.findOne({ _id: doc.groupId, owner: user });
    if (comm === null) {
      return { type: 'error', message: 'You cannot perform this action' };
    }
        // if already added
    if (_.indexOf(comm.members, doc.memId) > -1) {
      CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { members: doc.memId } });
      CommColl.update({ _id: doc.groupId, owner: user },
          { $push: { blocked: doc.memId } }, { upsert: true });
      Meteor.users.update({ _id: doc.memId }, { $pull: { 'profile.communities': { _id: doc.groupId } } });
      return { type: 'success', message: 'Member blocked' };
    }
    return { type: 'info', message: 'Member not found' };
  },
  acceptPending(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(doc, {
      groupId: String,
      memId: String,
    });
    const comm = CommColl.findOne({ _id: doc.groupId, owner: user });
    if (comm === null) {
      return { type: 'error', message: 'You cannot perform this action' };
    }
        // if pending
    if (_.indexOf(comm.pending, doc.memId) > -1) {
      CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { pending: doc.memId } });
      CommColl.update({ _id: doc.groupId, owner: user },
          { $push: { members: doc.memId } }, { upsert: true });

      Meteor.users.update({ _id: doc.memId }, { $addToSet: { 'profile.communities': { _id: doc.groupId, private: comm.private, isowned: false } } });
      return { type: 'success', message: 'Member Added' };
    }
    return { type: 'info', message: 'Member not found' };
  },
  rejectPending(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(doc, {
      groupId: String,
      memId: String,
    });
    const comm = CommColl.findOne({ _id: doc.groupId, owner: user });
    if (comm === null) {
      return { type: 'error', message: 'You cannot perform this action' };
    }
        // if pending
    if (_.indexOf(comm.pending, doc.memId) > -1) {
      CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { pending: doc.memId } });
      CommColl.update({ _id: doc.groupId, owner: user },
          { $push: { blocked: doc.memId } }, { upsert: true });
      return { type: 'success', message: 'Member Blocked' };
    }
    return { type: 'info', message: 'Member not found' };
  },
  unblockMember(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
    const user = this.userId;
    check(doc, {
      groupId: String,
      memId: String,
    });
    const comm = CommColl.findOne({ _id: doc.groupId, owner: user });
    if (comm === null) {
      return { type: 'error', message: 'You cannot perform this action' };
    }
        // if pending
    if (_.indexOf(comm.blocked, doc.memId) > -1) {
      CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { blocked: doc.memId } });
      CommColl.update({ _id: doc.groupId, owner: user },
          { $push: { members: doc.memId } }, { upsert: true });
      Meteor.users.update({ _id: doc.memId }, { $addToSet: { 'profile.communities': { _id: doc.groupId, private: comm.private, isowned: false } } });
      return { type: 'success', message: 'Member unBlocked' };
    }
    return { type: 'info', message: 'Member not found' };
  },
  unjoinGroup(doc) {
    if (!this.userId) {
      return {};
    }
    check(this.userId, String);
        // const user = this.userId;
    check(doc, {
      groupId: String,
      memId: String,
    });
    const comm = CommColl.findOne({ _id: doc.groupId });
    if (comm === null) {
      return { type: 'error', message: 'You cannot perform this action' };
    }
        // if member
    if (_.indexOf(comm.members, doc.memId) > -1) {
      CommColl.update({ _id: doc.groupId }, { $pull: { members: doc.memId } });
      Meteor.users.update({ _id: doc.memId }, { $pull: { 'profile.communities': { _id: doc.groupId } } });
      return { type: 'success', message: 'Unjoined group' };
    }
    return { type: 'info', message: 'Member not found' };
  },
});
