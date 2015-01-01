Template.layout.created = function(){
    $('body').attr('fullbleed', '');
    $('body').attr('vertical', '');
    $('body').attr('layout', '');
};

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
