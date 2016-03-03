/* global AvatarOpsColl, isValidUploadURL */
// create collection for deleting task of photos on bucket
AvatarOpsColl = new Meteor.Collection('avatarOps');
Meteor.methods({
	changeAvatar: function(url) {
        check(url, String);

        if (!this.userId) {
            return false;
        }

        const me = this.userId;
        //allow files only from bucket
        if (!isValidUploadURL(me, url)) {
           url = '/no_avatar.png';
        }
        const oldUrl = Meteor.users.findOne({_id:me},{fields:{"profile.avatarUrl":1}}).profile.avatarUrl;
        if(oldUrl !== '/no_avatar.png'){
            addOps(oldUrl);   
        }
        Meteor.users.update(this.userId, {$set: {'profile.avatarUrl': url}});
    }
});

const addOps = function(url){
    // var docField = new Date().toDateString().replace(/\s+/g, '');
    AvatarOpsColl.update({_id:"deleteOps1"},{$push:{ops: url}});
}