/* global IonPopover */
Template.about.onRendered(function(){
    if (IonPopover.hasOwnProperty("view")) {
        if (!IonPopover.view.isDestroyed) {
            IonPopover.hide();
        }
    }
});
