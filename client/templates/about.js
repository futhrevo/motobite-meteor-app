/* global IonPopover */
Template.about.onRendered(function(){
    if (!IonPopover.view.isDestroyed) {
        IonPopover.hide();
    }
});
