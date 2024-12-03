import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import PendingPaymentCard from './PendingPaymentCard';
import PaidPaymentCard from './PaidPaymentCard';
import { useNavigation } from '@react-navigation/native';  // Import for navigation

const RentPayment = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountStatus, setAccountStatus] = useState('');
  const [stripeAccountId, setStripeAccountId] = useState(null);

  const navigation = useNavigation();
  useEffect(() => {
    fetchPayments();
  }, []);

  const checkStripeAccountStatus = async (userId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/payments/${userId}/stripe-status`);
      const { hasStripeAccount, stripeAccountId, accountStatus } = response.data;
      setAccountStatus(accountStatus || (hasStripeAccount ? 'enabled' : 'pending'));
      setStripeAccountId(stripeAccountId || null);
    } catch (error) {
      console.error('Error checking Stripe account status:', error);
      Alert.alert('Error', 'Failed to check Stripe account status.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      // Fetch Pending Payments
      const pendingResponse = await apiClient.get(`/payments/pending-landlord-payments/${userId}`);
      if (pendingResponse.status === 404) {
        // Handle no leases found gracefully
        setPendingPayments([]); // Set to empty array to show no data gracefully
      } else {
        setPendingPayments(pendingResponse.data);
      }

      // Fetch Paid Payments
      const paidResponse = await apiClient.get(`/payments/paid-landlord-payments/${userId}`);
      if (paidResponse.status === 404) {
        // Handle no leases found gracefully
        setPaidPayments([]); // Set to empty array to show no data gracefully
      } else {
        setPaidPayments(paidResponse.data);
      }

      // Check Stripe Account Status
      checkStripeAccountStatus(userId);

    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch payment data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPaymentAccount = async () => {
    if (accountStatus === 'enabled') {
      Alert.alert('Stripe Account', 'Your payment account is already set up.');
    } else {
      // Redirect to the CreateStripeAccountScreen logic
      navigation.navigate('CreateAccount');  
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={Colors.primary} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    const data = activeTab === 'Pending' ? pendingPayments : paidPayments;

    if (data.length === 0) {
      return <Text style={styles.noDataText}>No {activeTab} Payments Available</Text>;
    }

    return (
      <FlatList
        data={data}
        renderItem={({ item }) =>
          activeTab === 'Pending' ? (
            <PendingPaymentCard item={item} />
          ) : (
            <PaidPaymentCard item={item} />
          )
        }
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Pending' && styles.activeTab]}
          onPress={() => setActiveTab('Pending')}
        >
          <Text style={[styles.tabText, activeTab === 'Pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Paid' && styles.activeTab]}
          onPress={() => setActiveTab('Paid')}
        >
          <Text style={[styles.tabText, activeTab === 'Paid' && styles.activeTabText]}>Paid</Text>
        </TouchableOpacity>
      </View>

      {/* Set Payment Account Button */}
      <TouchableOpacity
        style={styles.setPaymentAccountButton}
        onPress={handleSetPaymentAccount}
      >
        <Text style={styles.setPaymentAccountText}>Set Payment Account</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
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
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.dark, // Default color for inactive tabs
  },
  activeTabText: {
    color: Colors.primary, // Active tab color
  },
  setPaymentAccountButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setPaymentAccountText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  errorText: {
    color: Colors.red,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.gray,
    marginTop: 20,
  },
});

export default RentPayment;
