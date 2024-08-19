import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/common/SplashScreen';
import WelcomeScreen from '../screens/common/WelcomeScreen'; // Import the correct screen
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SignInScreen from '../screens/Auth/SignInScreen';
import SelectRoleScreen from '../screens/Auth/SelectRoleScreen';
import TenantDashboard from '../screens/Tenant/TenantDashboard';
import LandlordDashboard from '../screens/Landlord/LandlordDashboard';
import ServiceProviderDashboard from '../screens/ServiceProvider/ServiceProviderDashboard';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import LandlordBottomTabs from '../screens/Landlord/LandlordBottomTabs';
import LandlordNavigator from './LandlordNavigator';
import CommonNavigator from './CommonNavigator';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({navigation}) => ({
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: '', 
        })}
        initialRouteName="SplashScreen" 
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}} 
        />
        <Stack.Screen
          name="WelcomeScreen" 
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SelectRoleScreen"
          component={SelectRoleScreen}
          options={{title: ''}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{title: ''}}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{title: ''}}
        />
        <Stack.Screen
          name="TenantDashboard"
          component={TenantDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
  name="LandlordDashboard"
  component={LandlordNavigator} // Use the LandlordBottomTabs navigator
  options={{headerShown: false}}
/>
<Stack.Screen
  name="CommonNavigator"
  component={CommonNavigator} // Use the LandlordBottomTabs navigator
  options={{headerShown: false}}
/>
        <Stack.Screen
          name="ServiceProviderDashboard"
          component={ServiceProviderDashboard}
          options={{headerShown: false}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
