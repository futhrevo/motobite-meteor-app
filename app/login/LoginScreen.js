'use strict';

import React, {Component} from 'react';
import {Animated, Dimensions, Image, StatusBar, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import {MeteorloginWithPassword, MeteorCreateUser} from '../actions/login';

const { width } = Dimensions.get('window');

class LoginScreen extends Component{
    props:{
        dispatch: (action: any) => Promise;
    }
    state:{
        email: ?string;
        password: ?string;
        error: ?string;
    }
    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
          error: null, // added this
        };
      }
    isValid(){
        const { email, password} = this.state;
        let valid = false;

        if(email.length>0 && password.length > 0){
            valid=true;
            this.setState({error: ''})
        }

        if(email.length === 0){
            this.setState({ error: 'You must enter an email address' });

        } else if(password.length === 0){
            this.setState({ error: 'You must enter a password' });

        }
        return valid;
    }
    async onSignIn(){
        const {email, password} = this.state;

        if(this.isValid()){
            console.log("credentials are valid");
            const {dispatch} = this.props;
            try{
                await Promise.race([dispatch(MeteorloginWithPassword(email, password)),
                    timeout(15000)
                ]);
            } catch (e){
                const reason = e.reason || e;
                this.setState({error: reason})
            }
            // Meteor.loginWithPassword(email, password, (error) => {
            //     console.log("login returned");
            //    if(error){
            //        this.setState({error: error.reason})
            //    }
            // });
        }
    }
    async onCreateAccount(){
        const {email, password} = this.state;
        if(this.isValid()){
            // Accounts.createUser({email, password}, (error) => {
            //    if(error){
            //        this.setState({error: error.reason})
            //    } else{
            //        this.onSignIn(); // temp hack that you might need to use
            //    }
            // });
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(email) => this.setState({email})}
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    onChangeText={(password) => this.setState({password})}
                    placeholder="Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />

                <Text style={styles.error}>{this.state.error}</Text>

                <TouchableOpacity style={styles.button} onPress={this.onSignIn.bind(this)}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.onCreateAccount.bind(this)}>
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                {/*<LoginButton
                     publishPermissions={["publish_actions"]}
                     onLoginFinished={onLoginFinished}
                     onLogoutFinished={() => alert("logout.")}/>*/}
            </View>
        );
    }
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

const ELEMENT_WIDTH = width - 40;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    input: {
      width: ELEMENT_WIDTH,
      fontSize: 16,
      height: 36,
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderColor: '#888888',
      borderWidth: 1,
      marginHorizontal: 20,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#3B5998',
      width: ELEMENT_WIDTH,
      padding: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});

export default connect()(LoginScreen);
