import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import apiClient from '../../../../../../apiClient';

const createPaymentIntent = async () => {
  try {
    const response = await apiClient.post('/payments/create-payment-intent', {
      amount: 1000, // Amount in cents
      currency: 'usd',
    });
    return response.data.clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

const SimplePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

const handlePayment = async () => {
  try {
    console.log('Starting payment process...');
    
    const clientSecret = await createPaymentIntent(); 
    console.log('Client Secret:', clientSecret);

    if (!clientSecret) {
      Alert.alert('Error', 'Unable to initialize payment');
      return;
    }

    console.log('Initializing payment sheet...');
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Living Ease',
    });

    if (initError) {z
      console.error('Error initializing payment sheet:', initError);
      Alert.alert('Error', initError.localizedMessage || initError.message);
      return;
    }

    console.log('Payment sheet initialized, presenting...');
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      console.error('Error presenting payment sheet:', paymentError);
      Alert.alert('Payment Error', paymentError.message);
    } else {
      Alert.alert('Success', 'Payment successful!');
    }
  } catch (error) {
    console.error('Payment error:', error);
    Alert.alert('Error', 'Payment failed. Please try again.');
  }
};

  

  return (
    <View>
      <Button title="Pay Rent" onPress={handlePayment} />
    </View>
  );
};

export default SimplePayment;
