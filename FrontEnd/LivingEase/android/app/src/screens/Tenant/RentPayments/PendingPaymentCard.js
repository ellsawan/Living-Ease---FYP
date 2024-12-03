import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import apiClient from '../../../../../../apiClient'; // Adjust the path as necessary

const PendingPaymentCard = ({ propertyId, month, dueAmount, onPayRent }) => {
  const [propertyImage, setPropertyImage] = useState(null);
  const [propertyAddress, setPropertyAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/property/${propertyId}`);
        if (response.status === 200) {
          // Assuming images is an array and you want to extract the first image's uri
          const images = response.data.property.images || [];
          const address=response.data.property.propertyName;
          if (images.length > 0) {
            // Extract URI of the first image object
            const imageUri = images[0].uri || images[0].imageUri; // Adjust if there's a different key for URI
            setPropertyImage(imageUri);
            setPropertyAddress(address) // Set only the first image's URI
          }
        } else {
          Alert.alert('Error', 'Unable to fetch property details.');
        }
      } catch (error) {
        console.error('Error fetching property details:', error.message);
        Alert.alert('Error', 'Failed to load property data.');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  return (
    <View style={styles.paymentCard}>
      <View style={styles.cardHeader}>
        {/* Render the extracted image on the left */}
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : propertyImage ? (
          <Image source={{ uri: propertyImage }} style={styles.propertyImage} />
        ) : (
          <Text>No image available</Text>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.paymentTitle}>Property: {propertyAddress}</Text>
          <Text style={styles.paymentDetail}>Month: {month}</Text>
          <Text style={styles.paymentDetail}>Due Amount: {dueAmount} PKR</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={onPayRent}>
        <Text style={styles.payButtonText}>Pay Rent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentCard: {
    backgroundColor: Colors.background,
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', // To display image and text side by side
    alignItems: 'center',
  },
  propertyImage: {
    width: 100,  // Small square size
    height: 100, // Small square size
    borderRadius: 8,
    marginRight: 10, // Space between image and text
  },
  textContainer: {
    flex: 1, // Make the text container take up the remaining space
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  paymentDetail: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
    marginTop: 5,
  },
  payButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
});

export default PendingPaymentCard;
