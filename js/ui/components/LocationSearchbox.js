

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const homePlace = { description: 'Home', formatted_address: 'Home', geometry: { location: { lat: 12.9866317, lng: 77.6328484 } } };
const workPlace = { description: 'Work', formatted_address: 'Work', geometry: { location: { lat: 12.9297532, lng: 77.6823727 } } };
const iconSize = 16;
const styles = StyleSheet.create({
  style: {
    flex: 1,
    margin: 10,

  },
  searchboxStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(225,225,225,1)',
    borderRadius: 4,
    height: 50,
  },
  searchboxInnerStyle: {
    //   flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconStyle: {
    width: iconSize,
    height: iconSize,
    opacity: 32 / 100,
  },
  searchboxTextContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: 9,
    color: 'rgba(113,187,28,1)',
    marginTop: 2,
    marginBottom: 3,
    fontWeight: '600',
  },
  textStyle: {
    fontSize: 14,
    color: 'rgba(0,0,0,1)',
  },
});

class LocationSearchbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autolocation: {},
    };
  }

  render() {
    const location = `${this.props.location.latitude},${this.props.location.longitude}`;

    return (

      <View style={styles.searchboxInnerStyle} >
        <GooglePlacesAutocomplete
          placeholder="Set Destination"
          minLength={3} // minimum length of text to search
          autoFocus={false}
          fetchDetails
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            if (details.hasOwnProperty('geometry')) {
              this.props.callbackParent(details);
            }
          }}
          getDefaultValue={() => '' // text input default value
          }
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'geo_API_KEY',
            language: 'en', // language of the results
            components: 'country:in',
            radius: '10000',
            location,
            //  default: 'geocode'
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            row: {
              backgroundColor: 'white',
            },
          }}
          // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            radius: '10000',
            location,
          }}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
        />
      </View>

    );
  }
}

export default LocationSearchbox;
