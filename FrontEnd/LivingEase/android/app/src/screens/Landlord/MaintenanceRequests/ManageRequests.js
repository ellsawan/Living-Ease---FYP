import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import apiClient from '../../../../../../apiClient';
import MaintenanceRequestCard from './MaintenanceRequestCard'; // Import the new card component
import Colors from '../../../constants/Colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import navigation hook and useFocusEffect

const MaintenanceRequestsScreen = () => {
  const navigation = useNavigation(); // Get navigation object
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [landlordId, setLandlordId] = useState(null);

  // Fetch maintenance requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchLandlordIdAndRequests = async () => {
        try {
          const storedLandlordId = await AsyncStorage.getItem('userId'); // Get userId from AsyncStorage

          if (storedLandlordId) {
            setLandlordId(storedLandlordId); // Set landlordId in state
          } else {
            setError('User ID not found');
            setLoading(false);
            return;
          }

          // Fetch maintenance requests
          const response = await apiClient.get(`/maintenance/landlord/${storedLandlordId}/requests`);
          setRequests(response.data.data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching data. Please try again.');
          setLoading(false);
        }
      };

      fetchLandlordIdAndRequests();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleReview = (request) => {
    navigation.navigate('MaintenanceRequestReview', { request });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <MaintenanceRequestCard request={item} onReview={handleReview} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white,  // Set the background color to white
  },
});

export default MaintenanceRequestsScreen;
