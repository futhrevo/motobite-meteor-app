

import React, { Component } from 'react';
import ListContainer from '../../common/ListContainer';

class MBChatsView extends Component {
  render() {
    return (
      <ListContainer
        title="Chats Screen"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
      />

    );
  }
}

export default MBChatsView;
