
const React = require('react-native');

const { Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  container: {
    backgroundColor: '#e5f3ec',
    flex: 1,
    top:0
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  bg: {
    flex: 1,
    marginTop: deviceHeight / 1.75,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    bottom: 0,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  logoContainer: {
    marginTop: 10,
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  logo: {
    position: 'absolute',
    left: (Platform.OS === 'android') ? 40 : 50,
    top: (Platform.OS === 'android') ? 35 : 60,
    width: 280,
    height: 200,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'center',
  }
};
