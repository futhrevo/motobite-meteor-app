/* global IonPopup */
/* global Template */
/* global toastr */

Template.profileTemplate.onRendered(function(){
    // IonSideMenu.snapper.close();
    $('.popup-image').magnificPopup({type:'image'});
});


Template.profileTemplate.helpers({
    checked: function (value) {
        return value === true ? 'checked' : '';
    },
});

Template.profileTemplate.events({
    'click [data-action=edit-displayName]': function () {
        var oldName = $('#display-name').text();
        oldName = $('<i>' + oldName + '</i>').text();

        IonPopup.prompt({
            title: 'Display name',
            template: 'Maximum 40 characters',
            okText: 'Update',
            inputType: 'text',
            inputPlaceholder: oldName,
            onOk: function(evt, displayName) {
                displayName = displayName.trim();
                if(nonEmptyString(displayName)) {
                    Meteor.call('setDisplayName', displayName);
                }
                else{
                    toastr.warning("Please enter name with 5 letters or more");
                }

            }
        });
    },

    'click [data-action=compose-status]': function () {
        var oldStatus = $('#status').text();
        oldStatus = $('<i>' + oldStatus + '</i>').text();

        IonPopup.prompt({
            title: 'Compose status',
            template: 'Maximum 80 characters',
            okText: 'Update',
            inputType: 'text',
            inputPlaceholder: oldStatus,
            onOk: function(evt, status) {
                Meteor.call('setStatus', status);
            }
        });
    }


});

var nonEmptyString = function(name){
    if(typeof name === 'string'){
        return (name.length > 4 && name.length <41);
    }
    else{
        return false;
    }
};
