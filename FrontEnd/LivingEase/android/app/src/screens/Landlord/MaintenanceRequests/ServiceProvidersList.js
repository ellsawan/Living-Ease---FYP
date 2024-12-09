import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../../../../../../apiClient';
import ServiceProviderCard from './ServiceProviderCard'; // Import the ServiceProviderCard
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import axios from 'axios'; // Import axios

// Function to assign a service provider to a maintenance request
const assignServiceProvider = async (maintenanceRequestId, serviceProviderId, bidAmount, navigation) => {
  try {
    const response = await apiClient.post('/maintenance/assign', {
      maintenanceRequestId,
      serviceProviderId,
      bidAmount,  // Send the bid amount as part of the request body
    });

    console.log('Service provider assigned:', response.data);
    Alert.alert('Success', 'Service provider assigned successfully');

    // Communicate the status back to the previous screen
    navigation.goBack({
      assigned: true,  // Add an 'assigned' flag to indicate the assignment status
      serviceProviderId,  // Optionally pass the assigned service provider's ID
    });
  } catch (error) {
    console.error('Error assigning service provider:', error.response ? error.response.data : error.message);
    Alert.alert('Error', 'Failed to assign service provider.');
  }
};

const ServiceProviderList = ({ route, navigation }) => {
  const { maintenanceRequestId } = route.params; // Retrieve the maintenanceRequestId from route params
  const [serviceProviders, setServiceProviders] = useState([]); // State to store service providers
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch service provider bids using the maintenanceRequestId
    const fetchServiceProviders = async () => {
      try {
        const response = await apiClient.get(`/bid/bids/${maintenanceRequestId}`);
        setServiceProviders(response.data.bids || []);
      } catch (error) {
        console.error('Error fetching service providers:', error);
        Alert.alert('Error', 'Failed to fetch service provider bids.');
      } finally {
        setLoading(false); // Set loading to false after data is fetched or if error occurs
      }
    };

    fetchServiceProviders();
  }, [maintenanceRequestId]);

  // Handle Update Status Request
  const handleUpdateStatusRequest = () => {
    apiClient
      .put(`/maintenance/${maintenanceRequestId}/status`, { status: 'Approved' })
      .then(response => {
        Alert.alert('Success', 'Maintenance request is posted to Service Providers for bidding!');
      })
      .catch(error => {
        console.error('Error updating maintenance request status:', error);
        Alert.alert('Error', 'Failed to update maintenance request status.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Update Status Button */}
      <TouchableOpacity style={styles.updateStatusButton} onPress={handleUpdateStatusRequest}>
        <Text style={styles.updateStatusButtonText}>Post Request for Bidding</Text>
      </TouchableOpacity>

      {/* Display loading spinner if data is still loading */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          {/* If no service providers available */}
          {serviceProviders.length === 0 ? (
            <Text style={styles.noProvidersText}>No offers from service providers.</Text>
          ) : (
            serviceProviders.map(bid => (
              <ServiceProviderCard
                key={bid._id}
                bid={bid}
                onAssign={() => assignServiceProvider(maintenanceRequestId, bid.serviceProviderId, bid.amount, navigation)} // Pass navigation to the function
                onReject={() => console.log('Rejected')}
                onViewProfile={() =>
                  navigation.navigate('ServiceProviderProfile', { serviceProviderId: bid.serviceProviderId })
                }
              />
            ))
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff', // Set the background color to white
  },
  noProvidersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
    fontFamily: fonts.regular,
  },
  updateStatusButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  updateStatusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});

export default ServiceProviderList;
