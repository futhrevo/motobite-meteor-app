// @flow
'use strict';

import React, {Component} from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import {connect} from 'react-redux';

import MBHeader from '../../common/MBHeader';
import MBColors from '../../common/MBColors';
import MBStyles from '../../common/MBStyles';
import MBAccountsForm from '../../common/MBAccountsForm';

import {create} from '../../common/MBStyleSheet';
import {CHANGE_PASSWORD} from '../../common/MBConstants';
import {MBFieldValidation} from '../../common/MBFieldValidation';
import {MeteorChangePassword} from '../../actions/login';

class PasswordScreen extends Component{
    props: {
        navigator: Navigator;
        dispatch: () => void;
        connected: boolean;
    };

    constructor(props){
        super(props);
        this.state={
            form:{
                  state: CHANGE_PASSWORD,
                  disabled: false,
                  error: null,
                  isValid: false,
                  isFetching: false,
                  fields: {
                    oldpassword: '',
                    oldpasswordHasError: false,
                    newpassword: '',
                    newpasswordHasError: false,
                    confirmpassword: '',
                    confirmpasswordHasError: false,
                  }
            },
            value:{
                oldpassword: '',
                newpassword: '',
                confirmpassword: '',
            }
        }
    }
    onChange(value){
        if(value.oldpassword != ''){
            if(MBFieldValidation('oldpassword', value.oldpassword)){
                this.state.form.fields.oldpasswordHasError = false;
            }else{
                this.state.form.fields.oldpasswordHasError = true;
            }
        }

        if(value.newpassword != ''){
            if(MBFieldValidation('newpassword', value.newpassword)){
                this.state.form.fields.newpasswordHasError = false;
            }else{
                this.state.form.fields.newpasswordHasError = true;
            }
        }

        if(value.confirmpassword != ''){
            if(!this.state.form.fields.newpasswordHasError &&
            value.confirmpassword == value.newpassword){
                this.state.form.fields.confirmpasswordHasError = false;
            }else{
                this.state.form.fields.confirmpasswordHasError = true;
            }
        }
        this.setState({value})
        this.validateForm();
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
                    title="Change Password"
                    leftItem={{
                        icon: require('../../common/img/back_white.png'),
                        title: 'Back',
                        layout: 'icon',
                        onPress: () => this.props.navigator.pop(),
                    }}
                />
                <View style={styles.inputs}>
                <MBAccountsForm formType={CHANGE_PASSWORD}
                    form={this.state.form}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    />

                    <TouchableHighlight
                        style={MBStyles.button} underlayColor='#99d9f4'
                        disabled={!this.state.form.isValid || this.state.form.isFetching}
                        onPress={this.changePassword.bind(this)}>
                      <Text style={MBStyles.buttonText}>Update your Password</Text>
                    </TouchableHighlight>
                </View>

            </View>
        );
    }
    validateForm(){
        if(this.state.value.oldpassword != ''
            && this.state.value.newpassword != ''
            && this.state.value.confirmpassword != ''
            && !this.state.form.fields.oldpasswordHasError
            && !this.state.form.fields.newpasswordHasError
            && !this.state.form.fields.confirmpasswordHasError){
                this.state.form.isValid = true;
        }else{
            this.state.form.isValid = false;
        }
    }
    async changePassword(){
        this.validateForm();
        if(this.state.form.isValid) {
            const {oldpassword,newpassword} = this.state.value;
            const {dispatch} = this.props;
            try{
                await Promise.race([dispatch(MeteorChangePassword(oldpassword, newpassword)),
                    timeout(15000)
                ]);
            }catch (e){
                const reason = e.reason || e;
                this.setState({error: reason});
                return;
            }
            this.props.navigator.pop();
        }
    }
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
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
      },
});
async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

function select(store){
    return{
        connected: store.updateMeteorData.status && store.updateMeteorData.status.connected,
    };
}

export default connect(select)(PasswordScreen);
