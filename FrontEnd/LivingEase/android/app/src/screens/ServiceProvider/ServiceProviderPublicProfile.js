import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import apiClient from '../../../../../apiClient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceProviderProfileScreen = () => {
  const [serviceProvider, setServiceProvider] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const fetchServiceProviderId = async () => {
      try {
        const serviceProviderId = await AsyncStorage.getItem('userId'); // Get the ID from AsyncStorage
        if (serviceProviderId) {
          fetchProfile(serviceProviderId);
          fetchAverageRating(serviceProviderId);
        } else {
          console.error('No service provider ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching service provider ID from AsyncStorage:', error);
      }
    };

    const fetchProfile = async (serviceProviderId) => {
      try {
        const response = await apiClient.get(`/serviceProvider/profile/${serviceProviderId}`);
        setServiceProvider(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchAverageRating = async (serviceProviderId) => {
      try {
        const response = await apiClient.get(`/rating/average-rating/${serviceProviderId}`);
        console.log('Average Rating Response:', response.data);
        if (response.data && response.data.averageRating !== undefined) {
          setAverageRating(response.data.averageRating);
          setTotalRatings(response.data.totalRatings);  // Set the total number of ratings
        } else {
          setAverageRating(0);
          setTotalRatings(0);
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchServiceProviderId();
  }, []);

  if (!serviceProvider) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const { user, services } = serviceProvider;
  const { firstName, lastName, email, contactNumber, profileImage } = user;


  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      {profileImage && (
        <Image
          source={{ uri: profileImage.url }}
          style={styles.profileImage}
        />
      )}

      {/* User Info */}
      <Text style={styles.name}>{firstName} {lastName}</Text>

      {/* Rating */}
      {averageRating !== null && (
        <View style={styles.ratingContainer}>
          {/* Render the stars */}
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name={index < averageRating ? 'star' : 'star-outline'}
              size={20}
              color="#FFD700" // You can adjust the color as per your theme
            />
          ))}
          <Text style={styles.ratingText}>
            {averageRating} / 5 ({totalRatings} total)
          </Text>
        </View>
      )}

      {/* Email with Icon */}
      <View style={styles.contactContainer}>
        <MaterialCommunityIcons 
          name="email" 
          size={20} 
          color={Colors.primary} 
          style={styles.icon}
        />
        <View >
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Contact Number with Icon */}
      <View style={styles.contactContainer}>
        <MaterialCommunityIcons 
          name="phone" 
          size={20} 
          color={Colors.primary} 
          style={[styles.icon, { marginTop: -20 }]} 
        />
        <View >
          <Text style={styles.contact}>{contactNumber}</Text>
        </View>
      </View>

      {/* Services */}
      <Text style={styles.servicesTitle}>Services Offered:</Text>
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <View style={styles.serviceItem} key={index}>
            <MaterialCommunityIcons name="check-circle" size={20} color={Colors.green} />
            <Text style={styles.service}>{service}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  name: {
    fontSize: 28,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    marginLeft: 8,
    color: Colors.dark,
  },
  email: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
  },
  contact: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
    marginBottom: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    marginTop: 20,
    marginBottom: 10,
    color: Colors.primary,
  },
  servicesContainer: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  service: {
    fontSize: 16,
    fontFamily: fonts.regular,
    marginLeft: 10,
    color: Colors.dark,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
});

export default ServiceProviderProfileScreen;
