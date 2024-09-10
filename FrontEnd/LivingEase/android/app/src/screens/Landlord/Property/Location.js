import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../../../constants/Colors';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import fonts from '../../../constants/Font';

const {width} = Dimensions.get('window');

const Location = ({route}) => {
  const {mode, propertyId, handleNewLocation} = route.params;
  const navigation = useNavigation();

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedRegion, setSelectedRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    address: 'Default Location',
  });

  const [locationLatLng, setLocationLatLng] = useState({
    type: 'Point',
    coordinates: [0, 0],
  });

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleMarkerDragEnd = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    console.log('Marker Dragged to:', latitude, longitude);
    setSelectedRegion({
      latitude,
      longitude,
    });
    setCurrentLocation({
      latitude,
      longitude,
      address: 'Loading...',
    });
    fetchAddressFromCoordinates(latitude, longitude);
    setLocationLatLng({
      type: 'Point',
      coordinates: [longitude, latitude],
    });
  };

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Current Location:', latitude, longitude);
        
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setSelectedRegion({
          latitude,
          longitude,
        });
        setCurrentLocation({
          latitude,
          longitude,
          address: 'Loading...',
        });
  
        // Update locationLatLng state
        setLocationLatLng({
          type: 'Point',
          coordinates: [longitude, latitude],
        });
  
        // Fetch address using coordinates
        fetchAddressFromCoordinates(latitude, longitude);
      },
      error => {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Unable to fetch your location');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  };
  

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ`,
      );
      console.log('API Response:', response);
      if (response.data.results && response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setCurrentLocation({
          ...currentLocation,
          address,
        });
      } else {
        console.error('No results found from Google Maps Geocoding API');
        setCurrentLocation({
          ...currentLocation,
          address: 'Unknown location',
        });
      }
    } catch (error) {
      console.error(error);
      setCurrentLocation({
        ...currentLocation,
        address: 'Error fetching location',
      });
    }
  };

  const handlePlaceSelect = (data, details) => {
    if (details && details.geometry && details.geometry.location) {
      const {lat, lng} = details.geometry.location;
      console.log('Selected place:', lat, lng, data.description);
      setCurrentLocation({
        latitude: lat,
        longitude: lng,
        address: data.description,
      });
      setCurrentRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedRegion({
        latitude: lat,
        longitude: lng,
      });
      setLocationLatLng({
        type: 'Point',
        coordinates: [lng, lat],
      });
    } else {
      console.error('Details or details.geometry.location is undefined.');
    }
  };

  const handleConfirmLocation = () => {
    Alert.alert(
      'Location Confirmed',
      `Latitude: ${currentLocation.latitude}, Longitude: ${currentLocation.longitude}, Address: ${currentLocation.address}`,
    );
    // You can navigate to another screen or perform any action here
  };

  const handleSelectLocation = () => {
    if (mode === 'add') {
    

      // Handle location confirmation for adding property
      navigation.navigate('AddProperty', {
        address: currentLocation.address,
        locationLatLng: locationLatLng,
      });
    } else if (mode === 'edit') {
      console.log('Sending to Edit Screen:');
      console.log('Address:', currentLocation.address);
      console.log('Location LatLng:', locationLatLng);
      // Handle location confirmation for editing property
      navigation.navigate('EditProperty', {
        address: currentLocation.address,
        locationLatLng: locationLatLng,
        propertyId,
      });
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={handlePlaceSelect}
        query={{
          key: 'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ', // Replace with your Google API key
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
        }}
      />

      <MapView style={styles.map} region={currentRegion}>
        <Marker
          coordinate={{
            latitude: selectedRegion.latitude,
            longitude: selectedRegion.longitude,
          }}
          title={currentLocation.address}
          onDragEnd={handleMarkerDragEnd}
          draggable={true}
        />
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchCurrentLocation}>
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 10}]}
          onPress={handleSelectLocation}>
          <Text style={styles.buttonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  autocompleteContainer: {
    position: 'absolute',
    width: width - 32,
    top: Platform.OS === 'ios' ? 16 : 36,
    left: 16,
    zIndex: 1,
  },
  textInput: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    borderRadius: 10,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
  },
});

export default Location;
