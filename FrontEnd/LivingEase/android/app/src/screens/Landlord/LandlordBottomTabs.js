// LandlordBottomTabs.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import LandlordDashboard from './LandlordDashboard';
import MessagesScreen from '../common/MessagesScreen';
import NotificationScreen from '../common/NotificationScreen';
import SettingsScreen from '../common/SettingsScreen';
import fonts from '../../constants/Font';
import CommonNavigator from '../../navigation/CommonNavigator';

const Tab = createBottomTabNavigator();

const LandlordBottomTabs = () => {
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
      }}>
      <Tab.Screen
        name="Home"
        component={LandlordDashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
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
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
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
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'notifications-sharp' : 'notifications-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Notifications',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'settings' : 'settings-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default LandlordBottomTabs;
