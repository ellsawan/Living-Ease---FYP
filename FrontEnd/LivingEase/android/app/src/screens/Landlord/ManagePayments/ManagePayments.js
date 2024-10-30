import React, { useState, useEffect } from 'react';
import { View, Button, Alert, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../../apiClient';
import { useNavigation } from '@react-navigation/native';

const ManagePaymentsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await apiClient.get(`/user/userData`, {
          headers: { Authorization: `Bearer ${userId}` },
        });
        console.log('Response:', response.data);
        
        const { stripeAccountId } = response.data;
        console.log('Fetched Stripe Account ID:', stripeAccountId);

        setStripeAccountId(stripeAccountId || null);
      } else {
        throw new Error('User ID not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to fetch user data.');
    }
  };

  const handleCreateOrEditStripeAccount = async () => {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const userData = await apiClient.get(`/user/userData`, {
        headers: { Authorization: `Bearer ${userId}` },
      });
      const { email } = userData.data;

      let response;
      if (stripeAccountId) {
        response = await apiClient.post('/payments/edit-stripe-account', {
          landlordEmail: email,
          landlordId: userId,
          stripeAccountId,
        });
      } else {
        response = await apiClient.post('/payments/create-stripe-account', {
          landlordEmail: email,
          landlordId: userId,
        });
      }

      const accountLinkUrl = response.data.url;
      navigation.navigate('CreateAccount', { accountLinkUrl });
    } catch (error) {
      console.error('Error creating/editing Stripe account:', error);
      Alert.alert('Error', 'Unable to create or edit Stripe account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>

          {/* Only show the button if the Stripe Account ID is not available */}
          {!stripeAccountId && (
            <Button
              title="Set Up Payment"
              onPress={handleCreateOrEditStripeAccount}
            />
          )}
        </>
      )}
    </View>
  );
};

export default ManagePaymentsScreen;
