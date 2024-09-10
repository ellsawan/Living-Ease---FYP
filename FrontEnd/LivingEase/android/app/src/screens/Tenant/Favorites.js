import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import PropertyCard from './PropertyCard';
import fonts from '../../constants/Font';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);

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
    fetchFavorites();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const handlePropertyPress = (propertyId) => {
    navigation.navigate('PropertyDetails', { propertyId });
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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                onPress={handlePropertyPress}
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  compareButtonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
});

export default FavoritesScreen;
