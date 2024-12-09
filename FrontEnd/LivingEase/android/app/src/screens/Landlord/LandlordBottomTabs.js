import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import LandlordDashboard from './LandlordDashboard';
import LandlordSetting from '../Landlord/LandlordSetting';
import LandlordMessages from './LandlordMessages';
import LandlordNotifications from './LandlordNotifications';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const LandlordBottomTabs = () => {
  const [unreadCount, setUnreadCount] = useState(0);
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
      const fetchUnreadNotifications = async () => {
        try {
          const response = await apiClient.get(`/notification/unread/${userId}`);
          console.log(unreadCount)
          setUnreadCount(response.data.unreadCount); // Assuming backend returns count of unread notifications
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      };

      fetchUnreadNotifications();
    }
  }, [userId]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.background,
          height: 60,
          elevation: 0,
          borderBottomWidth: 2,
          headerShown: false,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.semiBold,
          fontSize: 12,
          paddingTop: -35,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.blue,
      }}
    >
      <Tab.Screen
        name="Home"
        component={LandlordDashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'home-sharp' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="LandlordMessages"
        component={LandlordMessages}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="LandlordNotifications"
        component={LandlordNotifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Icon
                name={focused ? 'notifications-sharp' : 'notifications-outline'}
                size={26}
                color={color}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: -4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'red',
                  }}
                />
              )}
            </View>
          ),
          tabBarLabel: 'Notifications',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={LandlordSetting}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default LandlordBottomTabs;
