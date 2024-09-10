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
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationView from './LocationView';
import NearbyAmenities from './NearbyAmenities';
import LandlordCard from './LandlordCard';

const PropertyDetails = ({route, navigation}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {propertyId} = route.params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const {width: screenWidth} = Dimensions.get('window'); // Get screen width for images

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await apiClient.get(`property/${propertyId}`);
        setProperty(response.data.property);
        // Fetch initial favorite status
        const favoriteResponse = await apiClient.get(
          `/tenant/favorites/${propertyId}`,
        );
        setIsFavorited(favoriteResponse.data.isFavorited);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleFavoritePress = async () => {
    try {
      if (isFavorited) {
        // Remove from favorites
        await apiClient.delete('/tenant/favorites', {data: {propertyId}});
      } else {
        // Add to favorites
        await apiClient.post('/tenant/favorites', {propertyId});
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={{marginRight: 15}}>
          <MaterialCommunityIcons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleFavoritePress, isFavorited]);

  const handleScheduleVisit = () => {
    // Handle scheduling visit here
    console.log('Schedule Visit button pressed');
  };

  const handleSendApplication = () => {
    // Handle sending application here
    console.log('Send Application button pressed');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noPropertyText}>Property not found.</Text>
      </View>
    );
  }

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
        <LandlordCard propertyId={propertyId} />

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: Colors.primary}]}
            onPress={handleScheduleVisit}>
            <Text style={styles.actionButtonText}>Schedule Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: Colors.primary}]}
            onPress={handleSendApplication}>
            <Text style={styles.actionButtonText}>Apply for Rent</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 18,
    fontFamily: fonts.regular,
    color: Colors.gray,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 5,
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

export default PropertyDetails;
