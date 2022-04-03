

import { Dimensions, PixelRatio, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const ELEMENT_WIDTH = width - 40;
const MBStyles = StyleSheet.create({
  categoryLabel: {
    fontSize: 15,
    textAlign: 'left',
    left: 10,
    padding: 10,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 0,
        // padding:0,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    padding: 10,
    alignItems: 'center',
  },
  lastRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 0,
        // padding:0,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    padding: 10,
    alignItems: 'center',
  },
  rowLabel: {
    left: 10,
    fontSize: 15,
    flex: 1,
  },
  rowInput: {
    right: 10,
  },
  sliderMetric: {
    right: 10,
    width: 30,
  },
  slider: {
    width: 150,
    height: 30,
    margin: 10,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    color: '#4F8EF7',
  },
  label: {
    fontSize: 20,
    textAlign: 'left',
    margin: 0,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  // button: {
  //   backgroundColor: 'white',
  //   padding: 15,
  //   borderColor: '#eeeeee',
  //   borderWidth:1,
  //   borderBottomWidth: 1 / PixelRatio.get(),
  //   borderBottomColor: '#aaaaaa',
  //   marginRight:20,
  //   marginLeft:20,
  //   alignSelf: 'center',
  // },
  button: {
    backgroundColor: '#3B5998',
    borderColor: '#eeeeee',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#aaaaaa',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default MBStyles;
