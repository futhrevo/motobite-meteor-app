
import Meteor from 'react-native-meteor';

async function mmSetNotification(checked: boolean) : Promise {
    return new Promise((resolve, reject) => {
        Meteor.call('setNotification', checked, (error, result) => {
           if(error){
               reject(error);
           }else{
               resolve();
           }
        });
    });
}

async function mmSetIdleTracking(checked: boolean) : Promise {
    return new Promise((resolve, reject) => {
        Meteor.call('setIdleTracking', checked, (error, result) => {
           if(error){
               reject(error);
           }else{
               resolve();
           }
        });
    });
}

async function mmSetPushTokenId(tokenId: string) : Promose {
  return new Promise((resolve, reject) => {
    Meteor.call('setPushUserId', tokenId, (error, result) => {
      if(error){
          reject(error);
      }else{
          resolve();
      }
    });
  });
}
module.exports = {mmSetNotification, mmSetIdleTracking, mmSetPushTokenId}
