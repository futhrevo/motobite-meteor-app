import {ActionSheetIOS, Alert, Platform} from 'react-native';
import Meteor, { Accounts } from 'react-native-meteor';
import type { Action, ThunkAction } from './types';

async function _loginWithPassword(email: String, password: String) : Promise {
    return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(email, password, (error) => {
            console.log("login returned");
           if(error){
               reject(error);
           }else{
               resolve();
           }
        });
    });
}

async function _createUser(email: String, password: String) : Promise {
    return new Promise((resolve, reject) => {
        Accounts.createUser({email, password}, (error) => {
           if(error){
               reject(error);
           } else{
            //    await _buildLoginAction(email, password); // temp hack that you might need to use
               resolve();
           }
        });
    });
}

async function _changePassword(oldPass: String, newPass: String): Promise {
    return new Promise((resolve, reject) => {
        Accounts.changePassword(oldPass, newPass, (error) => {
            console.log("change password returned");
            if(error){
                reject(error);
            }else{
                resolve();
            }
        });
    });
}

async function _buildLoginAction(email: String, password: String): Promise<Array<Action>> {
    await _loginWithPassword(email, password);

    const action = {
        type: 'LOGGED_IN',
        data: {
            id: Meteor.userId(),
            name: Meteor.user().profile.name
        }
    }

    return Promise.all([Promise.resolve(action)]);
}

async function _createAccountAction(email: String, password: String) : Promise<Array<Action>> {
    await _createUser(email, password);

    const action = {
        type: 'LOGGED_IN',
        data: {
            id: Meteor.userId(),
            name: Meteor.user().profile.name
        }
    }

    return Promise.all([Promise.resolve(action) ]);
}

async function _changePasswordAction(oldPass: String, newPass: String): Promise<Array<Action>> {
    await _changePassword(oldPass , newPass);
    const action = {
        type: 'CHANGE_PASSWORD',
    }

    return Promise.all([Promise.resolve(action) ]);
}
function MeteorloginWithPassword(email: String, password: String): ThunkAction {
    return (dispatch) => {
        const login = _buildLoginAction(email, password);

        login.then(
            (result) => {
                dispatch(result);
            }
        );
        return login;
    };
}

function MeteorCreateUser(email: String, password: String): ThunkAction {
    return (dispatch) => {
        const create = _createAccountAction(email, password);

        create.then(
            (result) => {
                dispatch(result);
            }
        );
        return create;
    };
}

function MeteorChangePassword(oldPass: String, newPass: String): ThunkAction {
    return (dispatch) => {
        const change = _changePasswordAction(oldPass,newPass);

        change.then(
            (result) => {
                dispatch(result);
            }
        );
        return change;
    }
}
async function _logoutPromise(): Promise {
    return new Promise((resolve, reject) => {
        Meteor.logout((error) => {
            if(error){
                reject(error);
            }else{
                resolve();
            }
        });
    });
}
function logOut(): ThunkAction {
    return (dispatch) => {
        const logout = _logoutPromise();

        logout.then(
            () => {
                dispatch({
                    type: 'LOGGED_OUT'
                });
            }
        );
        return logout;
    }
}

function logOutWithPrompt(): ThunkAction {
  return (dispatch, getState) => {
      let name = getState().user.name || 'there';

      if (Platform.OS === 'ios') {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              title: `Hi, ${name}`,
              options: ['Log out', 'Cancel'],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 1,
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                dispatch(logOut());
              }
          }
        );
      }
      else{
          Alert.alert(
        `Hi, ${name}`,
        'Log out from MotoBite?',
        [
          { text: 'Cancel' },
          { text: 'Log out', onPress: () => dispatch(logOut()) },
        ]
      );
      }
  }}
module.exports = {MeteorloginWithPassword, MeteorCreateUser, MeteorChangePassword, logOut, logOutWithPrompt};
