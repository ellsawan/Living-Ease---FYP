import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../../../../../apiClient';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';

const { width: screenWidth } = Dimensions.get('window');

const PropertyDetails = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get the navigation object
  const { propertyId } = route.params;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true); // Set loading to true when starting to fetch data

      try {
        const response = await apiClient.get(`property/${propertyId}`);

        // Check if the response contains property data
        if (response.status === 200 && response.data.property) {
          setProperty(response.data.property);
          setError(''); // Clear error if data is successfully fetched
        } else {
          // If no property data is found
          setProperty(null); // Set property to null if not found
          setError('Property not found');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to fetch property details');
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!property) {
    return <Text style={styles.errorText}>Property not found</Text>;
  }

  const handleEdit = () => {
    navigation.navigate('EditProperty', { propertyId }); // Navigate to edit screen
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/property/${propertyId}`);
      console.log('Property deleted successfully');
      // Optionally, navigate back or to another screen after deletion
      navigation.navigate('ManageProperty', { refresh: true });
    } catch (error) {
      console.error('Error deleting property:', error);
      // Optionally, show an error message to the user
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.image} />
  );

  const renderFeature = ({ item }) => (
    <View style={styles.featureRow}>
      <MaterialCommunityIcons
        name="check-circle"
        size={20}
        color={Colors.primary}
      />
      <Text style={styles.featureText}>{item}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={property.images}
        renderItem={renderImage}
        keyExtractor={item => item.uri}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
      />

      <View style={styles.detailsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{property.propertyName}</Text>
          <View style={styles.rightContainer}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{property.category}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.value}>{property.location}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="cash"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.value}>{property.rentPrice}/Monthly</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="resize"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.detailTitle}>Area</Text>
            <Text style={styles.detailValue}>
              {property.propertySize} {property.sizeUnit}
            </Text>
          </View>
          {property.propertyType === 'Residential' && (
            <>
              {property.bedrooms !== undefined && (
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="bed"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text style={styles.detailTitle}>Bedrooms</Text>
                  <Text style={styles.detailValue}>{property.bedrooms}</Text>
                </View>
              )}
              {property.bathrooms !== undefined && (
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="shower"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text style={styles.detailTitle}>Bathrooms</Text>
                  <Text style={styles.detailValue}>{property.bathrooms}</Text>
                </View>
              )}
            </>
          )}
        </View>

        <Text style={styles.featuresTitle}>Description</Text>
        <Text style={styles.description}>{property.propertyDescription}</Text>

        {property.features && property.features.length > 0 && (
          <>
            <Text style={styles.featuresTitle}>Features</Text>
            <FlatList
              data={property.features}
              renderItem={renderFeature}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: Colors.darkText,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  imageContainer: {
    width: screenWidth,
  },
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.lightgrey,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1, // Ensure it appears above other content
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    flex: 1, // Make buttons take up available space equally
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // for Android
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 70, // Add bottom padding to ensure it doesn't overlap with the button container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: Colors.gray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.darkText,
    marginLeft: 5,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 5,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginLeft: 5,
  },
});

export default PropertyDetails;
