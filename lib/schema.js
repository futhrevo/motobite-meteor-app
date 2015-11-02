/* global Schema */
/* global SimpleSchema */
Schema = {};
Schema.group = new SimpleSchema({
	name: {
		type: String,
		label: "Group Name",
		max: 50,
		autoform: {
			'label-type': 'stacked'
		}
	},
	description: {
		type: String,
		label: "Description",
		max: 2000,
		autoform: {
			type: "textarea",
			'label-type': 'stacked'
		}
	},
	private: {
		type: Boolean,
		defaultValue: false,
		autoform: {
			type: 'toggle'
		}
	},
	url: {
		type: String,
    	optional: true,
    	autoform: {
			type: "url",
			'label-type': 'stacked'
    	}
	}
});