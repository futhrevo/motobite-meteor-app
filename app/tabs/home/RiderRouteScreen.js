'use strict';

import React, { Component } from 'react';
import { Navigator, StatusBar, StyleSheet, Text, ToastAndroid, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Qs from 'qs';

import EmptyContainer from '../../common/EmptyContainer';
import MBColors from '../../common/MBColors';
import MarkerPin from '../../common/MarkerPin';
import { polyDecode } from '../../actions/polylineHelpers';

class RiderRouteScreen extends Component {
  props: {
    navigator: Navigator;
    dispatch: () => void;
  };

  constructor(props) {
    super(props);

    this.state = {
      destAddress: '',
      srcAddress: '',
      isPolySet: false,
      selectedRoute: 0
    };
    (this: any).parseDirections = this.parseDirections.bind(this);
  }
  componentWillMount() {
    // https://github.com/facebook/react-native/issues/1403 prevents this to work for initial load
    Icon.getImageSource('md-arrow-back', 30, 'white').then((source) => this.setState({ backIcon: source }));
  }

  componentDidMount() {
    let src = {
      lat: this.props.sourceLoc.latitude,
      lng: this.props.sourceLoc.longitude
    }
    let dst = {
      lat: this.props.destLoc.latitude,
      lng: this.props.destLoc.longitude
    }
    let departure_time = 'now';
    if (this.props.time != 'Now') {
      let utime = new Date();
      utime.setHours(this.props.timeHour);
      utime.setMinutes(this.props.timeMinute);
      departure_time = utime;
    }
    let params = {
      // REQUIRED
      origin: src.lat + "," + src.lng,
      destination: dst.lat + "," + dst.lng,
      key: "GOOGLE_API_KEY",
      departure_time: departure_time,
      alternatives: true
    };
    const request = new XMLHttpRequest();
    request.timeout = 10000;
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);
        this.parseDirections(responseJSON);
      }
    }
    let url = 'https://maps.googleapis.com/maps/api/directions/json?' + Qs.stringify(params);
    console.log(url);
    request.open('GET', url);
    request.send();
  }
  renderSourceMarker() {
    if (this.props.isSourceset) {
      return (
        <MapView.Marker
          identifier={'sourceMarker'}
          coordinate={this.props.sourceLoc}
          title={"Origin"}
        >
          <MarkerPin text={"A"} />
        </MapView.Marker>
      );
    }
  }
  renderDestinationMarker() {
    if (this.props.isDestSet) {
      return (
        <MapView.Marker
          identifier={'destMarker'}
          coordinate={this.props.destLoc}
          title={"Destination"}
          onDragEnd={(e) => this.setState({ destLoc: e.nativeEvent.coordinate })}
        >
          <MarkerPin text={"B"} />
        </MapView.Marker>
      );
    }

  }
  renderPolyline(polyline, index) {
    if (this.state.isPolySet) {
      let temp = polyDecode(polyline);
      console.log(this.state.selectedRoute);
      return (
        <MapView.Polyline
          key={index}
          coordinates={temp}
          strokeWidth={5}
          strokeColor={index == this.state.selectedRoute ? "#00f0f0" : "#808080"}
          onPress={() => this.setState({ selectedRoute: index })}
        />
      );
    }
  }
  render() {
    let leftitem = {
      title: 'Back',
      icon: this.state.backIcon,
      onPress: () => this.props.navigator.pop(),
    };
    let rightItem = {
      title: 'Next',
      layout: 'title'
    }
    return (
      <EmptyContainer title="Select Route"
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#47BFBF'}
        leftItem={leftitem}
        rightItem={rightItem}>
        <View style={styles.container}>
          <View style={styles.background}>
            <View>
              <View>
                <TouchableHighlight
                  style={styles.button}
                // onPress={() => ()}
                >
                  <Text numberOfLines={1} style={styles.addressText}>A: {this.state.srcAddress}</Text>
                </TouchableHighlight>

              </View>
              <View>
                <TouchableHighlight
                  style={styles.button}
                // onPress={() => ()}
                >
                  <Text numberOfLines={1} style={styles.addressText}>B: {this.state.destAddress}</Text>
                </TouchableHighlight>
              </View>

            </View>
            <MapView
              ref="confirmMap"
              style={styles.map}
              loadingEnabled={true}
              loadingIndicatorColor={"#666666"}
              loadingBackgroundColor={"#eeeeee"}
              showsUserLocation={true}
              initialRegion={this.props.location}
            >
              {this.renderSourceMarker()}
              {this.renderDestinationMarker()}
              {this.state.isPolySet &&
                this.state.polylines.map((polyline, index) => this.renderPolyline(polyline, index))}
            </MapView>
          </View>
          <View style={styles.overlay} pointerEvents={'box-none'}>
            <View >
              <TouchableHighlight
                style={styles.button}
              // onPress={() => ()}
              >
                <Text style={styles.addressText}>{this.props.day === 'day0' ? 'Today' : 'Tomorrow'} {this.props.time}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </EmptyContainer>
    );
  }

  parseDirections(responseJSON) {
    console.log(responseJSON);
    if (responseJSON.status === 'OK') {
      let legs = responseJSON.routes[0].legs[0];
      this.setState({ srcAddress: legs.start_address });
      this.setState({ destAddress: legs.end_address });
      let numRoutes = responseJSON.routes.length;
      let polylines = [];
      let summaries = [];
      for (let i = 0; i < numRoutes; i++) {
        polylines.push(responseJSON.routes[i].overview_polyline.points);
        summaries.push(responseJSON.routes[i].summary);
      }
      this.setState({ polylines: polylines, summaries: summaries, isPolySet: true });
      console.log(this.state);
    } else if (responseJSON.status === 'ZERO_RESULTS') {

    } else {
      ToastAndroid.show('Internal Error occured', ToastAndroid.SHORT);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MBColors.screenBackground,
  },
  background: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addressText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
  },
  button: {
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#123456',
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  }
});

export default connect()(RiderRouteScreen);
