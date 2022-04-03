import { Meteor } from 'meteor/meteor';
// Helper functions that work on server and client
function createRoom(id1, id2) {
  return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
}

function roomToUsers(room, userId1) {
    // return users[0] = userId1
    // return users[1] = userId2
  const users = [];

  const ids = room.split('-');

  if (ids[0] === userId1) {
    users[0] = ids[0];
    users[1] = ids[1];
  } else {
    users[0] = ids[1];
    users[1] = ids[0];
  }

  return users;
}

function randomString(len) {
  const length = len || 10;
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

function dataURItoBlob(dataURI) {
  let byteString;

  if (dataURI.split(',')[0].indexOf('base64') !== -1) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = decodeURI(dataURI.split(',')[1]);
  }

  const mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const content = [];
  for (let i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i);
  }

  return new Blob([new Uint8Array(content)], { type: mimestring });
}

function isValidUploadURL(userid, uploadURL) {
  const validURL = `${Meteor.settings.public.gsBucketURL}/users/${userid}`;
  return uploadURL.lastIndexOf(validURL, 0) === 0; // starts with validURL
}

export { createRoom, roomToUsers, randomString, dataURItoBlob, isValidUploadURL };
