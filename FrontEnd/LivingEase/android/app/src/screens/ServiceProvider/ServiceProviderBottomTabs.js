import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import ServiceProviderDashboard from './ServiceProviderDashboard';
import ServiceProviderPayments from './ServiceProviderPayments';
import ServiceProviderSetting from './ServiceProviderSetting';

const Tab = createBottomTabNavigator();

const ServiceProviderBottomTabs = () => {
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
        component={ServiceProviderDashboard}
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
        name="Payments"
        component={ServiceProviderPayments}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcon
              name={focused ? 'payment' :'payment'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Payments',
        }}
      />
            <Tab.Screen
        name="Setting"
        component={ServiceProviderSetting}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcon
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'PROFILE',
        }}
      />
   
     
    </Tab.Navigator>
  );
};

export default ServiceProviderBottomTabs;