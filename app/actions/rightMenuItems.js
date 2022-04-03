'use strict';
import {Alert} from 'react-native';
import type { Action, ThunkAction } from './types';
import {logOutWithPrompt} from './login';

function testRightMenu(){
    Alert.alert(
            'RIGHT_MENU',
            'Right menu Msg'
        )
}

function sendLogoutAction(): ThunkAction{
    return (dispatch) => {
        dispatch(logOutWithPrompt());
    }
}
const RIGHT_MENU = {
    'Settings': testRightMenu,
    'About': testRightMenu,
    'Sign Out': sendLogoutAction,
};

module.exports = {RIGHT_MENU}
