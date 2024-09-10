import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../../../../../../apiClient';
import Colors from '../../../constants/Colors';
import PropertyCard from './PropertyCard';
import fonts from '../../../constants/Font';

const ManageProperty = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get('property/owner');
      setProperties(response.data.properties);
    } catch (error) {
      setError('No Properties Added');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProperties();
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddProperty = () => {
    navigation.navigate('AddProperty');
  };

  const handlePropertyPress = (property) => {
    setSelectedPropertyId(property._id);
    navigation.navigate('PropertyDetails', { propertyId: property._id });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={handlePropertyPress}
              isSelected={item._id === selectedPropertyId}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddProperty}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: Colors.white,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: Colors.primary, 
    width: 60, 
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  errorText: {
    color: Colors.darkText,
    fontFamily: fonts.bold,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ManageProperty;
