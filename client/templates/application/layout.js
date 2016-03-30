/* global Hammer */
/* global IonSideMenu */
Template.layout.onCreated(function () {
    var template = this;
    template.autorun(function(){

        template.subscribe('theMarkers');
        template.subscribe('theHouses');
        template.subscribe('theDrivers');
        template.subscribe('theDrives');
        template.subscribe('theLogs');
        template.subscribe('theRiderReqs');
        template.subscribe('myOwnGroups');
        template.subscribe('myGroups');

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
    });
});
Template.layout.onRendered(function () {
    if(typeof IonSideMenu.snapper !== 'undefined'){
        // IonSideMenu.snapper.disable();
        IonSideMenu.snapper.settings({
            tapToClose: true, // If true, tapping an open pane will close it
            flickThreshold: 50, // Number of pixels the user needs to swiftly travel to activate a "flick" open
            disable: 'right',
            maxPosition: 266,
            minPosition: -266,
            resistance: 0.5,
            transitionSpeed: 0.3,
            easing: 'ease',
            // touchToDrag: true,
            minDragDistance: 5
            
        });
        // $('#navheader').css('background-image', 'url(profile.jpg)');
        IonSideMenu.snapper.on('open', menuOpenBody);
        IonSideMenu.snapper.on('close', menuCloseBody);
    }    
});

Template.layout.events({
    "click [data-action=sign-out]" : function(){
        console.log("user wants to logout");
        Session.set('map',false);
        Session.set('lat',0);
        Session.set('lng',0);
        Meteor.logout();
        if (typeof wpid !== "undefined") {
            navigator.geolocation.clearWatch(wpid);
        }
        gmap.markers = {};
        Router.go('/');
    },

    "click .snap-drawer-left" : function(){
        menuClose();
    },

    "click .sidePic" : function(event){
        event.preventDefault();
        Router.go('/profile');
    }
});

Template.layout.helpers({
    countNotifications: function () {
        return TransactColl.find({$and: [{requestee: Meteor.userId()}, {status: null}]}).count();
    },
    templateGestures: {
        'swipeleft div': function (event, templateInstance) {
          /* `event` is the Hammer.js event object */
          console.log("Swipe right");
          menuClose();
          /* `templateInstance` is the `Blaze.TemplateInstance` */
          /* `this` is the data context of the element in your template, so in this case `someField` from `someArray` in the template */
        },
    },
    appReady: function(){
        return Template.instance().subscriptionsReady();
    }
});

function menuOpenBody() {
    console.log("Side Menu Open");
    $(document.body).on("click", menuClose);
    
}

function menuCloseBody() {
    console.log("Side Menu closed");
    $(document.body).off("click", menuClose);
}

function menuClose() {
    IonSideMenu.snapper.close();
}