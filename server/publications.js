/* global MarkerColl, DriversAdvtColl, DrivesAdvtColl, ULogsColl, TransactColl, createRoom, Messages, SafeHouseColl, CommColl */
//Publications from the server after removal of autopublish

Meteor.publish('theMarkers',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return MarkerColl.find({id:userid});
});

Meteor.publish('theDrivers',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return DriversAdvtColl.find({id:userid});
});

Meteor.publish('theDrives',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return DrivesAdvtColl.find({id:userid});
});

Meteor.publish('theLogs',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    return ULogsColl.find();
});

Meteor.publish('theRiderReqs',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return TransactColl.find({ $or: [ {requestee:userid },{requester:userid} ] },{sort: {'request.at': -1}});
});
Meteor.publish('thefences',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return TransactColl.find({$and:[{ $or: [ {requestee:userid },{requester:userid} ] },{'request.starts':{$gt:1436079608}},{status:true}]});
});

Meteor.publish(null ,function(){
    if(! this.userId){
        return;
    }
    const userid = this.userId;
    return Meteor.users.find (
        {_id: userid},
        {fields: { roles: 1, mobile:1,works:1,settings:1,registered_emails:1}});
});

Meteor.publish('friends', function(userIds) {
    if(! this.userId ){
        return null;
    }
    check(this.userId, String);
    check(userIds, [String]);
        return Meteor.users.find({_id: {$in: userIds}},
            {fields: {_id: 1, 'profile.name': 1, 'profile.status': 1,
            'profile.updatedAt': 1, 'profile.avatarUrl': 1}});
    return null;
});

Meteor.publish('members', function(groupId){
    if(! this.userId ){
        return null;
    }
    check(this.userId, String);
    check(groupId, String);
    const me = this.userId;
    let group = CommColl.findOne({ _id: groupId});
    if (group && group.owner === me) {
        let members = group.members;
        let blocked = group.blocked;
        let pending = group.pending;
        let userIds = members.concat(blocked, pending);
        return Meteor.users.find({_id: {$in: userIds}},
            {fields: {_id: 1, 'profile.name': 1, 'profile.status': 1,
            'profile.updatedAt': 1, 'profile.avatarUrl': 1}});
    }
    return null;
});
Meteor.publish('acquaintance',function(userIds){
    // Meteor._sleepForMs(2000);
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    check(userIds, Array);
    return Meteor.users.find(
        {_id: {$in: userIds}},
        {fields: {_id: 1, 'profile.name': 1, 'profile.status': 1,
            'profile.updatedAt': 1, 'profile.avatarUrl': 1}});
});

Meteor.publish('recentChats', function(friendId) {
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    check(friendId, String);
    const room = createRoom(this.userId, friendId);

    return Messages.find({room: room, users: this.userId}, {sort: {time: -1}, limit: 1});
});

Meteor.publish('profile', function(id) {
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    check(id, String);
    return Meteor.users.find(
        {_id: id},
        {fields: {_id: 1, 'profile.name': 1, 'profile.status': 1,
            'profile.updatedAt': 1, 'profile.avatarUrl': 1}});
});

Meteor.publish('chat', function(friendId, limit) {
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    check(friendId, String);
    check(limit, Number);
    const room = createRoom(this.userId, friendId);

    return Messages.find({room: room, users: this.userId}, {sort: {time: -1}, limit: limit});
});

Meteor.publish('theHouses',function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return SafeHouseColl.find({id:userid});
});

Meteor.publish('myOwnGroups', function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return CommColl.find({owner:userid});
});
Meteor.publish('myGroups', function(){
    if(! this.userId){
        return;
    }
    check(this.userId, String);
    const userid = this.userId;
    return CommColl.find({members:userid},{fields:{pending:0,blocked:0,members:0}});
});

DriversAdvtColl.before.insert(function (userId, doc) {
    doc.at = new Date();
    doc.id = userId;
    doc.ends = new Date((doc.startTime + doc.duration * 60)*1000);
});

// update user collection when a group is deleted
CommColl.after.remove(function (userId, doc) {
    if (doc.members.length > 0) {
        _.each(doc.members, function (member) {
            Meteor.users.update({_id: member}, {$pull: {'profile.communities': {_id: doc._id}}});
        })
    }
});