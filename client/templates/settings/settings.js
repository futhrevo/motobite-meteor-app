Template.settings.onRendered(function(){
    if (IonPopover.hasOwnProperty("view")) {
        if (!IonPopover.view.isDestroyed) {
            IonPopover.hide();
        }
    }
    if(Meteor.user().settings.idleTracking){
        this.$('#inpTrackSel').val("true");
    }else{
        this.$('#inpTrackSel').val("false");
    }
});
Template.settings.events({
    'change #notif': function() {
        Meteor.call('setNotification', $('#notif').is(':checked'));
    },
    'change #inpTrackSel': function(event,template){
        let val = template.find('#inpTrackSel').value;
        Meteor.call('setIdleTracking', (val == "true"));
    }
});
 