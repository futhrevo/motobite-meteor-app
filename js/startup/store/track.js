// @flow
import type { Action } from '../../imports/actions/types';

function track(action: Action): void {
  switch (action.type) {
    case 'LOGGED_IN':
      console.log('track : logged in');
      break;

    case 'LOGGED_OUT':
      console.log('track: logged out');
      break;
  }
}

export default track;
