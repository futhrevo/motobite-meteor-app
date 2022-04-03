import React from 'react';
import { AsyncStorage } from 'react-native';
import { AccessToken } from 'react-native-fbsdk';
import Meteor from 'react-native-meteor';

const USER_TOKEN_KEY = 'reactnativemeteor_usertoken';

export const loginWithTokens = () => {
  const Data = Meteor.getData();
  AccessToken.getCurrentAccessToken()
    .then((res) => {
      if (res) {
        console.log(res);
        Meteor.call('login', { facebook: res }, (err, result) => {
          if (!err) { // save user id and token
            AsyncStorage.setItem(USER_TOKEN_KEY, result.token);
            Data._tokenIdSaved = result.token;
            Meteor._userIdSaved = result.id;
          }
        });
      }
    });
};

export const onLoginFinished = (error, result) => {
  if (error) {
    console.log('login error', error);
  } else if (result.isCancelled) {
    console.log('login cancelled');
  } else {
    console.log('login with token');
    console.log(result);

    loginWithTokens();
  }
};
