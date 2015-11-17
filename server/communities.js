/* global CommColl */
Meteor.methods({
	createGroup: function(doc){
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		check(doc, Schema.group);
		var me = this.userId;
		var dup = CommColl.findOne({id:doc.id});
		if(dup != null){
			return {type:"error",message:"Group with this id already exists, please choose another"}
		}
		_.extend(doc, {owner:me,pending:[],blocked:[],members:[], createdAt: new Date()});
		var docid = CommColl.insert(doc);
		Meteor.users.update({ _id: me }, { $addToSet: { 'profile.communities': { _id: docid, private: doc.private, isowned:true } } });
		return {type:"success",message:"Success"}
	},
	searchGroup: function (doc, skip) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		check(doc, String);
		check(skip, Number);
		var dup = CommColl.findOne({ id: doc });
		if(dup != null){
			return [dup];
		}
		console.log(doc);
		var cursor = CommColl.find({ $text: { $search: doc } },
			{
				fields: { score: { $meta: "textScore" } },
				sort: { score: { $meta: "textScore" } },
				limit: 20,
				skip: skip
			}
		);
		return cursor.fetch();
	},
	addGroup: function (id) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(id, String);
		var comm = CommColl.findOne({ _id: id });
		if (comm == null) {
			return {type:"error",message:"No group exists with this name"}
		}
		//if owner
		if (comm.owner == user) {
			return {type:"info",message:"You own this group"}
		}
		// if already added
		if (_.indexOf(comm.members, user) > -1) {
			return {type:"info",message:"You are already member of this group"}
		}
		// if request is pending
		if (_.indexOf(comm.pending, user) > -1) {
			return {type:"info",message:"You membership is pending by group owner"}
		}
		// if blocked
		if (_.indexOf(comm.blocked, user) > -1) {
			return {type:"error",message:"You are blocked from entering this group"}
		}
		// none
		if (comm.private) {
			// private group
			CommColl.update({ _id: id }, { $push: { pending: user } }, { upsert: true });
			return {type:"success",message:"You request is sent"}
		} else {
			// not private
			CommColl.update({ _id: id }, { $push: { members: user } }, { upsert: true });
			return {type:"success",message:"You are added to this group"}
		}
	},
	deleteGroup: function (id) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(id, String);
		var comm = CommColl.findOne({ _id: id, owner: user });
		if (comm == null) {
			return {type:"error",message:"You cannot delete group you dont own"}
		}
		// if (comm.members.length() > 0) {
		// 	return {type:"info",message:"Your group has members, consider transferring your ownership"}
		// }
		
		console.log("Delete Group with id: " + id);
		CommColl.remove({ _id: id, owner: user });
		return {type:"success",message:"Deleted"}
	},
	blockMember: function (doc) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(doc, {
			groupId: String,
			memId: String
		});
		var comm = CommColl.findOne({ _id: doc.groupId, owner: user });
		if (comm == null) {
			return {type:"error",message:"You cannot perform this action"}
		}
		// if already added
		if (_.indexOf(comm.members, doc.memId) > -1) {
			CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { members: doc.memId } });
			CommColl.update({ _id: doc.groupId, owner: user  }, { $push: { blocked: doc.memId } }, { upsert: true });
			return {type:"success",message:"Member blocked"}
		} else {
			return {type:"info",message:"Member not found"}
		}
	},
	acceptPending: function (doc) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(doc, {
			groupId: String,
			memId: String
		});
		var comm = CommColl.findOne({ _id: doc.groupId, owner: user });
		if (comm == null) {
			return {type:"error",message:"You cannot perform this action"}
		}
		// if pending
		if (_.indexOf(comm.pending, doc.memId) > -1) { 
			CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { pending: doc.memId } });
			CommColl.update({ _id: doc.groupId, owner: user  }, { $push: { members: doc.memId } }, { upsert: true });
			return {type:"success",message:"Member Added"}
		} else {
			return {type:"info",message:"Member not found"}
		}
	},
	rejectPending: function (doc) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(doc, {
			groupId: String,
			memId: String
		});
		var comm = CommColl.findOne({ _id: doc.groupId, owner: user });
		if (comm == null) {
			return {type:"error",message:"You cannot perform this action"}
		}
		// if pending
		if (_.indexOf(comm.pending, doc.memId) > -1) { 
			CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { pending: doc.memId } });
			CommColl.update({ _id: doc.groupId, owner: user  }, { $push: { blocked: doc.memId } }, { upsert: true });
			return {type:"success",message:"Member Blocked"}
		} else {
			return {type:"info",message:"Member not found"}
		}
	},
	unblockMember: function (doc) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(doc, {
			groupId: String,
			memId: String
		});
		var comm = CommColl.findOne({ _id: doc.groupId, owner: user });
		if (comm == null) {
			return {type:"error",message:"You cannot perform this action"}
		}
		// if pending
		if (_.indexOf(comm.blocked, doc.memId) > -1) { 
			CommColl.update({ _id: doc.groupId, owner: user }, { $pull: { blocked: doc.memId } });
			CommColl.update({ _id: doc.groupId, owner: user  }, { $push: { members: doc.memId } }, { upsert: true });
			return {type:"success",message:"Member unBlocked"}
		} else {
			return {type:"info",message:"Member not found"}
		}
	},
	unjoinGroup: function (doc) {
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		var user = this.userId;
		check(doc, {
			groupId: String,
			memId: String
		});
		var comm = CommColl.findOne({ _id: doc.groupId});
		if (comm == null) {
			return {type:"error",message:"You cannot perform this action"}
		}
		//if member
		if (_.indexOf(comm.members, doc.memId) > -1) { 
			CommColl.update({ _id: doc.groupId}, { $pull: { members: doc.memId } });
			return {type:"success",message:"Unjoined group"}
		} else {
			return {type:"info",message:"Member not found"}
		}
	}
});