Template.layout.created = function(){
    $('body').attr('fullbleed', '');
    $('body').attr('vertical', '');
    $('body').attr('layout', '');

};
// Template.layout.rendered = function(){
//     $('#navheader').css('background-image', 'url(profile.jpg)');
// }

Template.layout.events({
    "click [data-action=toggle-drawer]" : function(){
        console.log("menu button clicked");
        $("#drawerPanel")[0].togglePanel();
    },

    "click [data-action=sign-out]" : function(){
        Meteor.logout();
        navigator.geolocation.clearWatch(wpid);
        gmap.markers = {};
        Router.go('/');
    },
});

Template.layout.helpers({
    userEmail : function(){
        if(Meteor.user() == null)
            return null
        else
            return Meteor.user().emails[0].address;
    },
    profEmail : function(){
        if(Meteor.user() == null)
            return null
        else
            return Meteor.user().profile.pic;
    }
});
