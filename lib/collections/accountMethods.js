/* global check */
/**
 * Created by rakeshkalyankar on 13/07/15.
 */

Meteor.methods({
    setDisplayName: function(displayName) {
        check(displayName, String);
        check(this.userId, String);
        displayName = displayName.substring(0, 40);

        Meteor.users.update(this.userId, {$set: {'profile.name': displayName, 'profile.updatedAt': new Date()}});
    },

    setStatus: function(status) {
        check(status, String);
        check(this.userId, String);
        status = status.substring(0, 80);

        Meteor.users.update(this.userId, {$set: {'profile.status': status, 'profile.updatedAt': new Date()}});
    },

    changeAvatar: function(url) {
        check(url, String);

        if (!this.userId) {
            return false;
        }

        var me = this.userId;
        //allow files only from bucket
        if (!isValidUploadURL(me, url)) {
           url = '/no_avatar.png';
        }

        Meteor.users.update(this.userId, {$set: {'profile.avatarUrl': url}});
    },

    setNotification: function(value) {
        check(value, Boolean);
        Meteor.users.update(this.userId, {$set: {'profile.notifications': value, 'profile.updatedAt': new Date()}});
    },

    //search users by email
    searchUser: function(searchId) {
        check(searchId, String);
        searchId = searchId.toLowerCase();
        return Meteor.users.findOne({"emails.address": searchId}, {fields: {profile: 1} });
    },
});