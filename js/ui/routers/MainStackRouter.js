import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Login from '../pages/login';
import Home from '../pages/home';
import BlankPage from '../pages/blankPage';
import HomeDrawerRouter from './HomeDrawerRouter';


HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});

export default (StackNav = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  BlankPage: { screen: BlankPage }
}));
