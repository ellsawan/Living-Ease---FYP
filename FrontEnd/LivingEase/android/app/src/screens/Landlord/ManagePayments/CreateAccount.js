import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import apiClient from '../../../../../../apiClient';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';

const CreateStripeAccountScreen = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [onboardingLink, setOnboardingLink] = useState(null);

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

  const handleCreateStripeAccount = async () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'User ID is required.');
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

  return (
    <View style={styles.container}>
      {accountStatus === 'pending' && (
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          onPress={handleCreateStripeAccount}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      )}
      <View style={styles.content}>
    

        {accountStatus === 'enabled' ? (
          <>
            <Text style={styles.infoText}>
              Your Stripe account is already enabled! 🎉
            </Text>
       
          </>
        ) : (
          accountStatus === null && <ActivityIndicator size="large" color="#007bff" />
        )}
      </View>

      {/* WebView Modal */}
      <Modal
        visible={!!onboardingLink}
        animationType="slide"
        transparent={false}>
        <View style={styles.webviewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOnboardingLink(null)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: onboardingLink }}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                style={styles.loadingIndicator}
                size="large"
                color="#007bff"
              />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily:fonts.bold,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:fonts.bold,
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
  infoText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily:fonts.bold,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateStripeAccountScreen;
