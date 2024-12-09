import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import fonts from '../../constants/Font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rating from '../common/Rating';
import apiClient from '../../../../../apiClient';
const Stack = createStackNavigator();
const LandlordDashboard = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const DashboardScreen = () => {
  const [ratingId, setRatingId] = useState('');

  useEffect(() => {
    const checkPendingRatings = async () => {
      try {
        const landlordId = await AsyncStorage.getItem('userId');
        if (!landlordId) {
          console.warn('Landlord ID not found');
          return;
        }

        const response = await apiClient.get(
          `/leaseagreement/check-pending-rating-landlord/${landlordId}`,
        );
        const {hasPendingRating, pendingRatings} = response.data;
        console.log('API Response:', response.data);

        if (hasPendingRating && pendingRatings.length > 0) {
          setShowRatingModal(true);
          const ratingId = pendingRatings[0]._id;
          setRatingId(ratingId);
          console.log('Rating ID:', ratingId); // Ensuring the correct ID is set
        } else {
          console.log('No pending ratings.');
        }
      } catch (error) {
        console.error('Error checking pending ratings:', error.message);
      }
    };

    checkPendingRatings();
  }, []);

  const navigation = useNavigation();
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleRatingSubmit = async ratingData => {
    try {
      console.log('Submitted rating data:', ratingData);
      const leaseId = ratingId;

      const ratingStatusResponse = await apiClient.put(
        `leaseagreement/rate-user/${leaseId}`,
        {
          ratedBy: 'landlord',
          leaseId,
        },
      );

      Alert.alert(
        'Rating Submitted',
        ratingStatusResponse.data.message || 'Thank you for your feedback!',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );

      setShowRatingModal(false); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting rating:', error.message);

      Alert.alert(
        'Submission Failed',
        'An error occurred while submitting your rating. Please try again later.',
        [{text: 'OK', onPress: () => console.log('Retry Pressed')}],
        {cancelable: true},
      );
    }
  };
  return (
    <View style={styles.container}>
      <TopBar />
      <Greeting />
      <View style={styles.cardsContainer}>
        <DashboardCard
          title="My Property"
          icon="home"
          description="View your properties"
          onPress={() => navigation.navigate('ManageProperty')}
        />
        <DashboardCard
          title="My Visits"
          icon="map"
          description="Schedule visits"
          onPress={() => navigation.navigate('ManageVisits')}
        />
        <DashboardCard
          title="My Applications"
          icon="file-document-outline"
          description="Check applications"
          onPress={() => navigation.navigate('ManageApplications')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file-cabinet"
          description="Access agreements"
          onPress={() => navigation.navigate('ManageAgreements')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="currency-usd"
          description="View payments"
          onPress={() => navigation.navigate('ManagePayments')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench-outline"
          description="Track requests"
          onPress={() => navigation.navigate('ManageRequests')}
        />
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowRatingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Rating onSubmit={handleRatingSubmit} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const DashboardCard = ({title, icon, description, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name={icon} size={32} color={Colors.primary} />
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
    shadowOffset: {width: 40, height: 40},
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
    color: Colors.blue,
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

export default LandlordDashboard;
