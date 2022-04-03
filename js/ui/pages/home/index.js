import React, { Component } from 'react';
import { PermissionsAndroid, StyleSheet, Dimensions, View, InteractionManager, Picker, TouchableOpacity, ToastAndroid, DeviceEventEmitter, TimePickerAndroid, BackAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Text, Button, Icon, Left, Body, Right, Segment, Item, Input, ListItem } from 'native-base';
import MapView from 'react-native-maps';
import Modal from 'react-native-modalbox';
import Geocoder from 'react-native-geocoder';
import _ from 'lodash';
import Qs from 'qs';

import { openDrawer } from '../../../imports/actions/drawer';
import MarkerPin from '../../components/MarkerPin';
import LocationPin from '../../components/LocationPin';
import LocationSearchbox from '../../components/LocationSearchbox';
import { haversine } from '../../../imports/api/gmapHelpers';
import { polyDecode } from '../../../imports/api/PolylineHelpers';
import { logOutWithPrompt } from '../../../imports/actions/login';

const { reset, pushRoute } = actions;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Keep a reference to ensure there is only one event listener
// subscribed with BackAndroid
let listener = null;

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#3F51B5',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  toggleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,

  },
  toggleIcon: {
    margin: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  searchbox: {
    top: 0,
  },
  timePicker: {
    flex: 1,
  },
  timeText: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  picker: {
    flex: 2,
  },
  modal: {

  },
  modal4: {
    height: 320
  },
});

class Home extends Component {
  watchID: ?number;
  static propTypes = {
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    reset: React.PropTypes.func,
    logout: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }
  constructor(props) {
    super(props);
    this.state = {
      cache: false,
      isGPSEnabled: false,
      isWatching: false,
      location: {},
      isRegionSet: false,
      isPinSet: false,
      pinText: 'Fetching..',
      sourceLoc: {},
      isSourceset: false,
      destLoc: {},
      destAddress: {},
      srcAddress: {},
      isDestSet: false,
      isKeyBoardVsisible: false,
      isRider: false,
      day: 'day0',
      time: 'Now',
      loading: true,
      isPolySet: false,
      selectedRoute: 0,
      summaries: []
    };
    (this: any).gotoRideConfirmScreen = this.gotoRideConfirmScreen.bind(this);
    (this: any).gotoRiderRouteScreen = this.gotoRiderRouteScreen.bind(this);
    (this: any).onLocationChanged = this.onLocationChanged.bind(this);
    (this: any).gotoLocation = this.gotoLocation.bind(this);
    (this: any).onRegionChange = this.onRegionChange.bind(this);
    (this: any).gotoPin = this.gotoPin.bind(this);
    (this: any).setDestinationLocation = this.setDestinationLocation.bind(this);
    (this: any).onCancel = this.onCancel.bind(this);
    (this: any).onNext = this.onNext.bind(this);
    (this: any).onRiderSelect = this.onRiderSelect.bind(this);
    (this: any).onRideSelect = this.onRideSelect.bind(this);
    (this: any).showTimePicker = this.showTimePicker.bind(this);
    (this: any).getSourceAddress = this.getSourceAddress.bind(this);
    (this: any).getDestinationAddress = this.getDestinationAddress.bind(this);
    (this: any).parseDirections = this.parseDirections.bind(this);
  }
  componentWillMount() {
    console.log('Starting location');
    if (!this.state.isWatching) {
      // MBLocAndroid.requestEnableLocation(locationOptions)
      //           .then(() => {
      //             console.log('prompt success');
      //               // MBLocAndroid.startWatching(locationOptions);

      //           })
      //           .catch(() => console.log('prompt failed'));
      this.requestLocationPermission();
      DeviceEventEmitter.addListener('locationListenerUpdate', this.onLocationChanged);
      DeviceEventEmitter.addListener('locationListenerError', this.onLocationError);
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
    });
    if (Platform.OS === 'android' && listener == null) {
      listener = BackAndroid.addEventListener('hardwareBackPress', () => this.onCancel());
    }
    this.watchID = navigator.geolocation.watchPosition((position) => {
      console.log(position);
      if (this.gotoLocation(position.coords)) {
        this.setState({ pinText: 'SET ORIGIN', isRegionSet: true });
        navigator.geolocation.clearWatch(this.watchID);
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDestSet && !prevState.isDestSet) {
      console.log('destination marker is set');
      this.map.fitToElements(true);
      if (this.state.isRider && !this.state.isPolySet) {
        this.requestDirections();
      }
    }
    if (this.state.isRider && !prevState.isRider) {
      if (!this.state.isPolySet) {
        this.requestDirections();
      }
    }
  }
  componentWillUnmount() {
    console.log('Stopping location');
    this.setState({ isWatching: false });
    DeviceEventEmitter.removeListener('locationListenerUpdate', this.onLocationChanged);
    DeviceEventEmitter.removeListener('locationListenerError', this.onLocationError);
    navigator.geolocation.clearWatch(this.watchID);
    if (Platform.OS === 'android' && listener != null) {
      listener = BackAndroid.removeEventListener('hardwareBackPress', () => this.onCancel());
    }
  }
  pushRoute(route, index) {
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }
  renderButtons() {
    if (this.state.isSourceset && !this.state.isKeyBoardVsisible) {
      return (
        <View style={styled.buttonContainer} pointerEvents={'box-none'}>
          <Button transparent style={{ marginLeft: 10 }} onPress={this.onCancel}>
            <Icon active name="ios-arrow-back" style={{ color: '#ffffff' }} />
          </Button>
          <View style={styled.toggleContainer}>
            <Segment>
              <Button first active={this.state.isRider} onPress={this.onRiderSelect}><Text>Rider</Text></Button>
              <Button last active={!this.state.isRider} onPress={this.onRideSelect}><Text>Need Ride?</Text></Button>
            </Segment>
          </View>
          <Button transparent style={{ marginLeft: 10 }} onPress={this.onNext}>
            <Icon active name="ios-arrow-forward" style={{ color: '#ffffff' }} />
          </Button>
        </View>
      );
    }
  }
  renderLocationPin() {
    if (!this.state.isSourceset) {
      return (
        <LocationPin text={this.state.pinText} onPress={this.gotoPin} />
      );
    }
  }
  renderSearchbox() {
    if (this.state.isSourceset && this.state.isDestSet) {
      return;
    }
    if (this.state.isSourceset) {
      return (
        <View style={styled.searchbox}>
          <LocationSearchbox
            margin={10}
            showLabel={true}
            labelText={'MY LOCATION'}
            defaultText={'Choose Your Location'}
            callbackParent={this.setDestinationLocation}
            autoFocus={true}
            location={this.state.sourceLoc}
          />
        </View>
      );
    }
  }
  renderDateTImeBar() {
    if (this.state.isDestSet) {
      return (
        <View style={styled.timeContainer} pointerEvents={'box-none'}>
          <Picker
            style={styled.picker}
            selectedValue={this.state.day}
            onValueChange={day => this.setState({ day })}
          >
            <Picker.Item label="Today" value="day0" />
            <Picker.Item label="Tomorrow" value="day1" />
          </Picker>
          <TouchableOpacity onPress={this.showTimePicker} style={styled.timePicker}>
            <Text>{this.state.time}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  gotoPin() {
    if (this.state.isRegionSet && this.state.pinText === 'SET ORIGIN') {
      this.setState({ isSourceset: true });
      this.setState({ sourceLoc: this.state.location });
      this.setState({ srcAddress: {} });
      console.log('origin confirmed');
    }
  }
  onRegionChange(region) {
    this.setState({ location: region });
    if (this.state.isRegionSet) {
      this.setState({ pinText: 'SET ORIGIN' });
    }
  }
  gotoLocation(loc) {
    if (Object.prototype.hasOwnProperty.call(loc, 'latitude')) {
      if (this.map !== undefined) {
        this.map.animateToRegion({
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: LATITUDE_DELTA * 0.05,
          longitudeDelta: LONGITUDE_DELTA * 0.05,
        }, 500);
        this.setState({ isPinSet: true });
      }
      return true;
    } else {
      ToastAndroid.show('No Location fix yet', ToastAndroid.SHORT);
      return false;
    }
  }
  onLocationChanged(loc) {
    this.setState({ location: loc });
    if (!this.state.isRegionSet) {
      this.gotoLocation(loc);
      this.setState({ isRegionSet: true });
    }
  }
  static onLocationError(err) {
    console.error(err);
  }
  onCancel() {
    console.log('oncancel called');
    if (this.state.isSourceset && this.state.isDestSet) {
      this.setState({ isDestSet: false, isPolySet: false });
    } else if (this.state.isSourceset) {
      this.setState({ isSourceset: false });
    } else {
      return false;
    }
    this.gotoLocation(this.state.sourceLoc);
    return true;
  }
  onRiderSelect() {
    this.setState({ isRider: true });
  }
  onRideSelect() {
    this.setState({ isRider: false });
  }
  onNext() {
    if (!this.state.isDestSet) {
      ToastAndroid.show('Add Destination to continue', ToastAndroid.SHORT);
    } else {
      if (this.checkTime() && this.checkDistance()) {
        if (!this.state.isRider) {
          this.gotoRideConfirmScreen();
        } else {
          this.gotoRiderRouteScreen();
        }
      }
    }
  }
  setDestinationLocation(details) {
    const loc = details.geometry.location;
    const destLoc = {
      latitude: loc.lat,
      longitude: loc.lng
    };
    this.setState({ destLoc, isDestSet: true, destAddress: { formattedAddress: details.formatted_address, locality: '', subLocality: '', streetName: '', streetNumber: details.formatted_address } });
  }
  gotoRideConfirmScreen() {
    // this.props.navigator.push({ rideConfirmScreen: true , passProps:this.state });
    this.getSourceAddress();
    this.getDestinationAddress();
    this.driveModal.open();
  }
  gotoRiderRouteScreen() {
    // this.props.navigator.push({ riderRouteScreen: true , passProps:this.state });
    this.driveModal.open();
  }
  getSourceAddress() {
    const src = {
      lat: this.state.sourceLoc.latitude,
      lng: this.state.sourceLoc.longitude
    };
    if (_.isEmpty(this.state.srcAddress)) {
      Geocoder.geocodePosition(src).then((res) => {
        console.log(res);
        this.setState({ srcAddress: _.pick(res[0], ['formattedAddress', 'locality', 'subLocality', 'streetNumber', 'streetName']) });
      }).catch(err => console.log(err));
    }
  }
  getDestinationAddress() {
    const dst = {
      lat: this.state.destLoc.latitude,
      lng: this.state.destLoc.longitude
    };
    if (_.isEmpty(this.state.destAddress)) {
      Geocoder.geocodePosition(dst).then((res) => {
        this.setState({ destAddress: _.pick(res[0], ['formattedAddress', 'locality', 'subLocality', 'streetNumber', 'streetName']) });
      }).catch(err => console.log(err));
    }
  }
  requestDirections() {
    ToastAndroid.show('Fetching Directions', ToastAndroid.LONG);
    const src = {
      lat: this.state.sourceLoc.latitude,
      lng: this.state.sourceLoc.longitude
    };
    const dst = {
      lat: this.state.destLoc.latitude,
      lng: this.state.destLoc.longitude
    };
    let departure_time = 'now';
    if (this.state.time != 'Now') {
      const utime = new Date();
      utime.setHours(this.state.timeHour);
      utime.setMinutes(this.state.timeMinute);
      departure_time = utime;
    }
    const params = {
      // REQUIRED
      origin: `${src.lat},${src.lng}`,
      destination: `${dst.lat},${dst.lng}`,
      key: 'geo_API_KEY',
      departure_time,
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
    };
    const url = `https://maps.googleapis.com/maps/api/directions/json?${Qs.stringify(params)}`;
    console.log(url);
    request.open('GET', url);
    request.send();
  }
  parseDirections(responseJSON) {
    console.log(responseJSON);
    if (responseJSON.status === 'OK') {
      const legs = responseJSON.routes[0].legs[0];
      this.setState({ srcAddress: _extractAddressFields(legs.start_address) });
      this.setState({ destAddress: _extractAddressFields(legs.end_address) });
      const numRoutes = responseJSON.routes.length;
      const polylines = [];
      const summaries = [];
      for (let i = 0; i < numRoutes; i++) {
        polylines.push(responseJSON.routes[i].overview_polyline.points);
        summaries.push(responseJSON.routes[i].summary);
      }
      this.setState({ polylines, summaries, isPolySet: true });
      console.log(this.state);
    } else if (responseJSON.status === 'ZERO_RESULTS') {

    } else {
      ToastAndroid.show('Internal Error occured', ToastAndroid.SHORT);
    }
  }
  async showTimePicker() {
    const stateKey = 'time';
    try {
      const { action, minute, hour } = await TimePickerAndroid.open();
      let newState = {};
      if (action === TimePickerAndroid.timeSetAction) {
        newState.time = _formatTime(hour, minute);
        newState[`${stateKey}Hour`] = hour;
        newState[`${stateKey}Minute`] = minute;
      } else if (action === TimePickerAndroid.dismissedAction) {
        newState = {};
      }
      console.log(newState);
      this.setState(newState);
    } catch ({ code, message }) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'MotoBite App LocationPermission',
        message: 'MotoBite App needs access to your location to work properly'
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        this.setState({ isGPSEnabled: true, isWatching: true });
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  }
  checkTime() {
    if (this.state.day === 'day1' && this.state.time === 'Now') {
      ToastAndroid.show('Please enter time for tomorrow', ToastAndroid.SHORT);
      return false;
    }
    if (this.state.day === 'day0' && this.state.time !== 'Now') {
      const utime = new Date();
      utime.setHours(this.state.timeHour);
      utime.setMinutes(this.state.timeMinute);
      if (utime < new Date()) {
        ToastAndroid.show('Please enter future time', ToastAndroid.SHORT);
        return false;
      }
    }
    return true;
  }
  checkDistance() {
    const distance = haversine(this.state.sourceLoc, this.state.destLoc);
    if (distance < 0.1) {
      ToastAndroid.show('Please select a farther destination', ToastAndroid.SHORT);
      return false;
    }
    return true;
  }
  renderDestinationMarker() {
    if (this.state.isDestSet) {
      return (
        <MapView.Marker
          identifier={'destMarker'}
          coordinate={this.state.destLoc}
          pinColor={'orange'}
          draggable
          title={'Destination'}
          onDragEnd={e => this.setState({ destLoc: e.nativeEvent.coordinate, destAddress: {} })}
        >
          <MarkerPin text={'B'} />
        </MapView.Marker>
      );
    }
  }
  renderSourceMarker() {
    if (this.state.isSourceset) {
      return (
        <MapView.Marker
          identifier={'sourceMarker'}
          coordinate={this.state.sourceLoc}
          pinColor={'blue'}
          title={'Origin'}
        >
          <MarkerPin text={'A'} />
        </MapView.Marker>
      );
    }
  }
  renderPolyline(polyline, index) {
    if (this.state.isPolySet) {
      const temp = polyDecode(polyline);
      console.log(this.state.selectedRoute);
      return (
        <MapView.Polyline
          key={index}
          coordinates={temp}
          strokeWidth={5}
          strokeColor={index === this.state.selectedRoute ? '#00f0f0' : '#80808080'}
          onPress={() => this.setState({ selectedRoute: index })}
        />
      );
    }
  }
  render() {
    const coordinates = {
      latitude: 12.97,
      longitude: 77.57,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>{(this.props.name) ? this.props.name : 'Home'}</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.props.logout}>
              <Icon name="ios-power" />
            </Button>
          </Right>
        </Header>
        <View style={styled.container}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <MapView
              ref={(c) => { this.map = c; }}
              initialRegion={coordinates}
              loadingEnabled={true}
              loadingIndicatorColor={'#666666'}
              loadingBackgroundColor={'#eeeeee'}
              cacheEnabled={this.state.cache}
              onRegionChangeComplete={this.onRegionChange}
              showsUserLocation={this.state.isWatching}
              showsMyLocationButton={true}
              style={styled.map}
            >
              {this.renderSourceMarker()}
              {this.renderDestinationMarker()}
              {this.state.isRider && this.state.isPolySet &&
                this.state.polylines.map((polyline, index) => this.renderPolyline(polyline, index))}
            </MapView>
          )}

          <View style={styled.overlay} pointerEvents={'box-none'}>
            {this.renderLocationPin()}
            {this.renderSearchbox()}
            <View style={{ bottom: 0, flex: 1, justifyContent: 'flex-end', alignSelf: 'stretch', }}>
              {this.renderDateTImeBar()}
              {this.renderButtons()}
            </View>
            <Modal style={[styled.modal, styled.modal4]} position={'bottom'} ref={(c) => { this.driveModal = c; }} backButtonClose={true}>
              <View style={{ padding: 5 }}>
                <ListItem itemHeader first>
                  <Text>{this.state.isRider ? 'You are driving' : 'You need a ride'}</Text>
                </ListItem>
                <ListItem icon>
                  <Left>
                    <Icon name="md-pin" />
                  </Left>
                  <Body>
                    <Text numberOfLines={1}>{`${this.state.srcAddress.streetNumber}, ${this.state.srcAddress.streetName}`}</Text>
                    <Text numberOfLines={1} note>{`${this.state.srcAddress.subLocality}, ${this.state.srcAddress.locality}`}</Text>
                  </Body>
                  <Right />
                </ListItem>
                {this.state.isRider && (
                  <ListItem icon>
                    <Left>
                      <Icon name="md-code-working" />
                    </Left>
                    <Body>
                      <Text numberOfLines={1}>{this.state.summaries[this.state.selectedRoute]}</Text>
                    </Body>
                    <Right />
                  </ListItem>
                )}
                <ListItem icon>
                  <Left>
                    <Icon name="md-pin" />
                  </Left>
                  <Body>
                    <Text numberOfLines={1}>{`${this.state.destAddress.streetNumber}, ${this.state.destAddress.streetName}`}</Text>
                    <Text numberOfLines={1} ellipsizeMode={'head'} note>{`${this.state.destAddress.subLocality}, ${this.state.destAddress.locality}`}</Text>
                  </Body>
                  <Right />
                </ListItem>
                <ListItem icon>
                  <Left>
                    <Icon name="md-time" />
                  </Left>
                  <Body>
                    <Text>{this.state.day === 'day0' ? 'Today' : 'Tomorrow'}</Text>
                  </Body>
                  <Right>
                    <Text>{this.state.time}</Text>
                  </Right>
                </ListItem>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                  <Button iconLeft info onPress={() => this.driveModal.close()}>
                    <Icon active name="md-build" />
                    <Text>Modify</Text>
                  </Button>
                  <Button iconLeft success>
                    <Icon active name="md-checkmark" />
                    <Text>Done</Text>
                  </Button>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Container>
    );
  }
}

const Loading = () => (
  <View style={styled.container}>
    <Text>Loading...</Text>
  </View>
);
function _formatTime(hour, minute) {
  return `${hour}:${minute < 10 ? `0${minute}` : minute}`;
}

function _extractAddressFields(faddress) {
  const addressArray = faddress.split(', ');

  const streetNumber = addressArray.splice(0, 2).join(', ');
  const streetName = addressArray.length > 1 ? addressArray.splice(0, 1).join(', ') : '';
  const subLocality = addressArray.length > 1 ? addressArray.splice(0, 1).join(', ') : '';
  const locality = addressArray.join(', ');
  return { fomattedAddress: faddress, streetNumber, streetName, subLocality, locality };
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
    logout: () => dispatch(logOutWithPrompt())
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Home);
