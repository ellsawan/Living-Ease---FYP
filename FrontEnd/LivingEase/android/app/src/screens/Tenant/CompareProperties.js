import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';
import Geolocation from '@react-native-community/geolocation';

const CompareProperties = ({route}) => {
  const {propertyIds} = route.params;
  const [properties, setProperties] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState({schools: 0, hospitals: 0, restaurants: 0});
  const {width: screenWidth} = Dimensions.get('window');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyDetails = await Promise.all(
          propertyIds.map(async id => {
            const response = await apiClient.get(`property/${id}`);
            return response.data.property;
          }),
        );
        setProperties(propertyDetails);
        fetchNearbyPlaces(propertyDetails[0].location); // Assuming the first property's location is used
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [propertyIds]);

  const fetchNearbyPlaces = (location) => {
    Geolocation.getCurrentPosition(async (position) => {
      const {latitude, longitude} = position.coords;
      const apiKey = 'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ'; // Replace with your Google Maps API key

      const schoolResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=school&key=${apiKey}`);
      const hospitalResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=hospital&key=${apiKey}`);
      const restaurantResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${apiKey}`);

      const schoolsData = await schoolResponse.json();
      const hospitalsData = await hospitalResponse.json();
      const restaurantsData = await restaurantResponse.json();

      setNearbyPlaces({
        schools: schoolsData.results.length,
        hospitals: hospitalsData.results.length,
        restaurants: restaurantsData.results.length,
      });
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
      {properties.map((property, index) => (
        <View key={index} style={styles.propertyContainer}>
          <Image
            source={{uri: property.images[0].uri || 'https://via.placeholder.com/150'}}
            style={[styles.image, {width: screenWidth}]}
          />

          <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.propertyName}>{property.propertyName}</Text>
              <Text style={styles.propertyCategory}>{property.category}</Text>
            </View>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={24} color={Colors.primary} />
              <Text style={styles.propertyLocation}>{property.location}</Text>
            </View>
            <View style={styles.rentRow}>
              <MaterialCommunityIcons name="cash" size={24} color={Colors.primary} />
              <Text style={styles.propertyRent}>{property.rentPrice} / Month</Text>
            </View>

            <Text style={styles.featuresTitle}>Nearby Places</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresScrollContainer}></ScrollView>
            <View style={styles.nearbyPlacesContainer}>
              <View style={styles.featureTile}>
                <MaterialCommunityIcons name="school" size={30} color={Colors.primary} />
                <Text style={styles.featureText}>{nearbyPlaces.schools} Schools</Text>
              </View>
              <View style={styles.featureTile}>
                <MaterialCommunityIcons name="hospital" size={30} color={Colors.primary} />
                <Text style={styles.featureText}>{nearbyPlaces.hospitals} Hospitals</Text>
              </View>
              <View style={styles.featureTile}>
                <MaterialCommunityIcons name="food-fork-drink" size={30} color={Colors.primary} />
                <Text style={styles.featureText}>{nearbyPlaces.restaurants} Restaurants</Text>
             
              </View>
              
            </View>

            <Text style={styles.featuresTitle}>Features</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresScrollContainer}>
              {property.bedrooms && (
                <View style={styles.featureTile}>
                  <MaterialCommunityIcons name="bed" size={30} color={Colors.primary} />
                  <Text style={styles.featureText}>{property.bedrooms} Bedrooms</Text>
                </View>
              )}
              {property.bathrooms && (
                <View style={styles.featureTile}>
                  <MaterialCommunityIcons name="shower" size={30} color={Colors.primary} />
                  <Text style={styles.featureText}>{property.bathrooms} Bathrooms</Text>
                </View>
              )}
              {property.propertySize && (
                <View style={styles.featureTile}>
                  <MaterialCommunityIcons name="ruler" size={30} color={Colors.primary} />
                  <Text style={styles.featureText}>{property.propertySize} {property.sizeUnit}</Text>
                </View>
              )}
              {property.features.length > 0 && property.features.map((feature, index) => (
                <View key={index} style={styles.featureTile}>
                  <MaterialCommunityIcons name={featureIcons[feature] || 'star-outline'} size={30} color={Colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  propertyContainer: {
    backgroundColor: Colors.white,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  image: {
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  propertyCategory: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.gray,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 10,
  },
  rentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyRent: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginLeft: 10,
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.blue,
    marginTop: 10,
  },
  nearbyPlacesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  featuresScrollContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  featureTile: {
    backgroundColor: Colors.lightgrey,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 100,
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default CompareProperties;
