'use strict';

import React from 'react';

import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

function MBTouchableIOS(props: Object): ReactElement {
    return(
        <TouchableHighlight
          accessibilityTraits="button"
          underlayColor="#3C5EAE"
          {...props}
        />
    );
}

const MBTouchable = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : MBTouchableIOS;

export default MBTouchable;
