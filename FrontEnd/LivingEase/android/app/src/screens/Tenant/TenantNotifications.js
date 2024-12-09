import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import apiClient from '../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get User ID from AsyncStorage
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

  // Fetch notifications and mark all unread notifications as read
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await apiClient.get(`/notification/notifications/${userId}`);
          setNotifications(response.data.notifications);

          // Mark all unread notifications as read
          const unreadNotifications = response.data.notifications.filter(
            (notification) => !notification.isRead
          );

          if (unreadNotifications.length > 0) {
            await markAllAsRead(unreadNotifications);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [userId]);

  // Mark all notifications as read
  const markAllAsRead = async (unreadNotifications) => {
    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          apiClient.patch(`/notification/${notification._id}/markAsRead`)
        )
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          unreadNotifications.some((unread) => unread._id === notification._id)
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Mark individual notification as read
  const markAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notification/${notificationId}/markAsRead`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

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
            <TouchableOpacity
              style={[
                styles.notificationCard,
                item.isRead ? styles.readCard : styles.unreadCard, // Style based on read/unread status
              ]}
              onPress={() => markAsRead(item._id)} // Mark as read on click
            >
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
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  unreadCard: {
    backgroundColor: '#fff',
  },
  readCard: {
    backgroundColor: '#f2f2f2', // Lighter background for read notifications
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
