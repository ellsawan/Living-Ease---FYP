import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';

const placeholderImage =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const LandlordCard = ({ propertyId, onMessagePress }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await apiClient.get(`/property/${propertyId}`);
        setProperty(response.data.property);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const handleCallPress = () => {
    if (property && property.contactNumber) {
      const phoneNumber = `tel:${property.contactNumber}`;
      Linking.openURL(phoneNumber).catch(err => console.error('Error opening phone dialer:', err));
    } else {
      console.error('No contact number available for the property');
    }
  };

  const handleCardPress = () => {
    if (property && property.owner) {
      navigation.navigate('LandlordProfile', { landlordId: property.owner._id,propertyId,property });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPropertyText}>Property not found.</Text>
      </View>
    );
  }

  const firstName = capitalizeFirstLetter(property.owner?.firstName);
  const lastName = capitalizeFirstLetter(property.owner?.lastName);

  return (
    <TouchableOpacity style={styles.container} onPress={handleCardPress}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: property.owner?.profileImage?.url || placeholderImage }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.landlordName}>
            {firstName} {lastName}
          </Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={onMessagePress} style={styles.iconTextWrapper}>
              <View style={styles.iconBackground}>
                <Icon name="chat" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.iconLabel}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCallPress} style={styles.iconTextWrapper}>
              <View style={styles.iconBackground}>
                <Icon name="call" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.iconLabel}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  landlordName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconBackground: {
    backgroundColor: Colors.lightgrey,
    borderRadius: 30,
    padding: 10,
    marginRight: 8,
  },
  iconLabel: {
    fontSize: 14,
    color: Colors.darkText,
    fontFamily: fonts.regular,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPropertyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.placeholdertext,
  },
});

export default LandlordCard;
