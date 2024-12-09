import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomRating = ({ maxRating = 5, onRatingSubmit }) => {
  const [currentRating, setCurrentRating] = useState(0);

  const handleRating = (rating) => {
    setCurrentRating(rating);
    onRatingSubmit(rating); // Callback to parent component
  };

  return (
    <View style={styles.ratingRow}>
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleRating(ratingValue)}
            activeOpacity={0.7}
          >
            <Icon
              name={ratingValue <= currentRating ? 'star' : 'star-outline'}
              size={30}
              color={Colors.primary}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ServiceProviderPaymentCard = ({
  serviceProvider,
  status,
  onPayNow,
  paymentStatus,
  onRating, isRated,
}) => {
  return (
    <View style={styles.serviceProviderContainer}>
      {/* Service Provider Name with Person Icon */}
      <View style={styles.row}>
        <Icon name="person" size={20} color={Colors.primary} />
        <Text style={styles.value}>{`${serviceProvider.firstName} ${serviceProvider.lastName}`}</Text>
      </View>

      {/* Contact Number with Call Icon */}
      <View style={styles.row}>
        <Icon name="call" size={20} color={Colors.primary} />
        <Text style={styles.value}>{`${serviceProvider.contactNumber}`}</Text>
      </View>

      {/* Bid Amount with Cash Icon */}
      <View style={styles.row}>
        <Icon name="cash" size={20} color={Colors.primary} />
        <Text style={styles.value}>{serviceProvider.bidAmount} PKR</Text>
      </View>

      {/* Conditional Rendering for Buttons */}
      {paymentStatus !== 'completed' && (
        <View style={styles.buttonsContainer}>
          {status === 'Assigned' && (
            <TouchableOpacity style={[styles.button, styles.inProgressButton]}>
              <Text style={styles.buttonText}>In Progress</Text>
            </TouchableOpacity>
          )}
          {status === 'Completed' && (
            <TouchableOpacity
              style={[styles.button, styles.payNowButton]}
              onPress={onPayNow}
            >
              <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Show Custom Rating Component when Payment is Completed */}
      {paymentStatus === 'completed' && isRated ===false &&(
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rate Service Provider:</Text>
          <CustomRating maxRating={5} onRatingSubmit={onRating} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceProviderContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginLeft: 10,
  },
  buttonsContainer: {
    marginTop: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inProgressButton: {
    backgroundColor: '#FFCC00',
  },
  payNowButton: {
    backgroundColor: Colors.primary,
    width: '100%',
  },
  ratingContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 5,
  },
});

export default ServiceProviderPaymentCard;
