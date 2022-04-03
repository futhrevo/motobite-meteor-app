
import React, { Component } from 'react';
import ListContainer from '../../common/ListContainer';

class MBSafeHouseView extends Component {
  render() {
    return (
      <ListContainer
        title="Safe House Screen"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
      />
    );
  }
}

export default MBSafeHouseView;
