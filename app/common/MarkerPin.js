

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  style: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 21,
    backgroundColor: 'rgba(0,154,255,1)',
    height: 41,
  },
  nubStyle: {
    width: 3,
    height: 20,
    backgroundColor: 'rgba(0,154,255,1)',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 21,
    fontWeight: '300',
  },
});

class MarkerPin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.style, { backgroundColor: 'red' }]} onPress={this.props.onPress}>
          <Text style={styles.textStyle}>{this.props.text || ''}</Text>
        </View>
        <View style={[styles.nubStyle, { backgroundColor: 'red' }]} />
      </View>

    );
  }
}

export default MarkerPin;
