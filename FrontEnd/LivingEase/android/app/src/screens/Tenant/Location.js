import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../../constants/Colors';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import fonts from '../../constants/Font';
import Slider from '@react-native-community/slider'; // Add Slider import
import Icon from 'react-native-vector-icons/Ionicons'; // For current location icon

const { width } = Dimensions.get('window');

const Location = () => {
  const navigation = useNavigation();

  const [region, setRegion] = useState(null); // Set initial region to null
  const [currentRegion, setCurrentRegion] = useState(null); // Set initial region to null
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

  const [distance, setDistance] = useState(5); // Default distance in kilometers

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ`
      );
      if (response.data.results && response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setCurrentLocation({
          ...currentLocation,
          address,
        });
      } else {
        setCurrentLocation({
          ...currentLocation,
          address: 'Unknown location',
        });
      }
    } catch (error) {
      setCurrentLocation({
        ...currentLocation,
        address: 'Error fetching location',
      });
    }
  };

  const handlePlaceSelect = (data, details) => {
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
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

  const handleSelectLocation = () => {
    navigation.navigate('SearchFilter', {
      address: currentLocation.address,
      locationLatLng: locationLatLng,
      distance, // Passing the selected distance
    });
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

      <MapView
        style={styles.map}
        region={currentRegion} // Use currentRegion state for initial region
        onRegionChangeComplete={(region) => setRegion(region)}
      >
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

      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.sliderLabel}>Area Range</Text>
          <Text style={styles.distanceLabel}>{distance} km</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          value={distance}
          onValueChange={(value) => setDistance(value)}
          step={1}
          thumbTintColor={Colors.primary}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.darkText}
        />
      </View>

      <TouchableOpacity style={styles.currentLocationButton} onPress={fetchCurrentLocation}>
        <Icon name="locate" size={30} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSelectLocation}>
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
  sliderContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
  },
  distanceLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
  },
  currentLocationButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 90,
    right: 16,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.white,
  },
});

export default Location;
