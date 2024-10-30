import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RatingCard from '../common/RatingCard';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
const placeholderImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const TenantProfile = ({ navigation }) => {
  const route = useRoute();
  const { tenantId } = route.params;
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Reviews');
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        const response = await apiClient.get(`/tenant/user/${tenantId}`);
        setTenantData(response.data);
        const ratingsResponse = await apiClient.get(`/rating/ratings/${tenantId}`);
        setRatings(ratingsResponse.data);
      } catch (error) {
        console.error('Error fetching tenant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetails();
  }, [tenantId]);

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

  const { firstName, lastName, profileImage,contactNumber } = tenantData.user;
  const handleMessagePress = async () => {
    try {
      const landlordId = await AsyncStorage.getItem('userId');

      navigation.navigate('Chat', {
        receiverId: tenantId,
        senderId: landlordId,
      });
      console.log('Navigating to chat screen', { receiverId: tenantId, senderId: landlordId,  });
    } catch (error) {
      console.error('Error retrieving tenantId:', error);
    }
  };
  const handleCallPress = () => {
      const phoneNumber = `tel:${contactNumber}`;
      Linking.openURL(phoneNumber).catch(err =>
        console.error('Error opening phone dialer:', err),
      );
    } 
  

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profileImage?.url || placeholderImage }}
        style={styles.profileImage}
      />
      <Text style={styles.tenantName}>
        {firstName} {lastName}
      </Text>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleMessagePress} style={styles.iconTextWrapper}>
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

export default TenantProfile;
