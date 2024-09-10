import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font'; // Adjust the path as needed

const NearbyAmenities = ({ latitude, longitude }) => {
  const [schools, setSchools] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schools');

  useEffect(() => {
    const fetchNearbyAmenities = async () => {
      const apiKey = 'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ'; 
      const radius = 1500; // Search radius in meters
  
      try {
        // Fetch schools
        const schoolResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=school&key=${apiKey}`
        );
        setSchools(schoolResponse.data.results);
  
        // Fetch hospitals
        const hospitalResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${apiKey}`
        );
        setHospitals(hospitalResponse.data.results);
  
        // Fetch restaurants
        const restaurantResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${apiKey}`
        );
        setRestaurants(restaurantResponse.data.results);
  
      } catch (error) {
        console.error('Error fetching nearby amenities:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNearbyAmenities();
  }, [latitude, longitude]);
  

  const getIconForType = (type) => {
    switch (type) {
      case 'schools':
        return 'school';
      case 'hospitals':
        return 'hospital-building';
      case 'restaurants':
        return 'silverware-fork-knife';
      default:
        return 'map-marker';
    }
  };

  const cleanAddress = (address) => {
    // Regex to remove postal codes or numbers at the end
    return address.replace(/\d{5}(?:[-\s]\d{4})?$/, '').trim();
  };
  
  const renderAmenityItem = (item) => (
    <View key={item.place_id} style={styles.amenityItem}>
      <View style={styles.amenityHeader}>
        <MaterialCommunityIcons
          name={getIconForType(activeTab)}
          size={30}
          color={Colors.primary}
        />
        <Text style={styles.amenityName}>{item.name}</Text>
      </View>
      <View style={styles.amenityDetails}>
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={Colors.primary}
        />
        <Text style={styles.amenityAddress}>{cleanAddress(item.vicinity)}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );

  const renderAmenityList = (data) => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {data.length > 0 ? data.map(renderAmenityItem) : renderNoResultsMessage()}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderNoResultsMessage = () => (
    <Text style={styles.noResults}>No {activeTab} found</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'schools' && styles.activeTab]}
          onPress={() => setActiveTab('schools')}
        >
          <Text style={[styles.tabText, activeTab === 'schools' ? { color: Colors.primary } : { color: Colors.placeholdertext }]}>Schools</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hospitals' && styles.activeTab]}
          onPress={() => setActiveTab('hospitals')}
        >
          <Text style={[styles.tabText, activeTab === 'hospitals' ? { color: Colors.primary } : { color: Colors.placeholdertext}]}>Hospitals</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabText, activeTab === 'restaurants' ? { color: Colors.primary } : { color: Colors.placeholdertext }]}>Restaurants</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amenitiesContent}>
        {activeTab === 'schools' && renderAmenityList(schools)}
        {activeTab === 'hospitals' && renderAmenityList(hospitals)}
        {activeTab === 'restaurants' && renderAmenityList(restaurants)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  amenitiesContent: {
    flex: 1,
  },
  noResults: {
    fontSize: 16,
    color: Colors.placeholdertext,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
  },
  amenityItem: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  amenityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.dark,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.placeholdertext,
    marginVertical: 10,
  },
  amenityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityAddress: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginLeft: 10,
  },
});

export default NearbyAmenities;
