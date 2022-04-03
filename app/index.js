// 'use strict';
//
// import React, {Component} from 'react';
// import {Text, View } from 'react-native';
// import Meteor, { connectMeteor } from 'react-native-meteor';
// import { loginWithTokens } from './fb-login';
// import { Actions, Scene, Router } from 'react-native-router-flux';
// import { meteorSwitch } from 'react-native-meteor-router-flux';
//
// import SignIn from './SignIn';
// import SignOut from './SignOut';
// import Loading from './Loading';
// import Home from './Home';
// import HomeTab from './HomeTab';
//
// @connectMeteor
// class App extends Component{
//     componentWillMount(){
//         // const url = 'http://192.168.2.12:3000/websocket';
//         const url = 'http://app.motobite.in/websocket';
//         Meteor.connect(url);
//         loginWithTokens();
//     };
//
//     constructor(props) {
//         super(props);
//         this.data = {};
//     }
//
//     render(){
//         const getMeteorData = () => {
//           return {
//             connected: Meteor.status().connected,
//             user: Meteor.user(),
//             loggingIn: Meteor.loggingIn(),
//           }
//         };
//
//         const selector = (data, props) => {
//           if(!data.connected || data.loggingIn || !data.user) { return 'login'; }
//         //   else if (!data.user) { return "login"; }
//           else { return "loggedIn"; }
//         };
//         const scenes = Actions.create(
//             <Scene key="root" component={meteorSwitch(getMeteorData)} selector={selector}>
//                <Scene key="login" component={SignIn} title="Login" hideNavBar={true} />
//                <Scene key="loading" component={Loading} title="Loading" hideNavBar={true} />
//                <Scene key="loggedIn" tabs={true}>
//                  <Scene key="home" component={Home} title="Home" hideNavBar={true} >
//                     <Scene key="hometab" component={HomeTab} hideNavBar={true} />
//                  </Scene>
//                </Scene>
//          </Scene>
//         );
//
//         return (
//             <Router scenes={scenes} />
//         );
//     }
// }
//
// export default App;
