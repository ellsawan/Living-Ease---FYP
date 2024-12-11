import React, { useState } from 'react';
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

  // Fetch maintenance requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchLandlordIdAndRequests = async () => {
        try {
          const storedLandlordId = await AsyncStorage.getItem('userId'); // Get userId from AsyncStorage

          if (!storedLandlordId) {
            setRequests([]); // No landlord ID means no requests to display
            setLoading(false);
            return;
          }

          const response = await apiClient.get(`/maintenance/landlord/${storedLandlordId}/requests`);
          setRequests(response.data.data || []); // Set empty array if no data
        } catch (error) {
          if (
            error.response &&
            error.response.data.message === "No properties found for this landlord."
          ) {
            setRequests([]); // Gracefully handle "No properties" error without logging
          } else {
            console.error('Unexpected error fetching maintenance requests:', error);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchLandlordIdAndRequests();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <View style={styles.container}>
      {requests.length === 0 ? (
        <Text style={styles.noRequestsText}>No maintenance requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MaintenanceRequestCard
              request={item}
              onReview={() => navigation.navigate('MaintenanceRequestReview', { request: item })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white, // Set the background color to white
  },
  noRequestsText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.dark,
    marginTop: 20,
  },
});

export default MaintenanceRequestsScreen;
