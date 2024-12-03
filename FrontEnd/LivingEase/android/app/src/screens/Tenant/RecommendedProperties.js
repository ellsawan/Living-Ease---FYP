import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../../../../../apiClient';

const Properties = ({ route, navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const fetchTenantId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setTenantId(id);
    };

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const recommendedPropertyIds = route.params.propertyIds;

        const response = await apiClient.post('/property/search/properties', {
          params: {
            propertyIds: recommendedPropertyIds,
          },
        });

        const listedProperties = response.data;
        const adjustedProperties = listedProperties.map(property => ({
          id: property._id,
          locationLatLng: property.locationLatLng,
          rentPrice: property.rentPrice,
          propertySize: property.propertySize,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          location: property.location,
          category: property.category,
          latitude: property.latitude,
          longitude: property.longitude,
          propertyName: property.propertyName,
          propertyDescription: property.propertyDescription,
          sizeUnit: property.sizeUnit,
          status: property.status,
          features: property.features,
          images: property.images,
          rentedBy: property.rentedBy,
          owner: property.owner,
        }));

        setProperties(adjustedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantId();
    fetchProperties();
  }, [route]);

  const handlePress = (propertyId, ownerId) => {
    navigation.navigate('PropertyDetails', { propertyId, ownerId, tenantId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id, item.owner)}>
      <Image
        source={{ uri: item.images.length > 0 ? item.images[0].uri : 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.propertyName} numberOfLines={1}>{item.propertyName}</Text>
        <View style={styles.row}>
          <Icon name="location" size={18} color={Colors.primary} style={styles.icon} />
          <Text style={styles.propertyLocation} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="cash" size={18} color={Colors.primary} style={styles.icon} />
          <Text style={styles.propertyPrice} numberOfLines={1}>{item.rentPrice} Rent</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        />
      ) : (
        <Text style={styles.noPropertiesText}>No properties found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 6,
    marginHorizontal: 10,
    marginVertical: 15,
    overflow: 'hidden',
    width: 350,
    height: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  propertyName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  propertyLocation: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: Colors.darkText,
  },
  propertyPrice: {
    fontSize: 14,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
  },
  noPropertiesText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.placeholdertext,
  },
});

export default Properties;
