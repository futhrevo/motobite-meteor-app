/* global IonPopover */
Template.about.onRendered(() => {
    if (IonPopover.hasOwnProperty("view")) {
        if (!IonPopover.view.isDestroyed) {
            IonPopover.hide();
        }
    }
});
