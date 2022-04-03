/* @flow */
'use strict';

import React, {Component} from 'react';
import {Alert, DeviceEventEmitter, Dimensions, Text, View, Picker, Platform, StyleSheet, TimePickerAndroid,
    ToastAndroid, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';


// import ListContainer from '../../common/ListContainer';
import EmptyContainer from '../../common/EmptyContainer';
import MBColors from '../../common/MBColors';
import LocationPin from '../../common/LocationPin';
import MarkerPin from '../../common/MarkerPin';
import LocationSearchbox from '../../common/LocationSearchbox';
import MBLocAndroid from '../../common/LocationListener';
import {logOutWithPrompt} from '../../actions/login';
import {haversine} from '../../actions/gmapHelpers';

type Props = {
    navigator: Navigator;
}
var { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 20.5937;
const LONGITUDE = 77.6874;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
type LocationRequestOptions = {
    priority?: 'high_accuracy' | 'balanced_power' | 'low_power' | 'no_power';
    interval?: number;
    timeout?: number;
    frequency?: number;
    displacement?: number;
}

const locationOptions: LocationRequestOptions = {
    priority: 'high_accuracy',
    interval: 1000,
    timeout: 60000,
}

class HomeTab extends Component {
    watchID:?number;
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            cache: false,
            isGPSEnabled: false,
            isWatching: false,
            location: {},
            isRegionSet: false,
            isPinSet: false,
            pinText: "Fetching..",
            sourceLoc: {},
            isSourceset: false,
            destLoc: {},
            isDestSet: false,
            isKeyBoardVsisible: false,
            isRider: true,
            day:"day0",
            time:  "Now",
        };
        (this: any).openAboutScreen = this.openAboutScreen.bind(this);
        (this: any).openSettingsScreen = this.openSettingsScreen.bind(this);
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
    }

    componentWillMount() {
        // DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        // DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        console.log("Starting location");
        if (!this.state.isWatching) {
            MBLocAndroid.requestEnableLocation(locationOptions)
                .then(() => {
                    console.log("prompt success");
                    // MBLocAndroid.startWatching(locationOptions);
                    this.setState({ isGPSEnabled: true, isWatching: true });
                    DeviceEventEmitter.addListener('locationListenerUpdate', this.onLocationChanged);
                    DeviceEventEmitter.addListener('locationListenerError', this.onLocationError);
                })
                .catch(() => console.log("prompt failed"));
        }

    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.isDestSet && !prevState.isDestSet){
            console.log("destination marker is set");
            this.refs.map.fitToElements(true);
        }
    }
    componentWillUnmount() {
        console.log("Stopping location");
        // MBLocAndroid.stopWatching();
        this.setState({ isWatching: false });
        DeviceEventEmitter.removeListener('locationListenerUpdate', this.onLocationChanged);
        DeviceEventEmitter.removeListener('locationListenerError', this.onLocationError);
        navigator.geolocation.clearWatch(this.watchID);
    }
    componentDidMount(){
        this.watchID = navigator.geolocation.watchPosition((position) => {
            console.log(position);
            if(this.gotoLocation(position.coords)){
                this.setState({pinText: "SET ORIGIN", isRegionSet: true});
                navigator.geolocation.clearWatch(this.watchID);
            }
        });
    }
    renderRightMenu() {
        if (Platform.OS === 'android') {
            return {
                extraItems: [
                    {
                        title: 'Settings',
                        onPress: () => { this.openSettingsScreen() },
                    }, {
                        title: 'About',
                        onPress: () => { this.openAboutScreen() },
                    }, {
                        title: 'Sign Out',
                        onPress: () => { this.props.dispatch(logOutWithPrompt()) },
                    }
                ]
            };
        }
    }

    renderMarker() {
        if (this.state.isRegionSet) {
            return (
                <MapView.Marker
                    identifier={'currentMarker'}
                    coordinate={this.state.location.coords}
                    pinColor={"green"}
                    >
                    <MarkerPin/>
                    </MapView.Marker>
            );
        }
    }
    renderSourceMarker(){
        if(this.state.isSourceset){
            return(
                <MapView.Marker
                identifier={'sourceMarker'}
                    coordinate={this.state.sourceLoc}
                    pinColor={"blue"}
                    title={"Origin"}
                    >
                    <MarkerPin text={"A"}/>
                    </MapView.Marker>
            );
        }
    }
    renderLocationPin(){
        if(!this.state.isSourceset){
            return(
                <LocationPin text={this.state.pinText} onPress={this.gotoPin}/>
            );
        }
    }
    renderSearchbox() {
        if(this.state.isSourceset && this.state.isDestSet){
            return;
        }
        if (this.state.isSourceset) {
            return (
                <View style={styles.searchbox}>
                    <LocationSearchbox
                        margin={10}
                        showLabel={true}
                        labelText={"MY LOCATION"}
                        defaultText={"Choose Your Location"}
                        callbackParent={this.setDestinationLocation}
                        autoFocus={true}
                        location={this.state.sourceLoc}
                        />
                </View>
            );
        }
    }

    renderDestinationMarker(){
        if(this.state.isDestSet){
            return(
                <MapView.Marker
                    identifier={'destMarker'}
                    coordinate={this.state.destLoc}
                    pinColor={"orange"}
                    draggable
                    title={"Destination"}
                    onDragEnd={(e) => this.setState({destLoc:  e.nativeEvent.coordinate , destAddress:""})}
                    >
                        <MarkerPin text={"B"}/>
                    </MapView.Marker>
            );
        }

    }
    renderButtons(){
        if(this.state.isSourceset && !this.state.isKeyBoardVsisible){
            return(
                <View style={styles.buttonContainer} pointerEvents={'box-none'}>
                <Icon.Button name="ios-arrow-back" size={48} style={{marginLeft:10}} backgroundColor="#3b5998" onPress={this.onCancel}/>
                <View style={styles.toggleContainer}>
                    <TouchableWithoutFeedback onPress={this.onRiderSelect}>
                        <View style={{flex:2,alignItems:'center',borderRadius: 20,justifyContent:'center', backgroundColor:'transparent'}} >
                            <Icon name="md-walk" size={32} style={styles.toggleIcon}  color={this.state.isRider ? 'white':'black'}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.onRideSelect}>
                        <View style={{flex:2,alignItems:'center',borderRadius: 20,justifyContent:'center', backgroundColor:'transparent'}} >
                            <Icon name="ios-car" size={32} style={styles.toggleIcon}  color={this.state.isRider ? 'black': 'white'}/>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                <Icon.Button name="ios-arrow-forward" size={48} style={{marginLeft:10}} backgroundColor="#3b5998" onPress={this.onNext}/>
               </View>
            );
        }
    }



    renderDateTImeBar(){
        if(this.state.isDestSet){
            return(
                <View style={styles.timeContainer} pointerEvents={'box-none'}>
                <Picker
                 style={styles.picker}
                      selectedValue={this.state.day}
                      onValueChange={(day) => this.setState({day: day})}>
                      <Picker.Item label="Today" value="day0" />
                      <Picker.Item label="Tomorrow" value="day1" />
                    </Picker>
                     <TouchableOpacity  onPress={this.showTimePicker} style={styles.timePicker}>
                         <Text style={styles.timeText}>{this.state.time}</Text>
                     </TouchableOpacity>
                </View>
            );
        }
    }
    render() {

        return (
            <EmptyContainer title="MotoBite"
                backgroundImage={require('./img/schedule-background.png') }
                backgroundColor={'#47BFBF'}
                {...this.renderRightMenu() }>
                <View style ={styles.container}>
                    <View style={styles.background}>
                        <MapView
                            ref="map"
                            style={styles.map}
                            initialRegion={{
                                latitude: LATITUDE,
                                longitude: LONGITUDE,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            loadingEnabled={true}
                            loadingIndicatorColor={"#666666"}
                            loadingBackgroundColor={"#eeeeee"}
                            cacheEnabled={this.state.cache}
                            onRegionChangeComplete={this.onRegionChange}
                            showsUserLocation={true}
                            >
                            {this.renderSourceMarker()}
                            {this.renderDestinationMarker()}
                        </MapView>
                        {this.renderButtons()}

                    </View>
                    <View style={styles.overlay}  pointerEvents={'box-none'}>
                    {this.renderLocationPin()}
                    {this.renderSearchbox() }
                    {this.renderDateTImeBar()}
                    </View>
                </View>

            </EmptyContainer>


        );
    }

    onCancel(){
        console.log("oncancel called");
        if(this.state.isSourceset && this.state.isDestSet){
            this.setState({isDestSet: false});
        }else{
            this.setState({isSourceset: false});

        }
        this.gotoLocation(this.state.sourceLoc);
    }
    onRiderSelect(){
        this.setState({isRider:true});
    }
    onRideSelect(){
        this.setState({isRider: false});
    }
    onNext(){
        if(!this.state.isDestSet){
            ToastAndroid.show('Add Destination to continue', ToastAndroid.SHORT);
        }else{
          if(this.checkTime() && this.checkDistance()){
            if(this.state.isRider){
              this.gotoRideConfirmScreen();
            }else{
              this.gotoRiderRouteScreen();
            }

          }

        }
    }
    setDestinationLocation(details){
        let loc = details.geometry.location;
        let destLoc = {
            latitude: loc.lat,
            longitude: loc.lng
        }
        this.setState({destLoc: destLoc, isDestSet: true, destAddress: details.formatted_address});
    }
    openAboutScreen() {

        this.props.navigator.push({ aboutScreen: true });
    }
    openSettingsScreen() {
        this.props.navigator.push({ settingsScreen: true });
    }
    gotoRideConfirmScreen(){
        this.props.navigator.push({ rideConfirmScreen: true , passProps:this.state});
    }
    gotoRiderRouteScreen(){
      this.props.navigator.push({ riderRouteScreen: true , passProps:this.state});
    }
    onLocationChanged(loc) {
        this.setState({ location: loc });
        if (!this.state.isRegionSet) {
            this.gotoLocation(loc);
            this.setState({ isRegionSet: true });
        }
    }
    async showTimePicker(){
       try {
        const {action, minute, hour} = await TimePickerAndroid.open();
        var newState = {}, stateKey="time";
        if (action === TimePickerAndroid.timeSetAction) {
          newState['time'] = _formatTime(hour, minute);
          newState[stateKey + 'Hour'] = hour;
          newState[stateKey + 'Minute'] = minute;
        } else if (action === TimePickerAndroid.dismissedAction) {
          newState={}
        }
        console.log(newState);
        this.setState(newState);
      } catch ({code, message}) {
        console.warn(`Error in example '${stateKey}': `, message);
      }
  }
    onLocationError(err){
        console.error(err);
    }
    gotoLocation(loc) {
        if (loc.hasOwnProperty("latitude")) {
            this.refs.map.animateToRegion({
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: LATITUDE_DELTA * 0.05,
                longitudeDelta: LONGITUDE_DELTA * 0.05,
            }, 500);
            this.setState({isPinSet: true});
            return true;
        } else {
            ToastAndroid.show('No Location fix yet', ToastAndroid.SHORT);
            return false;
        }

    }
    gotoPin() {
        console.log(this.state);
        if(this.state.isRegionSet && this.state.pinText == "SET ORIGIN"){
            this.setState({isSourceset: true});
            this.setState({sourceLoc: this.state.location});
            console.log("origin confirmed");
            return;
        }
    }
    onRegionChange(region) {
        this.setState({location: region});
        if(this.state.isRegionSet){
            this.setState({ pinText: "SET ORIGIN" });
        }

    }
    checkTime(){
      if(this.state.day === 'day1' && this.state.time === 'Now'){
        ToastAndroid.show('Please enter time for tomorrow', ToastAndroid.SHORT);
        return false;
      }
      if(this.state.day === 'day0' && this.state.time != 'Now'){
        let utime = new Date();
        utime.setHours(this.state.timeHour);
        utime.setMinutes(this.state.timeMinute);
        if(utime < new Date()){
          ToastAndroid.show('Please enter future time', ToastAndroid.SHORT);
          return false;
        }

      }
      return true;
    }
    checkDistance(){
      let distance = haversine(this.state.sourceLoc, this.state.destLoc);
      if(distance < 0.1){
        ToastAndroid.show('Please select a farther destination', ToastAndroid.SHORT);
        return false;
      }
      return true;
    }

}
function _formatTime(hour, minute) {
  return hour + ':' + (minute < 10 ? '0' + minute : minute);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MBColors.screenBackground,
    },
    map: {
        flex:1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },
    background: {
        position: 'absolute',
        flex:1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    searchbox: {
        top: 0,

    },
    timeContainer:{
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    bottom:64,
    },
    buttonContainer: {

        // flex:1,
    flexDirection: 'row',
    backgroundColor: '#3b5998',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  toggleContainer:{
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: "#3b59f8",
      borderRadius: 20,

  },
  toggleIcon:{
      margin:10,
  },
  bubble: {

   paddingHorizontal: 18,
   paddingVertical: 12,
   borderRadius: 20,
 },
 cancelbubble:{
     backgroundColor: '#3b5998',
 },
 nextBubble:{
     backgroundColor: '#3b5998',
 },
 button: {
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  picker: {
      flex:2,
 },
 timePicker:{
     flex:1,

 },
 timeText:{
     color: '#3b5998',
     fontWeight: 'bold',
     fontSize:18,
     textAlign: 'center'
      }
});

export default connect()(HomeTab);
