// @flow
export type Action =
      {type: 'LOGGED_IN', isLoggedIn: boolean, id: ?string, name: ?string}
    | {type: 'LOGGED_OUT'}
    | {type: 'CHANGE_PASSWORD'}
    | {type: 'SWITCH_TAB', tab: 'home' | 'appointments'  | 'safeHouse' | 'myProfile' | 'contacts' | 'groups' | 'chats' | 'help'}
    | {type: 'UPDATE_METEOR_DATA', user: ?Object, status: ?Object, loggingIn: ?boolean}
    | { type: 'UPDATE_ONESIGNAL_DATA', oneUserId: string }
    | { type: 'PUSH_NEW_ROUTE', route: string }
    | { type: 'POP_ROUTE' }
    | { type: 'POP_TO_ROUTE', route: string }
    | { type: 'REPLACE_ROUTE', route: string }
    | { type: 'REPLACE_OR_PUSH_ROUTE', route: string }
    | { type: 'OPEN_DRAWER'}
    | { type: 'CLOSE_DRAWER' }
    | { type: 'SET_USER', name: string}
  | { type: 'SET_LIST', list: string }
  | { type: 'UPDATE_SERVER_STATUS', status: ?Object, loggingIn: ?boolean}
    ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
