

import React, { Component } from 'react';
import ListContainer from '../../common/ListContainer';

class MBHelpView extends Component {
  render() {
    return (
      <ListContainer
        title="Help Screen"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
      />
    );
  }
}

export default MBHelpView;
