/**
 * Created by reku on 18/4/16.
 */
Template.app.onCreated(function () {
    var template = this;
    template.autorun(function () {
        template.subscribe('theMarkers');
        template.subscribe('theHouses');
        template.subscribe('theDrivers');
        template.subscribe('theDrives');
        template.subscribe('theLogs');
        template.subscribe('theRiderReqs');
        template.subscribe('myOwnGroups');
        template.subscribe('myGroups');

        if(Meteor.userId() && Meteor.user().hasOwnProperty('profile')){
            let friendIds = _.map(Meteor.user().profile.friends, function (f) {
                return f._id;
            });

            _.map(friendIds, function(fId) {
                template.subscribe('recentChats', fId);
            });

            template.subscribe('friends', friendIds);

            //subscriptions for tabs
            let toIds = _.map(TransactColl.find({requestee:Meteor.user()}).fetch(), function (f) {
                return f.requester;
            });
            let fromIds = _.map(TransactColl.find({requester:Meteor.user()}).fetch(), function (f) {
                return f.requestee;
            });
            let userIds = _.union(fromIds,toIds);
            template.subscribe('acquaintance', userIds);
        }
    });
});

Template.app.helpers({
    appReady: function(){
        return Template.instance().subscriptionsReady();
    }
});