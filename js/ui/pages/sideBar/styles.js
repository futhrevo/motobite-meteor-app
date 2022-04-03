const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  sidebar: {
    flex: 1,
    // padding: 10,
    paddingRight: 0,
    // paddingTop: 30,
    backgroundColor: '#fff',
  },
  drawerCover: {
    // alignSelf: 'stretch',
    height: deviceHeight / 3.5,
    width: null,
    position: 'relative',
    marginBottom: 10,
    backgroundColor: '#e5f3ec'
  },
  drawerImage: {
    position: 'absolute',
    // left: (Platform.OS === 'android') ? 30 : 40,
    left: (Platform.OS === 'android') ? deviceWidth / 10 : deviceWidth / 9,
    // top: (Platform.OS === 'android') ? 45 : 55,
    top: (Platform.OS === 'android') ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 100,
    resizeMode: 'contain',
  },
  text: {
    fontWeight: (Platform.OS === 'ios') ? '500' : '400',
    fontSize: 16,
    marginLeft: 20,
  },
  badgeText: {
    fontSize: (Platform.OS === 'ios') ? 13 : 11,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: (Platform.OS === 'android') ? -3 : undefined,
  },
};
