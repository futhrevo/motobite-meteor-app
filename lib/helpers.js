/* global roomToUsers, createRoom, randomString, dataURItoBlob, isValidUploadURL */
/* exported roomToUsers, createRoom, randomString, dataURItoBlob, isValidUploadURL */
/**
 * Created by rakeshkalyankar on 15/07/15.
 */

//Helper functions that work on server and client
createRoom = function(id1, id2) {
    return id1 < id2 ? id1 + '-' + id2 : id2 + '-' +id1;
};

roomToUsers = function(room, userId1) {
    //return users[0] = userId1
    //return users[1] = userId2
    let users = [];

    const ids = room.split('-');

    if (ids[0] === userId1) {
        users[0] = ids[0];
        users[1] = ids[1];
    } else {
        users[0] = ids[1];
        users[1] = ids[0];
    }

    return users;
};

randomString = function(len) {
	const length = len || 10;
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
};

dataURItoBlob = function(dataURI) {
    let byteString; 
	let mimestring ;

	if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
		byteString = atob(dataURI.split(',')[1]);
	} else {
		byteString = decodeURI(dataURI.split(',')[1]);
	}

	mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

	let content = [];
	for (let i = 0; i < byteString.length; i++) {
		content[i] = byteString.charCodeAt(i);
	}

	return new Blob([new Uint8Array(content)], {type: mimestring});
}

isValidUploadURL = function(userid, uploadURL) {
	const validURL = Meteor.settings.public.gsBucketURL + '/users/' + userid;
	return uploadURL.lastIndexOf(validURL, 0) === 0; //starts with validURL
};