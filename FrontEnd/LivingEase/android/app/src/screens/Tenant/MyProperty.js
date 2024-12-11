import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../apiClient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationView from './LocationView';
import NearbyAmenities from './NearbyAmenities';
import LandlordCard from './LandlordCard';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

export default function MyProperty() {
  const [tenantId, setTenantId] = useState(null);
  const [property, setProperty] = useState(null);  // Property is now an object, not an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {width: screenWidth} = Dimensions.get('window'); // Get screen width for images

  useEffect(() => {
    const fetchTenantIdAndProperties = async () => {
      try {
        const storedTenantId = await AsyncStorage.getItem('userId');
        if (storedTenantId) {
          setTenantId(storedTenantId);
          await fetchRentedProperties(storedTenantId);
        } else {
          setError('Tenant ID not found.');
        }
      } catch (error) {
        console.error('Error fetching tenant ID from AsyncStorage', error);
        setError('Failed to fetch tenant ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantIdAndProperties();
  }, []);
  const featureIcons = {
    Parking: 'parking',
    'CCTV Camera': 'cctv',
    Electricity: 'lightning-bolt',
    'Water Supply': 'water-pump',
    Gas: 'gas-cylinder',
    Security: 'shield',
    'Internet Access': 'wifi',
  };


  // Function to fetch rented properties using tenantId
  const fetchRentedProperties = async (tenantId) => {
    try {
      const response = await apiClient.get(`/property/${tenantId}/rented-property`);
  
      // Check if the response indicates that no property was found
      if (response.data && response.data.property === null) {
        setProperty(null); // No property found, set property to null
        setError(null); // Clear any existing errors
        console.log(response.data.message); // Optionally log the message
      } else if (response.data && response.data.property) {
        setProperty(response.data.property); // Update property state with the response's property
        setError(null); // Clear any existing errors
      }
  
      console.log(response.data); // Log the entire response for debugging
    } catch (error) {
      console.error('Error fetching rented properties', error);
      setError('Failed to fetch rented properties.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No property data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollContainer}>
        {property.images.length > 0 ? (
          property.images.map((image, index) => (
            <Image
              key={index}
              source={{uri: image.uri}}
              style={[styles.image, {width: screenWidth}]} // Adjust the image width to match screen width
            />
          ))
        ) : (
          <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={[styles.image, {width: screenWidth}]}
          />
        )}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.propertyName}>{property.propertyName}</Text>
          <Text style={styles.propertyCategory}>{property.category}</Text>
        </View>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={30}
            color={Colors.primary}
          />
          <Text style={styles.propertyLocation}>{property.location}</Text>
        </View>
        <View style={styles.rentRow}>
          <MaterialCommunityIcons
            name="cash"
            size={30}
            color={Colors.primary}
          />
          <Text style={styles.propertyRent}>{property.rentPrice} / Month</Text>
        </View>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.propertyDescription}>
          {property.propertyDescription}
        </Text>

        <Text style={styles.featuresTitle}>Features</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuresScrollContainer}>
          {property.bedrooms && (
            <View style={styles.featureTile}>
              <MaterialCommunityIcons
                name="bed"
                size={30}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>
                {property.bedrooms} Bedrooms
              </Text>
            </View>
          )}
          {property.bathrooms && (
            <View style={styles.featureTile}>
              <MaterialCommunityIcons
                name="shower"
                size={30}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>
                {property.bathrooms} Bathrooms
              </Text>
            </View>
          )}
          {property.propertySize && (
            <View style={styles.featureTile}>
              <MaterialCommunityIcons
                name="ruler"
                size={30}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>
                {property.propertySize} {property.sizeUnit}
              </Text>
            </View>
          )}
          {property.features.length > 0 &&
            property.features.map((feature, index) => (
              <View key={index} style={styles.featureTile}>
                <MaterialCommunityIcons
                  name={featureIcons[feature] || 'star-outline'}
                  size={30}
                  color={Colors.primary}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
        </ScrollView>

        <Text style={styles.locationTitle}>Location</Text>
        <LocationView
          lat={property.locationLatLng.coordinates[1]}
          long={property.locationLatLng.coordinates[0]}
        />

        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
          <Text style={styles.locationTitle}>Nearby Amenities</Text>
          <MaterialCommunityIcons
            name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <NearbyAmenities
            latitude={property.locationLatLng.coordinates[1]}
            longitude={property.locationLatLng.coordinates[0]}
          />
        )}

        <Text style={styles.locationTitle}>Listed By</Text>
        <LandlordCard propertyId={property._id} />

              </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  imageScrollContainer: {
    height: 400, // Adjust height based on your image needs
  },
  image: {
    height: 350,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    marginTop: -60,
    paddingHorizontal: 15,
    paddingBottom: 20, // Ensure space at the bottom for buttons and padding
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  propertyName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  propertyCategory: {
    fontSize: 14,
    padding: 10,
    backgroundColor: Colors.lightgrey,
    borderRadius: 20,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  propertyLocation: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 10,
  },
  propertyRent: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginLeft: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginVertical: 10,
  },
  propertyDescription: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginVertical: 10,
  },
  featuresScrollContainer: {
    flexDirection: 'row',
  },
  featureTile: {
    backgroundColor: Colors.lightgrey,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center', // Add this line to center the content
    justifyContent: 'center', // Add this line to center the content
    width: 150, // Add a fixed width to make the tile more compact
    height: 100, // Add a fixed height to make the tile more compact
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginTop: 5,
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginVertical: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20, // Added horizontal padding to ensure enough space for text
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center text vertically
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // For Android shadow effect
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  noPropertyText: {
    fontSize: 18,
    color: Colors.darkText,
  },
});


