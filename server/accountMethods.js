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

        //var username = Meteor.users.findOne({_id: this.userId}, {fields: {username: 1}}).username;
        //
        ////allow files only from bucket
        //if (!isValidUploadURL(username, url)) {
        //    url = '/no_avatar.png';
        //}

        Meteor.users.update(this.userId, {$set: {'profile.avatarUrl': url}});
    },

    setNotification: function(value) {
        check(value, Boolean);
        Meteor.users.update(this.userId, {$set: {'profile.notifications': value, 'profile.updatedAt': new Date()}});
    }
});