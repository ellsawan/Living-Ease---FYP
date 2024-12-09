import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';

const ServiceProviderCard = ({ bid, onAssign, onReject, onViewProfile }) => {
  const { amount, serviceProviderDetails } = bid;
  const { services, userDetails } = serviceProviderDetails;
  const { firstName, lastName, email } = userDetails;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.providerName}>{firstName} {lastName}</Text>
      </View>

      <View style={styles.bidDetails}>
        <Text style={styles.bidAmount}>Bid Amount: ${amount}</Text>
      </View>

      {/* Assign, Reject, and View Profile Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
          <Text style={styles.buttonText}>Assign Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewProfile}>
        <Text style={styles.viewDetailsText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // For shadow effect on Android
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1, // iOS shadow
    shadowOffset: { width: 0, height: 5 }, // iOS shadow
    shadowRadius: 10, // iOS shadow
  },
  cardHeader: {
    marginBottom: 10,
  },
  providerName: {
    fontSize: 18,
    fontFamily: fonts.bold, // Use fonts.bold
    color: Colors.primary,
  },
  bidDetails: {
    marginVertical: 2,
  },
  bidAmount: {
    fontSize: 18,
    fontFamily: fonts.bold, // Use fonts.bold
    color: '#28a745', // Green color for bid amount
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  assignButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545', // Red color for Reject button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  viewDetailsButton: {
    padding: 10,
    borderColor: Colors.primary, // Blue border color for button
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: Colors.primary,
    fontFamily: fonts.bold, // Use fonts.bold for button text
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.bold, // Use fonts.bold for button text
  },
});

export default ServiceProviderCard;
