import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropertyCard from './PropertyCard';

const placeholderImage =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const LandlordProfile = ({navigation}) => {
  const route = useRoute();
  const { propertyId } = route.params;
  const [landlord, setLandlord] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('Listings');

  useEffect(() => {
    const fetchLandlordDetails = async () => {
      try {
        const response = await apiClient.get(`/property/${propertyId}`);
        const owner = response.data.property.owner;
        const ownerId= response.data.property.owner._id
        console.log('owner', owner);
        setLandlord(owner);
        setContactNumber(landlord.contactNumber);

        // Fetch properties by the landlord's ID
        const propertiesResponse = await apiClient.get(`property/properties/owner/${ownerId}`);
        console.log('Fetched properties:', propertiesResponse.data.properties);
        setProperties(propertiesResponse.data.properties);
      } catch (error) {
        console.error('Error fetching landlord details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchLandlordDetails();
    }
  }, [propertyId]);
  const handlePress = (propertyId) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  const handleCallPress = () => {
    if (contactNumber) {
      const phoneNumber = `tel:${contactNumber}`;
      Linking.openURL(phoneNumber).catch(err => console.error('Error opening phone dialer:', err));
    } else {
      console.error('No contact number available for the property');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!landlord) {
    return (
      <View style={styles.container}>
        <Text style={styles.noLandlordText}>Landlord not found.</Text>
      </View>
    );
  }

  const firstName = landlord.firstName || '';
  const lastName = landlord.lastName || '';
  const profileImage = landlord.profileImage?.url || placeholderImage;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profileImage }}
        style={styles.profileImage}
      />
      <Text style={styles.landlordName}>
        {firstName} {lastName}
      </Text>
      {/* Add more landlord details and UI components here */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => {/* Handle message action */}} style={styles.iconTextWrapper}>
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

      {/* Tab Content */}
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
          <Text>Reviews content goes here</Text> // Replace with actual reviews content
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  landlordName: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  iconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLandlordText: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: Colors.placeholdertext,
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
});

export default LandlordProfile;
