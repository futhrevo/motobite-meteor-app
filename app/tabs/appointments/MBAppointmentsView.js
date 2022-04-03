

import React, { Component } from 'react';
import { Tabs, Tab, Icon } from 'react-native-elements';

import ListContainer from '../../common/ListContainer';
import InflateReq from './InflateReq';
import InflateDrives from './InflateDrives';
import InflateDrivers from './InflateDrivers';

class MBAppointmentsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'requests',
      title: 'Requests',
    };
  }
  changeTab(selectedTab) {
    this.setState({ selectedTab });
    switch (selectedTab) {
      case 'requests':
        this.setState({ title: 'Requests' });
        break;
      case 'rides':
        this.setState({ title: 'Scheduled Rides' });
        break;
      case 'riders':
        this.setState({ title: 'Scheduled Riders' });
        break;
      default:
        break;
    }
  }
  render() {
    const { selectedTab } = this.state;
    return (
      <ListContainer
        title={this.state.title}
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
      >
        <Tabs>
          <Tab
                    // tabStyle={selectedTab !== 'home' && { styles.tabSelectedstyle }}
                    // titleStyle={[styles.titleStyle]}
                    // selectedTitleStyle={[styles.titleSelected]}
            selected={selectedTab === 'requests'}
            title={selectedTab === 'requests' ? 'Requests' : null}
            renderIcon={() => <Icon name="md-filing" size={26} type="ionicon" />}
            renderSelectedIcon={() => <Icon name="md-filing" size={26} type="ionicon" />}
            onPress={() => this.changeTab('requests')}
          >
            <InflateReq />
          </Tab>
          <Tab
                    // tabStyle={selectedTab !== 'about' && { styles.tabSelectedstyle }}
                    // titleStyle={[styles.titleStyle]}
                    // selectedTitleStyle={[styles.titleSelected]}
            selected={selectedTab === 'rides'}
            title={selectedTab === 'rides' ? 'Scheduled Rides' : null}
            renderIcon={() => <Icon name="md-car" size={26} type="ionicon" />}
            renderSelectedIcon={() => <Icon name="md-car" size={26} type="ionicon" />}
            onPress={() => this.changeTab('rides')}
          >
            <InflateDrivers />
          </Tab>
          <Tab
                    // tabStyle={selectedTab !== 'about' && { styles.tabSelectedstyle }}
                    // titleStyle={[styles.titleStyle]}
                    // selectedTitleStyle={[styles.titleSelected]}
            selected={selectedTab === 'riders'}
            title={selectedTab === 'riders' ? 'Scheduled Riders' : null}
            renderIcon={() => <Icon name="md-person" size={26} type="ionicon" />}
            renderSelectedIcon={() => <Icon name="md-person" size={26} type="ionicon" />}
            onPress={() => this.changeTab('riders')}
          >
            <InflateDrives />
          </Tab>
        </Tabs>
      </ListContainer>

    );
  }
}

export default MBAppointmentsView;
