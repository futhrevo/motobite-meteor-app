/**
 * Created by rakeshkalyankar on 16/07/15.
 */

Template.recentChats.helpers({
    totalRecentChats: function() {
        return Messages.find().count();
    },

    // find friend's id
    friendId: function(room) {
        return roomToUsers(room, Meteor.userId())[1];
    },

    // find friend's avatar
    friendAvatar: function(room) {
        var friendId = roomToUsers(room, Meteor.userId())[1];
        return Meteor.users.findOne({_id: friendId}).profile.avatarUrl;
    },

    // find friends's display name
    friendDisplayName: function(room) {
        var friendId = roomToUsers(room, Meteor.userId())[1];
        return Meteor.users.findOne({_id: friendId}).profile.name;
    },

    isNewMessage: function(from, state) {
        return state === 'new-msg' && from !== Meteor.userId();
    }
});