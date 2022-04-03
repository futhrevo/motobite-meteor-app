// @flow


import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 25;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + STATUS_BAR_HEIGHT : 56 + STATUS_BAR_HEIGHT;
const TOP = -69;
const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
  },
  innerStyle: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    //   flex: 1,  After upgrade to RN 36.0 unnecessary flex are working
  },
  style: {
    borderRadius: 21,
    backgroundColor: 'rgba(0,154,255,1)',
    left: 0,
    top: TOP,
    height: 41,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 21,
    fontWeight: '300',
  },
  nubStyle: {
    width: 3,
    height: 20,
    backgroundColor: 'rgba(0,154,255,1)',
    top: TOP,
    left: 0,
  },
});

class LocationPin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.screenStyle} pointerEvents={'box-none'}>
        <View style={styles.innerStyle}>
          <TouchableOpacity
            style={styles.style}
            onPress={this.props.onPress} activeOpacity={75 / 100}
          >
            <Text style={styles.textStyle}>{this.props.text || ''}</Text>
          </TouchableOpacity>
          <View style={styles.nubStyle} />
        </View>
      </View>
    );
  }
}


export default LocationPin;
