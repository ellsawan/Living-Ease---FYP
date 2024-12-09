import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Colors from '../../constants/Colors'; // Assuming you have a color file
import fonts from '../../constants/Font'; // Assuming you have a font file
import axios from 'axios'; // Import axios for HTTP requests
import apiClient from '../../../../../apiClient';

const MaintenanceRequestDetailsScreen = ({ route }) => {
  const { request } = route.params; // Destructure the 'request' data passed from the previous screen
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null); // State to store userId

  // Function to retrieve userId from AsyncStorage
  const getUserIdFromAsyncStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.log('No userId found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching userId from AsyncStorage:', error);
    }
  };

  // Fetch userId when the component mounts
  useEffect(() => {
    getUserIdFromAsyncStorage();
  }, []);

  // Function to handle bid submission
  const handlePlaceBid = async () => {
    const bid = parseFloat(bidAmount.trim());
    if (isNaN(bid) || bid <= 0) {
      setErrorMessage('Please enter a valid bid amount');
      return;
    }
    setErrorMessage(''); // Clear any previous error message

    if (!userId) {
      setErrorMessage('User is not logged in.');
      return;
    }

    try {
      // Send the bid to the backend
      const response = await apiClient.post('/bid/place-bid', {
        bidAmount: bid,
        maintenanceRequestId: request._id,
        userId: userId, // Use the retrieved userId
      });

      // Handle the response
      alert(response.data.message);
    } catch (error) {
      setErrorMessage('Failed to place bid. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Request Details */}
        <View style={styles.card}>
          <Text style={styles.title}>{request.requestTitle}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.detailText}>{request.description}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Tenant:</Text>
            <Text style={styles.detailText}>
              {request.tenantId.firstName} {request.tenantId.lastName}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Property:</Text>
            <Text style={styles.detailText}>
              {request.propertyId.propertyName}, {request.propertyId.location}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.detailText}>{request.category}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.detailText}>{request.priority}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.detailText}>{new Date(request.createdAt).toLocaleDateString()}</Text>
          </View>
          
        </View>

        {/* Bid Section */}
        <View style={styles.bidContainer}>
          <Text style={styles.bidLabel}>Place Your Bid:</Text>
          <TextInput
            style={styles.bidInput}
            placeholder="Enter bid amount"
            keyboardType="numeric"
            value={bidAmount}
            onChangeText={setBidAmount}
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.bidButton} onPress={handlePlaceBid}>
            <Text style={styles.buttonText}>Place Bid</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    marginBottom: 15,
    color: Colors.primary,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontFamily: fonts.bold,
    color: Colors.primary,
    fontSize: 16,
    width: 120,
    marginRight: 10,
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  bidContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 5,
    elevation: 3,
  },
  bidLabel: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 10,
  },
  bidInput: {
    borderColor: '#ccc',
    fontFamily: fonts.regular,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontSize: 16,
    marginBottom: 20,
  },
  bidButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontFamily: fonts.semiBold,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default MaintenanceRequestDetailsScreen;
