import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';
import Geolocation from '@react-native-community/geolocation';

const CompareProperties = ({ route }) => {
  const { propertyIds } = route.params;
  const [properties, setProperties] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState({});
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyDetails = await Promise.all(
          propertyIds.map(async (id) => {
            const response = await apiClient.get(`property/${id}`);
            return response.data.property;
          }),
        );
        setProperties(propertyDetails);

        // Fetch nearby places for each property
        propertyDetails.forEach((property, index) => {
          const { coordinates } = property.locationLatLng; // Extract the coordinates
          const latitude = coordinates[1]; // Latitude is at index 1
          const longitude = coordinates[0]; // Longitude is at index 0
          fetchNearbyPlaces({ latitude, longitude }, index); // Pass the lat & long to fetchNearbyPlaces
        });
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [propertyIds]);

  const fetchNearbyPlaces = (location, index) => {
    const { latitude, longitude } = location;

    const apiKey = 'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ'; // Replace with your Google Maps API key

    Promise.all([
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=school&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=hospital&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=park&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=bank&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=gas_station&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=shopping_mall&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=gym&key=${apiKey}`),
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=pharmacy&key=${apiKey}`),
    ])
      .then(async (responses) => {
        const [
          schoolResponse,
          hospitalResponse,
          restaurantResponse,
          parkResponse,
          bankResponse,
          gasStationResponse,
          shoppingMallResponse,
          gymResponse,
          pharmacyResponse,
        ] = await Promise.all(responses.map((res) => res.json()));

        // Store nearby places for each property by its index
        setNearbyPlaces((prevNearbyPlaces) => ({
          ...prevNearbyPlaces,
          [index]: {
            schools: schoolResponse.results.length,
            hospitals: hospitalResponse.results.length,
            restaurants: restaurantResponse.results.length,
            parks: parkResponse.results.length,
            banks: bankResponse.results.length,
            gasStations: gasStationResponse.results.length,
            shoppingMalls: shoppingMallResponse.results.length,
            gyms: gymResponse.results.length,
            pharmacies: pharmacyResponse.results.length,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching nearby places:', error);
      });
  };

  const featureIcons = {
    Parking: 'parking',
    'CCTV Camera': 'cctv',
    Electricity: 'lightning-bolt',
    'Water Supply': 'water-pump',
    Gas: 'gas-cylinder',
    Security: 'shield',
    'Internet Access': 'wifi',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.comparisonContainer}>
        {properties.map((property, index) => (
          <View key={index} style={styles.propertyColumn}>
            <Text style={styles.featuresTitle}>Property Name</Text>
            <Text style={styles.propertyName}>{property.propertyName}</Text>
            <Text style={styles.featuresTitle}>Property Category</Text>
            <Text style={styles.propertyCategory}>{property.category}</Text>
            <View style={styles.line} />
            <Text style={styles.featuresTitle}>Monthly Rent</Text>
            <Text style={styles.propertyRent}>
              {property.rentPrice}
            </Text>
            <View style={styles.line} />
            <Text style={styles.featuresTitle}>Features</Text>
            {property.bedrooms && (
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="bed" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>{property.bedrooms} Bedrooms</Text>
              </View>
            )}
            {property.bathrooms && (
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="shower" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>{property.bathrooms} Bathrooms</Text>
              </View>
            )}
            {property.propertySize && (
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="ruler" size={20} color={Colors.primary} />
                <Text style={styles.featureText}>
                  {property.propertySize} {property.sizeUnit}
                </Text>
              </View>
            )}
            {property.features.length > 0 &&
              property.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <MaterialCommunityIcons
                    name={featureIcons[feature] || 'star-outline'}
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            <View style={styles.line} />
            <Text style={styles.featuresTitle}>Nearby Places</Text>

            {nearbyPlaces[index] && (
              <>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="tree" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].parks} Parks</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="bank" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].banks} Banks</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="gas-station" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].gasStations} Gas Stations</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="shopping" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].shoppingMalls} Shopping Malls</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="weight-lifter" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].gyms} Gyms</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="pill" size={20} color={Colors.primary} />
                  <Text style={styles.featureText}>{nearbyPlaces[index].pharmacies} Pharmacies</Text>
                </View>
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  propertyColumn: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  propertyName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 10,
  },
  propertyCategory: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginBottom: 10,
  },
  propertyRent: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    marginBottom: 10,
  },
  featuresTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  line: {
    height: 1,
    backgroundColor: Colors.lightgrey,
    marginVertical: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 5,
  },
});

export default CompareProperties;
