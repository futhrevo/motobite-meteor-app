'use strict';

import type {Action} from '../actions/types';

export type State = {
  isLoggedIn: boolean;
  id: ?string;
  name: ?string;
};

const initialState = {
  isLoggedIn: false,
  id: null,
  name: null,
  message: null,
};

function user(state: State = initialState, action: Action): State {
    if (action.type === 'LOGGED_IN') {
        let {id, name} = action.data;
        return{
            isLoggedIn: true,
            id,
            name,
        }
    }
    if (action.type === 'LOGGED_OUT') {
        return initialState;
    }
    if (action.type === 'CHANGE_PASSWORD'){
        return Object.assign({}, state, { message: "Password Changed Successfully"})
    }
    return state;
}

export default user;
