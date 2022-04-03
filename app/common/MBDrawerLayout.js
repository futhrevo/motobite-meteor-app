'use strict';

import React, {Component} from 'react';
import { BackAndroid, DrawerLayoutAndroid } from 'react-native';

class MBDrawerLayout extends Component {
    _drawer: ?DrawerLayoutAndroid;

    constructor(props: any, context:any) {
        super(props, context);

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.onDrawerOpen = this.onDrawerOpen.bind(this);
        this.onDrawerClose = this.onDrawerClose.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    render() {
        const {drawerPosition, ...props} = this.props;
        const {Right, Left} = DrawerLayoutAndroid.positions;
        return (
          <DrawerLayoutAndroid
            ref={(drawer) => this._drawer = drawer}
            {...props}
            drawerPosition={drawerPosition === 'right' ? Right : Left}
            onDrawerOpen={this.onDrawerOpen}
            onDrawerClose={this.onDrawerClose}
          />
        );
  }

  handleBackButton(): boolean {
    this.closeDrawer();
    return true;
  }

  componentWillUnmount() {
    // this.context.removeBackButtonListener(this.handleBackButton);
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    this._drawer = null;
  }

  onDrawerOpen() {
    // this.context.addBackButtonListener(this.handleBackButton);
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  }

  onDrawerClose() {
    // this.context.removeBackButtonListener(this.handleBackButton);
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.props.onDrawerClose && this.props.onDrawerClose();
  }

  closeDrawer() {
    this._drawer && this._drawer.closeDrawer();
  }

  openDrawer() {
    this._drawer && this._drawer.openDrawer();
  }
}

MBDrawerLayout.contextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
};

export default MBDrawerLayout;
