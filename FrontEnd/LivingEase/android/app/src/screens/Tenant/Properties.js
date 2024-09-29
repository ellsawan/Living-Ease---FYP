import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors'; // Adjust the path as needed
import fonts from '../../constants/Font'; // Adjust the path as needed
import Icon from 'react-native-vector-icons/Ionicons'; // Adjust the path as needed
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; // Adjust the path as needed

const Properties = ({ route, navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null); // State to hold tenant ID

  useEffect(() => {
    const fetchTenantId = async () => {
      const id = await AsyncStorage.getItem('userId'); // Get tenant ID from AsyncStorage
      setTenantId(id);
    };

    const fetchProperties = async () => {
      try {
        const searchParams = route.params.searchParams;

        // Filter properties with the status 'listed'
        const listedProperties = searchParams.filter(property => property.status === 'listed');
        setProperties(listedProperties);
        console.log('Fetched properties:', listedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantId(); // Fetch tenant ID
    fetchProperties(); // Fetch properties
  }, [route]);

  // Function to handle property card press
  const handlePress = (propertyId, ownerId) => {
    console.log('Navigating to PropertyDetails with:', { propertyId, ownerId, tenantId });
    navigation.navigate('PropertyDetails', { propertyId, ownerId, tenantId }); // Pass tenantId along with propertyId and ownerId
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress(item._id, item.owner)} // Pass owner along with the property id
      >
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
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="bed" size={18} color={Colors.primary} />
              <Text style={styles.propertyDetailText}>{item.bedrooms} Bedrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcon name="bathtub" size={18} color={Colors.primary} />
              <Text style={styles.propertyDetailText}>{item.bathrooms} Bathrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="grid" size={18} color={Colors.primary} />
              <Text style={styles.propertyDetailText}>{item.propertySize} {item.sizeUnit}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          keyExtractor={(item) => item._id}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 15,
    marginVertical: 15,
    overflow: 'hidden', // Ensures rounded corners work with elevation
  },
  image: {
    width: '100%', // Full width of the container
    height: 180, // Adjust height as needed
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  propertyName: {
    fontSize: 20,
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
    fontSize: 16,
    color: Colors.darkText,
  },
  propertyPrice: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailText: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
    marginLeft: 5,
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
