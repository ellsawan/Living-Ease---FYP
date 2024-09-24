import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import PropertyCard from './PropertyCard';
import fonts from '../../constants/Font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [tenantId, setTenantId] = useState(null); // State to hold tenant ID

  const fetchTenantId = async () => {
    const id = await AsyncStorage.getItem('userId'); // Get tenant ID from AsyncStorage
    setTenantId(id);
  };

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/tenant/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      setError('Error fetching favorite properties.');
      console.error('Error fetching favorite properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantId(); // Fetch tenant ID
    fetchFavorites(); // Fetch favorite properties
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const handlePropertyPress = (propertyId, ownerId) => {
    console.log('Navigating to PropertyDetails with:', { propertyId, ownerId, tenantId });
    navigation.navigate('PropertyDetails', { propertyId, ownerId, tenantId }); // Pass tenantId along with propertyId and ownerId
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties(prevSelected => {
      if (prevSelected.includes(propertyId)) {
        return prevSelected.filter(id => id !== propertyId);
      } else if (prevSelected.length < 2) {
        return [...prevSelected, propertyId];
      }
      return prevSelected;
    });
  };

  const handleCompare = () => {
    if (selectedProperties.length === 2) {
      navigation.navigate('CompareProperties', { propertyIds: selectedProperties });
    } else {
      Alert.alert('Select Exactly Two Properties', 'Please select exactly two properties to compare.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                onPress={() => handlePropertyPress(item._id, item.owner, tenantId)} // Pass owner along with the property id
                onSelect={handleSelectProperty}
                isSelected={selectedProperties.includes(item._id)}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer} // Apply padding to the list
          />
          <TouchableOpacity
            style={styles.compareButton}
            onPress={handleCompare}
          >
            <Text style={styles.compareButtonText}>Compare</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: 5,
    paddingTop: 20, // Add top padding to create space
  },
  errorText: {
    color: Colors.darkText,
    fontFamily: fonts.bold,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  compareButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, 
  },
  compareButtonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
    fontSize: 18,
   
  },
});

export default FavoritesScreen;
