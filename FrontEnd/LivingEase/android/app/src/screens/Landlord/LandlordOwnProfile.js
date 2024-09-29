import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import PropertyCard from './Property/PropertyCard';
import RatingCard from '../common/RatingCard';
const LandlordOwnProfileScreen = () => {
  const [profilePicture, setProfilePicture] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Listings');
  const [properties, setProperties] = useState([]);
  const [ratings, setRatings] = useState([]);
  const handlePress = () => {
    // Intentionally does nothing
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
       
        if (token) {
          // Fetch profile image
          try {
            const profileImageResponse = await apiClient.get('/user/profile-image', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (
              profileImageResponse.status === 200 &&
              profileImageResponse.data.profileImageUrl
            ) {
              setProfilePicture(profileImageResponse.data.profileImageUrl);
            }
          } catch (profileImageError) {
            console.log('Error fetching profile image:', profileImageError);
          }

          // Fetch user name
          try {
            const nameResponse = await apiClient.get('/user/name', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (nameResponse.status === 200) {
              setFirstName(nameResponse.data.firstName || '');
              setLastName(nameResponse.data.lastName || '');
            } else {
              setError('Failed to fetch user name');
            }
          } catch (nameError) {
            console.error('Error fetching user name:', nameError);
            setError('Failed to fetch user name');
          }

          // Fetch properties and ratings
          try {
            const ownerId = '66df21ccd185f128b1a215fb';
            const propertiesResponse = await apiClient.get(`property/properties/owner/${ownerId}`);
            console.log('Fetched properties:', propertiesResponse.data.properties);
            setProperties(propertiesResponse.data.properties || []); // Ensure an empty array if no properties

            const ratingsResponse = await apiClient.get(`/rating/ratings/${ownerId}`);
            console.log('Fetched ratings:', ratingsResponse.data);
            setRatings(ratingsResponse.data || []); // Ensure an empty array if no ratings
          } catch (error) {
            console.error('Error fetching landlord details:', error);
            setError('Failed to fetch properties and ratings'); // Set a user-friendly error
          }
        } else {
          setError('No token found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.name}>
          {`${firstName} ${lastName}`} {/* Using template literals for clarity */}
        </Text>
      </View>

      {/* Tabs for Listings and Reviews */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Listings' && styles.activeTab]}
          onPress={() => setActiveTab('Listings')}
        >
          <Text style={styles.tabText}>Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Reviews' && styles.activeTab]}
          onPress={() => setActiveTab('Reviews')}
        >
          <Text style={styles.tabText}>Reviews</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.tabContent}
        nestedScrollEnabled={true}
        >
          
        {activeTab === 'Listings' ? (
          <FlatList
          scrollEnabled={false}
            data={properties}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                onPress={() => handlePress(item._id)}
                isSelected={false} // Adjust if you need selection functionality
              />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <FlatList
          scrollEnabled={false}
          data={ratings.filter((item) => item.role === 'Landlord')}
            renderItem={({ item }) => (
              <RatingCard
                rating={item.rating}
                review={item.review}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        )}
      </ScrollView>
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    backgroundColor: Colors.white,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    shadowColor: Colors.primary,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  name: {
    marginTop: 10,
    marginBottom: -5,
    fontSize: 26,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.bold,
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  propertyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
  },
  ratingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
  },
  errorText: {
    color: Colors.red,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LandlordOwnProfileScreen;
