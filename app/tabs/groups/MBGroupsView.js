

import React, { Component } from 'react';
import ListContainer from '../../common/ListContainer';

class MBGroupsView extends Component {
  render() {
    return (
      <ListContainer
        title="Groups Screen"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
      />
    );
  }
}

export default MBGroupsView;
