/* global roomToUsers */
/**
 * Created by rakeshkalyankar on 16/07/15.
 */

Template.recentChats.helpers({
    recentChats: function(){
        let friends = _.map(Meteor.user().profile.friends, function(f){
                return f._id;
            });

            let recentChats = [];

            for(let i=0;i < friends.length;i++){
                let room = createRoom(Meteor.userId(),friends[i]);
                let message = Messages.findOne({room:room},{sort:{time:-1}});

                if(message){
                    recentChats.push({room:room,message:message});
                }
            }

            // newest first
            recentChats = _.sortBy(recentChats,function(chat){
                return -1 * chat.message.time;
            });

            return recentChats;

    },
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