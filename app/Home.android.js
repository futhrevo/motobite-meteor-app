
import React, { Component } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import HomeView from './HomeView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
        />
        <HomeView />
      </View>
    );
  }
}

export default Home;
