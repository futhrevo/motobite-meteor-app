/* global IonPopup */
/* global IonModal */
/* global IonLoading */
/**
 * Created by rakeshkalyankar on 15/07/15.
 */
Template.searchContactModal.events({
    'click [data-action=search-contact]': function (event) {
        $('#user-data').hide();
        $('#no-user-error').hide();

        var searchId = $('input#search-id').val();

        if (searchId.length >= 5) {
            IonLoading.show();

            Meteor.call('searchUser', searchId, function(err, result) {
                if (result) {
                    IonLoading.hide();
                    $('#resultAvatarUrl').attr('src', result.profile.avatarUrl);
                    $('#resultDisplayName').text(result.profile.name);
                    $('#resultStatus').text(result.profile.status);
                    $('#to-id').val(result._id);
                    $('#user-data').show();
                } else {
                    $('#no-user-error').show();
                    IonLoading.hide();
                }
            });

        }else{
            toastr.warning("Please enter proper email");
        }
        return false;
    },

    'click [data-action=send-request]': function(event) {
        var toId = $('#to-id').val();

        Meteor.call('sendRequest', toId, function(err, result) {
            if (err) {
                IonPopup.show({
                    title: 'Result',
                    template: err,
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive',
                        onTap: function() {
                            IonPopup.close();
                            IonModal.close();
                        }
                    }]
                });
            } else {
                IonPopup.show({
                    title: 'Result',
                    template: result,
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive',
                        onTap: function() {
                            IonPopup.close();
                            IonModal.close();
                        }
                    }]
                });
            }
        });

    }
});

Template.searchContactModal.onDestroyed(function () {
	IonLoading.hide();
});