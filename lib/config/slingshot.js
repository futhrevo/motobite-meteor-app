/* global Slingshot */
Slingshot.fileRestrictions('avatarUploader', {
	allowedFileTypes: ['image/png', 'image/jpeg'],
	maxSize: 5 * 1024 * 1024
});

Slingshot.fileRestrictions('fileUploader', {
	allowedFileTypes: ['image/png', 'image/jpeg'],
	maxSize: 5 * 1024 * 1024
});