import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

const placeholderImage =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const TenantMessages = ({ navigation }) => {
    const [tenants, setTenants] = useState([]);
    const [userId, setUserId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
  
    useEffect(() => {
      const fetchUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId);
          
          }
        } catch (error) {
          console.error('Error retrieving userId from AsyncStorage:', error);
        }
      };
  
      fetchUserId();
    }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        if (userId) {
         
          fetchCommunicatedTenants(userId);
        }
      }, [userId]),
    );
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (userId && tenants.length > 0) {
         
          fetchUnreadCounts(tenants, userId);
        } else {
          console.log('No user ID or tenants to fetch unread counts.');
        }
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, [userId, tenants]);
  
    const fetchCommunicatedTenants = async (userId) => {
      try {
        const response = await apiClient.get(`/messages/users/communicated/${userId}`);
        const filteredTenants = response.data.users.filter(
          user => user._id !== userId && !(user.deletedFor && user.deletedFor.includes(userId)),
        );
        setTenants(filteredTenants);
      
  
        // Fetch unread counts after tenants are fetched
        if (filteredTenants.length > 0) {
          fetchUnreadCounts(filteredTenants, userId);
        } else {
          console.log('No tenants to fetch unread counts for.');
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };
  
    const fetchUnreadCounts = async (tenants, userId) => {
      try {
 
        const unreadCountsObj = {};
        for (const tenant of tenants) {
          if (!tenant._id) {
            console.error('Tenant ID is invalid. Skipping unread count fetch.');
            continue;
          }
  
     
          const response = await apiClient.get(`/messages/unreadCount/${tenant._id}/${userId}`);
          
          unreadCountsObj[tenant._id] = response.data.unreadCount;
        }
        setUnreadCounts(unreadCountsObj);
        
      } catch (error) {
        console.error('Error fetching unread counts:', error);
      }
    };

  const handleUserPress = tenant => {
    navigation.navigate('Chat', { senderId: userId, receiverId: tenant._id });
  };

  const renderTenantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContent}
      onPress={() => handleUserPress(item)}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.profileImage?.url || placeholderImage }}
          style={styles.profileImage}
        />
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={tenants}
        keyExtractor={item => item._id}
        renderItem={renderTenantItem}
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
    justifyContent: 'flex-start',
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
    flex: 1,
    fontSize: 18,
    color: Colors.blue,
    fontFamily: fonts.semiBold,
  },
  itemContent: {
    flex: 1,
  },
  unreadIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 5,
  },
});

export default TenantMessages;
