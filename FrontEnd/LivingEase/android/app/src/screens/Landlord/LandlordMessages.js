import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/Font';

const LandlordMessages = ({ navigation }) => {
  const [landlords, setLandlords] = useState([]);
  const [userId, setUserId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const placeholderImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          await fetchCommunicatedLandlords(storedUserId); // Use storedUserId directly
        } else {
          console.error('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userId && landlords.length > 0) {
        fetchUnreadCounts(landlords, userId);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, [userId, landlords]); // Dependencies to re-run the effect

  const fetchCommunicatedLandlords = async (userId) => {
    try {
      const response = await apiClient.get(`/messages/users/communicated/${userId}`);
      const filteredLandlords = response.data.users.filter(user => user._id !== userId);
      setLandlords(filteredLandlords);
      console.log('Filtered Landlords:', filteredLandlords);
      
      // Fetch unread counts after landlords are fetched
      await fetchUnreadCounts(filteredLandlords, userId); // Pass userId explicitly
    } catch (error) {
      console.error('Error fetching landlords:', error);
    }
  };

  const fetchUnreadCounts = async (landlords, userId) => { // Accept userId as parameter
    try {
      const unreadCountsObj = {};
      
      for (const landlord of landlords) {
        if (!landlord._id) {
          console.error('Landlord ID is invalid. Skipping unread count fetch.');
          continue;
        }

        console.log(`Fetching unread count for sender: ${landlord._id}, receiver: ${userId}`);
        const response = await apiClient.get(`/messages/unreadCount/${landlord._id}/${userId}`);
        
        unreadCountsObj[landlord._id] = response.data.unreadCount;
      }

      setUnreadCounts(unreadCountsObj);
      console.log('Unread Counts:', unreadCountsObj);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const handleUserPress = (landlord) => {
    navigation.navigate('Chat', { senderId: userId, receiverId: landlord._id });
  };

  const renderLandlordItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.profileImage?.url || placeholderImage }}
        style={styles.profileImage}
      />
      <TouchableOpacity
        onPress={() => handleUserPress(item)}
        style={styles.itemContent}
      >
        <View style={styles.userDetails}>
          <Text style={styles.itemText}>
            {item.firstName} {item.lastName}
          </Text>
          {unreadCounts[item._id] > 0 && (
            <View style={styles.unreadIconContainer}>
              <Text style={styles.unreadCount}>{unreadCounts[item._id]}</Text>
              <Icon name="mark-chat-unread" size={20} color={Colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={landlords}
        keyExtractor={(item) => item._id}
        renderItem={renderLandlordItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 24,
    fontFamily: fonts.bold,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.blue,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightgrey,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
    color: Colors.blue,
    fontFamily: fonts.semiBold,
  },
  itemContent: {
    flex: 1,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 14,
    color: Colors.red,
    marginRight: 5,
  },
});

export default LandlordMessages;
