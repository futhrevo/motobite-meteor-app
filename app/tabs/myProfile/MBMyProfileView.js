'use strict';

import React, {Component} from 'react';
import {Platform, Text, ToastAndroid, View } from 'react-native';
import {connect} from 'react-redux';
import { List, ListItem } from 'react-native-elements';

import ListContainer from '../../common/ListContainer';

class MBMyProfileView extends Component{
    props: {
        navigator: Navigator;
        dispatch: () => void;
        user: object;
        connected: boolean;
    };
    constructor(props) {
       super(props);
       this.state = {

        };
     }
    render(){
      console.log(this.props);
        return(
            <ListContainer title="Profile"
                backgroundImage={require('./img/schedule-background.png')}
                backgroundColor={'#47BFBF'}>
                <List >
                    <ListItem
                        title={"Admin"}
                        subtitle={"Display Name"}
                      />
                      <ListItem
                        leftIcon={{name:"md-mail", type:"ionicon"}}
                        rightIcon={{name:"warning", color:"red"}}
                        title={"example@xyz.com"}
                        onPress={() => {ToastAndroid.show('Verify Email', ToastAndroid.SHORT)}}/>

                        <ListItem
                          leftIcon={{name:"md-briefcase", type:"ionicon"}}
                          // rightIcon={{name:"warning"}}
                          title={"workexample@xyz.com"}
                          onPress={() => {ToastAndroid.show('Verify work Email', ToastAndroid.SHORT)}}/>
                        <ListItem
                            leftIcon={{name:"md-call", type:"ionicon"}}
                            // rightIcon={{name:"warning"}}
                            title={"9999999999"}
                            onPress={() => {ToastAndroid.show('Verify phone number', ToastAndroid.SHORT)}}/>
                        <ListItem
                                // leftIcon={{name:"md-log-out", type:"ionicon"}}
                                // rightIcon={{name:"warning"}}
                                title={"Sign Out"}
                                onPress={() => {ToastAndroid.show('Verify phone number', ToastAndroid.SHORT)}}/>
                  </List>
                </ListContainer>
        );
    }
}

function select(store){
    return{
        user: store.updateMeteorData.user ,
        connected: store.updateMeteorData.status && store.updateMeteorData.status.connected,
    };
}
export default connect(select)(MBMyProfileView);
