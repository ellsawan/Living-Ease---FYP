import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../../apiClient';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import PendingPaymentCard from './PendingPaymentCard';
import PaidPaymentCard from './PaidPaymentCard';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

const RentPayment = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]); // New state for paid payments
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // State to manage active tab
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [landlordId, setLandlordId] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingPayments();
    } else if (activeTab === 'paid') {
      fetchPaidPayments();
    }
  }, [activeTab]);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const tenantId = await AsyncStorage.getItem('userId');
      if (!tenantId) throw new Error('Tenant ID not found.');

      const response = await apiClient.get(`/payments/pending-payments/${tenantId}`);
      if (response.status === 200) {
        setPendingPayments(response.data || []);
      } else {
        Alert.alert('Error', 'Unable to fetch payments.');
      }
    } catch (error) {
      console.error('Error fetching payments:', error.message);
      Alert.alert('Error', 'Failed to load payment data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaidPayments = async () => {
    setLoading(true);
    try {
      const tenantId = await AsyncStorage.getItem('userId');
      if (!tenantId) throw new Error('Tenant ID not found.');

      const response = await apiClient.get(`/payments/paid-payments/${tenantId}`); // New route for paid payments
      if (response.status === 200) {
        console.log('paid',response.data)
        setPaidPayments(response.data || []);
      } else {
        Alert.alert('Error', 'Unable to fetch paid payments.');
      }
    } catch (error) {
      console.error('Error fetching paid payments:', error.message);
      Alert.alert('Error', 'Failed to load paid payment data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRent = async (leaseId, dueAmount, landlordId, stripeAccountId, month) => {
    setPaymentProcessing(true);
  
    try {
      const tenantId = await AsyncStorage.getItem('userId');
      if (!tenantId) throw new Error('Tenant ID not found.');
  // Check if the landlord has set up their payment
  if (!stripeAccountId) {
    Alert.alert(
      'Payment Error',
      'The landlord has not set up their payment account yet. Please contact the landlord for assistance.'
    );
    setPaymentProcessing(false);
    return;
  }
      // Step 1: Create the payment on the backend
      const response = await apiClient.post('/payments/process-rent-payment', {
        leaseId,
        rentDue: dueAmount,
        tenantId,
        landlordId,
        landlordStripeId: stripeAccountId,
        month,
      });
  
      if (response.status === 200) {
        console.log('Payment creation response:', response);
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
  
        // Step 2: Initialize the payment sheet with the correct clientSecret
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Living Ease',
        });
  
        if (initError) {
          Alert.alert('Error', 'Could not initialize payment sheet.');
          setPaymentProcessing(false);
          return;
        }
  
        // Step 3: Present the payment sheet
        const { error: sheetError } = await presentPaymentSheet();
  
        if (sheetError) {
          if (sheetError.code === 'Canceled') {
            Alert.alert('Payment Canceled', 'You have canceled the payment flow.');
          } else {
            Alert.alert('Payment Failed', sheetError.message);
          }
        } else {
          Alert.alert('Success', 'Payment successful!');
  
          // Step 4: Send the PaymentIntent ID to confirm payment on the backend
          const paymentIntentId = clientSecret.split('_secret')[0]; // Extract PaymentIntent ID
  
          const confirmResponse = await apiClient.post('/payments/confirm-payment', {
            paymentIntentId, // Correct PaymentIntent ID
            paymentStatus: 'completed', // Confirm that the payment succeeded
          });
  
          if (confirmResponse.status === 200) {
            fetchPendingPayments(); // Refresh pending payments after success
          } else {
            Alert.alert('Error', 'Could not confirm payment.');
          }
        }
      } else {
        Alert.alert('Error', 'Could not create payment.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment initialization failed.');
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  

  const renderPaidPaymentItem = ({ item }) => (
    <PaidPaymentCard paymentData={item} />
  );
  

  const renderPendingPaymentItem = ({ item }) => (
    <PendingPaymentCard
      propertyId={item.propertyId}
      month={item.month}
      dueAmount={item.dueAmount}
      onPayRent={() => handlePayRent(item.leaseId, item.dueAmount, item.landlordId, item.stripeAccountId, item.month)}
    />
  );


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
          onPress={() => setActiveTab('paid')}
        >
          <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>Paid</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'pending' ? (
        <View style={styles.listContainer}>
          {pendingPayments.length > 0 ? (
            <FlatList
              data={pendingPayments}
              keyExtractor={(item, index) => `${item.leaseId}-${index}`}
              renderItem={renderPendingPaymentItem}
            />
          ) : (
            <Text style={styles.noPaymentsText}>No pending payments available.</Text>
          )}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {paidPayments.length > 0 ? (
            <FlatList
              data={paidPayments}
              keyExtractor={(item, index) => `${item.leaseId}-${index}`}
              renderItem={renderPaidPaymentItem}  // Render paid payments here
            />
          ) : (
            <Text style={styles.noPaymentsText}>No paid payments available.</Text>
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: 10,  
    paddingTop: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,  // Adjusts padding for list container to prevent clipping
  },
  noPaymentsText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.regular,
    marginTop: 20,
  },
});

export default RentPayment;
