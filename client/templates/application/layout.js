Template.layout.created = function(){

    // $('body').attr('fullbleed', '');
    // $('body').attr('vertical', '');
    // $('body').attr('layout', '');

};
Template.layout.rendered = function(){
    IonSideMenu.snapper.disable();
    IonSideMenu.snapper.settings({
        tapToClose: true, // If true, tapping an open pane will close it
        flickThreshold: 150, // Number of pixels the user needs to swiftly travel to activate a "flick" open
        hyperextensible:true
    });
    // $('#navheader').css('background-image', 'url(profile.jpg)');
};

Template.layout.events({
    "click [data-action=sign-out]" : function(){
        Meteor.logout();
        navigator.geolocation.clearWatch(wpid);
        gmap.markers = {};
        Router.go('/');
    },

    "click .snap-drawer-left" : function(){
        IonSideMenu.snapper.close();
    }
});

Template.layout.helpers({
    userEmail : function(){
        if(Meteor.user() === null)
            return null;
        else
            return Meteor.user().emails[0].address;
    },
    profEmail : function(){
      //TODO add interface to add profile pic property to each user
        if(Meteor.user() === null)
            return null;
        else if(Meteor.user().profile.pic)
            return Meteor.user().profile.pic;
        else
            return "scgPic.svg";

    }
});
