import React, { useEffect, useState } from 'react'; 
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import ServiceProviderPaymentCard from './ServiceProviderPaymentCard';  // Import the new component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
const MaintenanceRequestReview = ({ route, navigation }) => {
  const { request } = route.params;
  const [loading, setLoading] = useState(false); // Loading state for fetching service provider details
  const [serviceProvider, setServiceProvider] = useState(null); 
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);// State to store service provider details
  const isFocused = useIsFocused();
  // Format the date
  const formattedDate = new Date(request.createdAt).toLocaleDateString();

  // Function to fetch service provider details
  const fetchServiceProviderDetails = async () => {
    try {
      const response = await apiClient.get(`/maintenance/service-provider/${request._id}`);
      console.log('Service provider details fetched successfully:', response.data);
  
      // Access and log specific details
      const { maintenanceRequest, serviceProvider } = response.data.data;
      console.log('Service Provider ID:', serviceProvider._id);
      console.log('Service Provider Name:', `${serviceProvider.firstName} ${serviceProvider.lastName}`);
      console.log('Contact Number:', serviceProvider.contactNumber);
      console.log('Stripe Account ID:', serviceProvider.stripeAccountId);
      console.log('Is rated:', maintenanceRequest.isRated);
  
      // Set the fetched service provider details in state
      setServiceProvider({ 
        ...serviceProvider, 
        bidAmount: maintenanceRequest.bidAmount,
        requestTitle: maintenanceRequest.requestTitle,
        description: maintenanceRequest.description
      });

    } catch (error) {
      console.error('Error fetching service provider details:', error);
      Alert.alert('Error', 'Failed to fetch service provider details.');
    }
  };
  useEffect(() => {
    if (isFocused) {
      // Trigger data refresh when the screen comes into focus
      if (request.status === 'Assigned' || request.status === 'Completed') {
        fetchServiceProviderDetails();
      }
    }
  }, [isFocused, request.status]);

  const handleReject = () => {
    apiClient
      .put(`/maintenance/${request._id}/status`, { status: 'Rejected' })
      .then(response => {
        Alert.alert('Success', 'Maintenance request is rejected!');
      })
      .catch(error => {
        console.error('Error updating maintenance request status:', error);
        Alert.alert('Error', 'Failed to update maintenance request status.');
      });
  };

  const handleRating = async (rating) => {
    try {
      // You can send the rating to the backend via an API call
      const response = await apiClient.post('/rating/rateserviceprovider', {
        rating,
        ratedEntityId: serviceProvider._id, // Make sure the service provider has an id field or use another identifier
        role: 'ServiceProvider', 
        maintenanceRequestId: request._id,// Role or entity type to specify who is being rated
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'An error occurred while submitting your rating.');
    }
  };

  const handleFindServiceProviders = () => {
    // Pass the maintenanceRequestId to the ServiceProvidersList screen
    navigation.navigate('ServiceProvidersList', { maintenanceRequestId: request._id });
  };
  const handlePayNow = async () => {
    setPaymentProcessing(true);
  
    try {
      // Retrieve landlordId from AsyncStorage
      const landlordId = await AsyncStorage.getItem('userId');
      if (!landlordId) {
        Alert.alert('Error', 'Landlord ID not found.');
        setPaymentProcessing(false);
        return;
      }
  
      const response = await apiClient.post('/serviceprovider/process-service-payment', {
        maintenanceRequestId: request._id,
        amount: request.bidAmount,
        landlordId: landlordId,
        serviceProviderStripeId: serviceProvider.stripeAccountId,
      });
  
      console.log('Payment API Response:', response.data); // Debugging log
  
      if (response.status === 200) {
        const { clientSecret } = response.data;
  
        if (!clientSecret) {
          Alert.alert('Error', 'No client secret returned.');
          setPaymentProcessing(false);
          return;
        }
  
        // Extract paymentIntentId from clientSecret
        const paymentIntentId = clientSecret.split('_secret')[0];
  
        if (!paymentIntentId || !paymentIntentId.startsWith('pi_')) {
          console.error('Invalid paymentIntentId:', paymentIntentId);
          Alert.alert('Error', 'Invalid paymentIntentId.');
          setPaymentProcessing(false);
          return;
        }
  
        console.log('Extracted Payment Intent ID:', paymentIntentId);
  
        // Initialize the payment sheet
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Living Ease',
        });
  
        if (initError) {
          console.log('Payment Sheet Initialization Error:', initError);
          Alert.alert('Error', 'Could not initialize payment sheet.');
          setPaymentProcessing(false);
          return;
        }
  
        // Present the payment sheet
        const { error: sheetError } = await presentPaymentSheet();
  
        if (sheetError) {
          console.log('Payment Sheet Error:', sheetError);
          Alert.alert('Error', 'Payment failed.');
        } else {
          Alert.alert('Success', 'Payment successful!');
          
          // Confirm the payment status
          const confirmResponse = await apiClient.post('/serviceprovider/confirm-service-payment', {
            paymentIntentId: paymentIntentId, // Use the extracted paymentIntentId
            paymentStatus: 'completed',
            requestId: request._id,
          });
  
          console.log('Confirm Payment Response:', confirmResponse.data);
        }
      } else {
        Alert.alert('Error', 'Could not create payment.');
      }
    } catch (error) {
      console.log('Payment Initialization Error:', error);
      Alert.alert('Error', 'Payment initialization failed.');
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{request.requestTitle}</Text>
        <Text style={styles.description}>{request.description}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <View style={[styles.badge, styles.categoryBadge]}>
            <Text style={styles.badgeText}>{request.category}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Priority:</Text>
          <View style={[styles.badge, styles.priorityBadge]}>
            <Text style={styles.badgeText}>{request.priority}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.badge, styles.statusBadge]}>
            <Text style={styles.badgeText}>{request.status}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Tenant:</Text>
          <Text style={styles.value}>
            {request.tenantId.firstName} {request.tenantId.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Property Name:</Text>
          <Text style={styles.value}>{request.propertyName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Property Location:</Text>
          <Text style={styles.value}>{request.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text style={styles.value}>{request.paymentStatus}</Text>
        </View>
      </View>

      {(request.status === 'Assigned' || request.status === 'Completed') && serviceProvider && (
  <ServiceProviderPaymentCard serviceProvider={serviceProvider} status={request.status} paymentStatus={request.paymentStatus} isRated={request.isRated} onPayNow={handlePayNow} onRating={handleRating}/>
)}

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
  {request.status !== 'Assigned' && request.status !== 'Completed' && (
    <>
      {/* Find Service Providers Button */}
      <TouchableOpacity style={[styles.button, styles.findProvidersButton]} onPress={handleFindServiceProviders}>
        <Text style={styles.buttonText}>Find Service Providers</Text>
      </TouchableOpacity>

      {/* Reject Button */}
      <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject Request</Text>
      </TouchableOpacity>
    </>
  )}
</View>

    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.dark,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryBadge: {
    backgroundColor: '#B3D9F7', // Pastel Blue
  },
  priorityBadge: {
    backgroundColor: '#FFCC80', // Pastel Orange
  },
  statusBadge: {
    backgroundColor: '#A8E6A1', // Pastel Green
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  rejectButton: {
    backgroundColor: '#FF0000', // Red color code
    borderRadius: 25,
    marginTop: 10,
  },
  findProvidersButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  serviceProviderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 20,
  },
  paymentCardContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginTop: 10,
  },
  paymentCardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginBottom: 5,
  },
  paymentCardText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginBottom: 5,
  },
});

export default MaintenanceRequestReview;
