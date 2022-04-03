'use strict';

import React, { Component } from 'react';
import { Navigator, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Qs from 'qs';

import EmptyContainer from '../../common/EmptyContainer';
import MBColors from '../../common/MBColors';
import MarkerPin from '../../common/MarkerPin';

class RideConfirmScreen extends Component {
    props: {
        navigator: Navigator;
        dispatch: () => void;
    };

    constructor(props) {
        super(props);

        this.state = {
            destAddress: '',
            srcAddress: ''
        };
    }
    componentWillMount() {
        // https://github.com/facebook/react-native/issues/1403 prevents this to work for initial load
        Icon.getImageSource('md-arrow-back', 30, 'white').then((source) => this.setState({ backIcon: source }));
        // let googleMapsClient = googleApi.createClient({
        //           key: 'GOOGLE_API_KEY'
        //         });
        //         console.log(googleMapsClient);
        let src = {
            lat: this.props.sourceLoc.latitude,
            lng: this.props.sourceLoc.longitude
        }
        let dst = {
            lat: this.props.destLoc.latitude,
            lng: this.props.destLoc.longitude
        }
        Geocoder.geocodePosition(src).then(res => {
            this.setState({ srcAddress: res[0].formattedAddress });
        }).catch(err => console.log(err));

        if (this.props.destAddress == "") {
            Geocoder.geocodePosition(dst).then(res => {
                this.setState({ destAddress: res[0].formattedAddress })
            })
                .catch(err => console.log(err))

            console.log("destination address needs to be fetched");
        } else {
            this.setState({ destAddress: this.props.destAddress });
        }

        //   let params = {
        //     // REQUIRED
        //     origin: src.lat +","+ src.lng,
        //     destination: dst.lat +","+ dst.lng,
        //     key: "GOOGLE_API_KEY",
        //     };
        //   const request = new XMLHttpRequest();
        //   request.timeout = 10000;
        //   request.onreadystatechange = () => {
        //     if (request.readyState !== 4) {
        //       return;
        //     }
        //     if (request.status === 200) {
        //       const responseJSON = JSON.parse(request.responseText);
        //       console.log(responseJSON);
        //     }
        //   }
        //   let url = 'https://maps.googleapis.com/maps/api/directions/json?' + Qs.stringify(params);
        //   console.log(url);
        //   request.open('GET', url);
        // request.send();
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
    render() {
        let leftitem = {
            title: 'Back',
            icon: this.state.backIcon,
            onPress: () => this.props.navigator.pop(),
        };
        let rightItem = {
            title: 'Confirm',
            layout: 'title'
        }
        return (
            <EmptyContainer title="Seat Required"
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

export default connect()(RideConfirmScreen);
