Template.groupModal.events({
	'click [data-action=search-group]': function (event) {
		$('#group-data').hide();
		$('#no-group-error').hide();
		var searchId = $('input#search-id').val();
		if (searchId.length >= 5) {
			IonLoading.show();
		} else {
			toastr.warning("Please enter proper group name");
		}
		return false;
	}
});

Template.groupModal.onDestroyed(function () {
	IonLoading.hide();
});