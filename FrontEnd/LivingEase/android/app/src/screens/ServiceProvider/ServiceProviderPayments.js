import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const CreateStripeAccountScreen = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [onboardingLink, setOnboardingLink] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          checkStripeAccountStatus(storedUserId);
        } else {
          Alert.alert('Error', 'User ID not found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching userId:', error);
        Alert.alert('Error', 'Failed to fetch User ID.');
      }
    };

    fetchUserId();
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

  const fetchRequests = async () => {
    if (userId) {
      try {
        const response = await apiClient.get(`/serviceprovider/assigned-requests/${userId}`);
  
        // Check if there are no requests (404 not found)
        if (response.status === 404 || response.data.message === 'No assigned maintenance requests found.') {
          setMaintenanceRequests([]); // Set to empty list if no data is found
        } else if (response.data.message === 'Assigned requests retrieved successfully.') {
          setMaintenanceRequests(response.data.data); // Set data if request is successful
        }
      } catch (error) {
        // Handle other errors silently without alert or console log
        if (error.response && error.response.status !== 404) {
          Alert.alert('Error', 'Failed to fetch assigned requests.');
        }
      }
    }
  };
  
  
  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const filteredRequests = maintenanceRequests.filter(
    (request) => request.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateStripeAccount = async () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'User ID is required.');
      return;
    }
    if (accountStatus === 'enabled') {
      Alert.alert('Account Already Created', 'You already have an account.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/payments/create-stripe-account', { userId });
      const { onboardingLink } = response.data;
      if (onboardingLink) {
        setOnboardingLink(onboardingLink);
      } else {
        Alert.alert('Error', 'Failed to retrieve onboarding link.');
      }
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      Alert.alert('Error', 'Failed to create Stripe account.');
    } finally {
      setLoading(false);
    }
  };

  const markRequestAsCompleted = async (requestId) => {
    try {
      const response = await apiClient.put(`/maintenance/${requestId}/status`, { status: 'Completed' });
      if (response.data) {
        setMaintenanceRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'completed' } : request
          )
        );
      }
    } catch (error) {
      console.error('Error marking request as completed:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Create Account Button Above Tabs */}
      <TouchableOpacity
        style={[styles.button]}
        onPress={handleCreateStripeAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
          onPress={() => handleTabChange('assigned')}
        >
          <Text style={styles.tabText}>Assigned</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => handleTabChange('completed')}
        >
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Maintenance requests list */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No {activeTab} maintenance requests found.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.requestTitle}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardAmount}>Bid Amount: ${item.bidAmount}</Text>
            <Text style={styles.cardPriority}>Priority: {item.priority}</Text>
            <Text style={styles.cardCategory}>Category: {item.category}</Text>
            <Text style={styles.cardTenant}>
              Tenant: {item.tenantId.firstName} {item.tenantId.lastName}
            </Text>
            <Text style={styles.cardLocation}>
              Property Location: {item.propertyId.location}
            </Text>
            <Text style={styles.cardLocation}>
              Payment Status: {item.paymentStatus}
            </Text>

            {activeTab === 'assigned' && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => markRequestAsCompleted(item._id)}
              >
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* WebView Modal */}
      <Modal visible={!!onboardingLink} animationType="slide" transparent={false}>
        <View style={styles.webviewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOnboardingLink(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: onboardingLink }}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator style={styles.loadingIndicator} size="large" color="#007bff" />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: fonts.bold,
  },
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  cardPriority: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  cardCategory: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  cardTenant: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  cardLocation: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  completeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.white,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.dark,
    fontFamily: fonts.bold,
  },
  webviewContainer: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateStripeAccountScreen;
