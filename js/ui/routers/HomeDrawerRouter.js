import React, { Component } from 'react';
import { DrawerNavigator } from 'react-navigation';

import Home from '../pages/home';
import BlankPage from '../pages/blankPage';
import DrawBar from '../components/DrawBar';

export default (DrawNav = DrawerNavigator(
  {
    Home: { screen: Home },
    BlankPage2: { screen: BlankPage }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
));
