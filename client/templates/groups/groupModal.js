var searchRes = new ReactiveArray();
Template.groupModal.helpers({
	names: function () {
		return searchRes.list();
	}
});
Template.groupModal.events({
	'click [data-action=search-group]': function (event) {
		$('#group-data').hide();
		$('#no-group-error').hide();
		searchRes.clear();
		var searchId = $('input#search-id').val();
		if (searchId.length >= 5) {
			IonLoading.show();
			Meteor.call('searchGroup', searchId, 0, function (err, result) {
				IonLoading.hide();
				if (result) {
					_.each(result, function (obj) {
						searchRes.push(obj);
					 });				
				} else {
					$('#no-group-error').show();
				}
			
			});
		} else {
			toastr.warning("Please enter proper group name");
		}
		return false;
	},
	'click .btnAdd': function (event) {
		event.preventDefault();
		Meteor.call('addGroup', this._id, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
					if (result.type == "success") {
						IonModal.close();
					 }
				}			
			});
	}
});

Template.groupModal.onDestroyed(function () {
	IonLoading.hide();
	searchRes.clear();
});