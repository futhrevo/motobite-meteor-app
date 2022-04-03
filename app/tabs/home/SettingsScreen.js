'use strict';

import React, {Component} from 'react';
import { Navigator, Picker, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View,  } from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import MBColors from '../../common/MBColors';
import MBHeader from '../../common/MBHeader';
import MBStyles from '../../common/MBStyles';
import {create} from '../../common/MBStyleSheet';
import {mmSetNotification, mmSetIdleTracking} from '../../actions/meteorMethods';



class SettingsScreen extends Component{
    props: {
        navigator: Navigator;
        dispatch: () => void;
        notif: boolean;
        inpTrackSel: boolean;
        connected: boolean;
    };

    constructor(props) {
       super(props);
       this.state = {
           editable: true,
           focusPicker: false,
           tracking: '0',
           notify: true,

        };
     }
    componentWillMount(){
        this.setState({notify: this.props.notif});
    }
    componentWillUnmount(){
        if(this.state.notify != this.props.notif){
            mmSetNotification(this.state.notify);
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <StatusBar
                  translucent={true}
                  backgroundColor="rgba(0, 0, 0, 0.2)"
                  barStyle="default"
                 />
                <MBHeader
                    style={styles.header}
                    foreground="white"
                    title="Settings"
                    leftItem={{
                        icon: require('../../common/img/back_white.png'),
                        title: 'Back',
                        layout: 'icon',
                        onPress: () => this.props.navigator.pop(),
                      }}
                />

                <ScrollView pointerEvents="box-none" contentInset={{top: 0}} scrollEventThrottle={200}>
                    <Text style={MBStyles.categoryLabel}>General</Text>
                    <View style={MBStyles.row}>
                        <Text style={MBStyles.rowLabel}>Push Notifications</Text>
                        <Switch onValueChange={(val) => this.setState({notify: val})}
                            style={MBStyles.rowInput}
                            disabled={! this.props.connected}
                            value={this.state.notify}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {this.openPasswordScreen()}}>
                    <View style={MBStyles.lastRow}>
                        <Text style={MBStyles.rowLabel}>Change Password</Text>
                        <Icon style={MBStyles.rowInput} name="md-lock" size={20} color="#4F8EF7"  />
                    </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }

    // toggleNotifications(val: boolean){
    //     this.setState({notify: val});
    // }
    // toggleTracking(val: boolean){
    //     const original = this.state.tracking;
    //     this.setState({tracking: val});
    //     let checked;
    //     checked = val == '0'? true : false;
    //     // mmSetIdleTracking(checked).catch(() => this.setState({tracking: original}));
    // }
    openPasswordScreen(){
        this.props.navigator.push({passwordScreen: true});
    }
}

function select(store){
    return{
        notif: store.updateMeteorData.user && store.updateMeteorData.user.profile.notifications,
        inpTrackSel: store.updateMeteorData.user && store.updateMeteorData.user.settings && store.updateMeteorData.user.settings.idleTracking,
        connected: store.updateMeteorData.status && store.updateMeteorData.status.connected,
    };
}
const styles = create({
    container: {
        flex: 1,
        backgroundColor: MBColors.screenBackground,
    },
    header: {
        backgroundColor: '#47BFBF',
        android:{
            elevation: 2,
        }
    },
});

export default connect(select)(SettingsScreen);
