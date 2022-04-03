'use strict';

import type { Action } from './types';

type Tab = 'home' | 'appointments'  | 'safeHouse' | 'myProfile' | 'contacts'| 'groups'| 'chats'| 'help';

module.exports = {
  switchTab: (tab: Tab): Action => ({
    type: 'SWITCH_TAB',
    tab,
  }),
};
