'use strict';

import React, {Component} from 'react';
import {Modal, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements'

import {create} from '../../common/MBStyleSheet';
import ListContainer from '../../common/ListContainer';

class MBContactsView extends Component{
  constructor(props: Props) {
      super(props);
      this.state = {
        modalVisible: false
      };
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  componentWillMount() {
      // https://github.com/facebook/react-native/issues/1403 prevents this to work for initial load
      Icon.getImageSource('md-person-add', 30, 'white').then((source) => this.setState({ rightIcon: source }));
    }
    render(){
      let rightItem={
          title: 'Add',
          layout: 'icon',
          icon: this.state.rightIcon,
          onPress: () => this.setModalVisible(true)
      }
        return(
          <View style={{flex: 1}}>
                <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {this.setModalVisible(false)}}
              >
                <View style={styles.headerContainer}>
                  <Text style={styles.headerTitle}>Search By Email Id</Text>
                  <Icon style={styles.headerClose} name="md-close"  color="white" size={30} onPress={() => {this.setModalVisible(false)}} />
                </View>
                <View style={styles.searchContainer}>
                  <SearchBar
                  lightTheme
                  // onChangeText={someMethod}
                  placeholder='Type Here...' />
                  
                </View>

              </Modal>
          <ListContainer title="Contacts"
              backgroundImage={require('./img/schedule-background.png')}
              backgroundColor={'#47BFBF'}
              rightItem={rightItem}
              >

              </ListContainer>

                </View>
        );
    }
}
const styles = create({
    container: {
        flex: 1,
    },
    headerContainer: {
        backgroundColor: '#47BFBF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        android:{
            elevation: 2,
        }
    },
    headerTitle:{
      color: 'white',
      fontSize: 18,
      margin: 12,

    },
    headerClose:{
      margin: 12
    },
    searchContainer: {
      // flexDirection: 'row',
    },
    searchTitle:{
      fontSize: 18,
      margin: 12,
    }
});
export default MBContactsView;
