/* global Slingshot, randomString */
Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = Assets.getText('google-cloud-service-key.pem');
//avatarUploader
Slingshot.createDirective('avatarUploader', Slingshot.GoogleCloud, {
	bucket: Meteor.settings.gsBucket,
	GoogleAccessId: Meteor.settings.GoogleAccessId,
	acl: 'public-read',
	authorize: function() {
		if (!this.userId) {
			const message = 'Please login before posting file';
			throw new Meteor.Error('Login Required', message);
		}

		return true;
	},
	key: function(file) {
		//var user = Meteor.users.findOne(this.userId);
		const me = this.userId;
		const ext = file.type.split('/')[1];
		return 'users/' + me + '/avatar/' + randomString(20) + '.' + ext;
	},
	cacheControl: 'public, max-age=315360000'
});