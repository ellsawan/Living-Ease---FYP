// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen'; // Import the correct screen
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import SelectRoleScreen from '../screens/SelectRoleScreen';
import TenantDashboard from '../screens/TenantDashboard';
import LandlordDashboard from '../screens/LandlordDashboard';
import ServiceProviderDashboard from '../screens/ServiceProviderDashboard';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: "", // Remove the title for all screens
        })}
        initialRouteName="SplashScreen" // Set the initial route to the splash screen
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }} // Hide header for splash screen
        />
        <Stack.Screen
          name="WelcomeScreen" // Ensure this matches the name used in navigation.replace()
          component={WelcomeScreen}
          options={{ headerShown: false }} // Optionally hide header if needed
        />
        <Stack.Screen
          name="SelectRoleScreen"
          component={SelectRoleScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="TenantDashboard"
          component={TenantDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LandlordDashboard"
          component={LandlordDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServiceProviderDashboard"
          component={ServiceProviderDashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
