var uploader = new ReactiveVar(); //for progress

Template.changeAvatar.onRendered(function () {
	avatarCrop = new CROP();
	currentZoom = 1;
});
 
Template.changeAvatar.helpers({
	progress: function () {
		var upload = uploader.get(); //get avatarUploader
		if (upload)
			return (Math.round(upload.progress() * 100) || 0) + '%';
	}
	
});

Template.changeAvatar.events({
	'click [data-action=take-photo]': function () {
		var options = {  
 			width: 256,
 			height: 256,
 			quality: 100
		};
		MeteorCamera.getPicture(options, function (err, daraURI) {
			if (err) {
 				IonPopup.alert({
					title: 'No photo',
					template: 'Avatar image was not selected',
					okText: 'OK',
					okType: 'button-assertive'
				});
 			} else {
 				$('.avatar-actions').hide();
 				$('.avatar-options').show();

 				avatarCrop.init({
 					container: '.avatar-crop',
 					image: dataURI,
 					width: 256,
 					height: 256,
 					mask: false,
 					zoom: {
 						steps: 0.01,
 						min: 1,
 						max: 5
 					}
 				});
 			}
		 });
	},
	'click [data-action=browse-gallery]': function() {
 		var options = {  
 			width: 256,
 			height: 256,
 			quality: 100,
 			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
 		};

 		MeteorCamera.getPicture(options, function(err, dataURI){
 			if (err) {
 				IonPopup.alert({
					title: 'No photo',
					template: 'Avatar image was not selected',
					okText: 'OK',
					okType: 'button-assertive'
				});
 			} else {
 				$('.avatar-actions').hide();
 				$('.avatar-options').show();

 				avatarCrop.init({
 					container: '.avatar-crop',
 					image: dataURI,
 					width: 256,
 					height: 256,
 					mask: false,
 					zoom: {
 						steps: 0.01,
 						min: 1,
 						max: 5
 					}
 				});
 			}
 		});
 	},
});
