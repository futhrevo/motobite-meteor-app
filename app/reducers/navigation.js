'use strict';

import type {Action} from '../actions/types';

export type Tab =
    'home'
    | 'appointments'
    | 'safeHouse'
    | 'myProfile'
    | 'contacts'
    | 'groups'
    | 'chats'
    | 'help'
    ;

const initialState: State = { tab: 'home'};

type State = {
  tab: Tab;
};

function navigation(state: State = initialState, action: Action): State {
  if (action.type === 'SWITCH_TAB') {
    return {...state, tab: action.tab};
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

export default navigation;
