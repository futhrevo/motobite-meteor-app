/* global Schema */
/* global SimpleSchema */
Schema = {};
Schema.group = new SimpleSchema({
	name: {
		type: String,
		label: "Group Name",
		max: 50,
		min: 5,
		autoform: {
			'label-type': 'stacked',
			placeholder: "Enter Group name to create"
		}
	},
	id: {
		type:String,
		label: "Unique Id",
		regEx: /^[A-z][A-z0-9_]*/,
		max: 50,
		min: 5,
		autoform: {
			'label-type': 'stacked',
			placeholder: "starts with alphabet and can contain numbers"
		}
	},
	description: {
		type: String,
		label: "Description",
		max: 2000,
		min: 10,
		autoform: {
			type: "textarea",
			'label-type': 'stacked',
			placeholder: "Enter some description here"
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
		regEx: SimpleSchema.RegEx.Url,
        autoform: {
			type: "url",
			'label-type': 'stacked',
			placeholder: "Enter your group url (optional)"
        }
	}
});

Schema.group.messages({
	"regEx id": [{msg:"starts with alphabet and can contain numbers no spaces"}],
	"regEx url": [{msg: "starts with http or https, follwed by domain"}]
});