import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import RatingCard from '../common/RatingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const placeholderImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const TenantPublicProfile = ({ navigation }) => {
  const [tenantId, setTenantId] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // Fetch the tenant ID from AsyncStorage
        const storedTenantId = await AsyncStorage.getItem('userId');
        console.log('Stored Tenant ID:', storedTenantId); // Debugging line
        setTenantId(storedTenantId);

        if (storedTenantId) {
          // Fetch tenant details if tenantId is available
          const response = await apiClient.get(`/tenant/user/${storedTenantId}`);
          setTenantData(response.data);

          const ratingsResponse = await apiClient.get(`/rating/ratings/${storedTenantId}`);
          console.log('Fetched ratings:', ratingsResponse.data); // Debugging line
          setRatings(ratingsResponse.data);
        }
      } catch (error) {
        console.error('Error retrieving tenant ID or fetching tenant details:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };

    fetchTenantData();
  }, []); // Only run once when component mounts

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tenantData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTenantText}>Tenant not found.</Text>
      </View>
    );
  }

  const { firstName, lastName, profileImage } = tenantData.user;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profileImage?.url || placeholderImage }}
        style={styles.profileImage}
      />
      <Text style={styles.tenantName}>
        {firstName} {lastName}
      </Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Reviews')}
        >
          <Text style={styles.tabText}>Reviews</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tabContent}>
        <FlatList
          scrollEnabled={false}
          data={ratings.filter((item) => item.role === 'Tenant')}
          renderItem={({ item }) => (
            <RatingCard
              rating={item.rating}
              review={item.review}
            />
          )}
          keyExtractor={(item) => item._id}
        />
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
  tenantName: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTenantText: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: Colors.placeholdertext,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
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

export default TenantPublicProfile;
