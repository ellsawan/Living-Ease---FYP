import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import apiClient from '../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await apiClient.get(`/notification/notifications/${userId}`);
          setNotifications(response.data.notifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [userId]);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {/* Check if notifications array is empty */}
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.notificationCard} onPress={() => {}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  notificationCard: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.dark,
    fontFamily: fonts.regular,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    marginTop: 8,
  },
  noNotificationsText: {
    fontSize: 18,
    color: Colors.dark,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationsScreen;
