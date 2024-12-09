import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import SearchBar from './SearchBar';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../apiClient';
import Rating from '../common/Rating';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [showRatingModal, setShowRatingModal] = useState(false); // Modal visibility state
  const [ratingId, setRatingId] = useState(''); 

  useEffect(() => {
    const checkPendingRatings = async () => {
      try {
        const tenantId = await AsyncStorage.getItem('userId');
        if (!tenantId) {
          console.warn('Tenant ID not found');
          return;
        }

        const response = await apiClient.get(`/leaseagreement/check-pending-rating/${tenantId}`);
        const { hasPendingRating ,pendingRatings} = response.data;
        console.log(response.data._id)

        if (hasPendingRating) {
          setShowRatingModal(true);
           // Show the modal if there are pending ratings
           const ratingId = pendingRatings[0]._id;
           setRatingId(ratingId)
      console.log('Rating ID:', ratingId);  // Show the modal if there are pending ratings
        }
      } catch (error) {
        console.error('Error checking pending ratings:', error.message);
      }
    };

    checkPendingRatings();
  }, []);

const handleRatingSubmit = async (ratingData) => {
  try {
    console.log('Submitted rating data:', ratingData);

    const leaseId = ratingId; // Assuming ratingData includes leaseId
    const ratingStatusResponse = await apiClient.put(
      `leaseagreement/rate-user/${leaseId}`,
      {
        ratedBy: 'tenant', // Adjust based on the user's role
        leaseId,
      }
    );

    // Show a success alert
    Alert.alert(
      'Rating Submitted',
      ratingStatusResponse.data.message || 'Thank you for your feedback!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );

    setShowRatingModal(false); // Close the modal after submission
  } catch (error) {
    console.error('Error submitting rating:', error.message);

    // Show an error alert
    Alert.alert(
      'Submission Failed',
      'An error occurred while submitting your rating. Please try again later.',
      [{ text: 'OK', onPress: () => console.log('Retry Pressed') }],
      { cancelable: true }
    );
  }
};

  return (
    <View style={styles.container}>
      <TopBar />
      <Greeting />
      <SearchBar />
      <View style={styles.cardsContainer}>
        <DashboardCard
          title="My Property"
          icon="home"
          description="View details of your rental home."
          onPress={() => navigation.navigate('MyProperty')}
        />
        <DashboardCard
          title="My Visits"
          icon="map"
          description="View upcoming property visits."
          onPress={() => navigation.navigate('MyVisits')}
        />
        <DashboardCard
          title="My Applications"
          icon="file-document-outline"
          description="Track rental applications."
          onPress={() => navigation.navigate('MyApplications')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file-cabinet"
          description="Access your lease documents."
          onPress={() => navigation.navigate('MyLeaseAgreements')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="currency-usd"
          description="Review your payment history."
          onPress={() => navigation.navigate('ManagePayments')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench-outline"
          description="Report issues."
          onPress={() => navigation.navigate('ManageRequests')}
        />
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Rating onSubmit={handleRatingSubmit} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DashboardCard = ({ title, icon, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name={icon} size={30} color={Colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 20,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '48%',
    height: 160,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    marginTop: 10,
    marginBottom: 5,
    color: Colors.darkText,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 5,
  },
});

export default DashboardScreen;
