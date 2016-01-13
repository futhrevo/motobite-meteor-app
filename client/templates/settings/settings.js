Template.settings.onRendered(function(){
    if (IonPopover.hasOwnProperty("view")) {
        if (!IonPopover.view.isDestroyed) {
            IonPopover.hide();
        }
    }
});

Template.settings.events({
    'change #notif': function() {
        Meteor.call('setNotification', $('#notif').is(':checked'));
    }
});
