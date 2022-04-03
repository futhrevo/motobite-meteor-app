// @flow
'use strict';

export type Action =
      {type: 'LOGGED_IN', isLoggedIn: boolean, id: ?string, name: ?string}
    | {type: 'LOGGED_OUT'}
    | {type: 'CHANGE_PASSWORD'}
    | {type: 'SWITCH_TAB', tab: 'home' | 'appointments'  | 'safeHouse' | 'myProfile' | 'contacts'| 'groups'| 'chats'| 'help'}
    | {type: 'UPDATE_METEOR_DATA', user:?Object, status:?Object, loggingIn:?boolean}
    | {type: 'UPDATE_ONESIGNAL_DATA', oneUserId: string}
    ;

    export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
    export type GetState = () => Object;
    export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
    export type PromiseAction = Promise<Action>;
