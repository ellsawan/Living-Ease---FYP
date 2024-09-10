import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/common/SplashScreen';
import WelcomeScreen from '../screens/common/WelcomeScreen'; 
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SignInScreen from '../screens/Auth/SignInScreen';
import SelectRoleScreen from '../screens/Auth/SelectRoleScreen';
import TenantDashboard from '../screens/Tenant/TenantDashboard';
import ServiceProviderDashboard from '../screens/ServiceProvider/ServiceProviderDashboard';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import LandlordNavigator from './LandlordNavigator';
import TenantNavigator from './TenantNavigator';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
import VerifyOTP from '../screens/Auth/VerifyOTP';
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
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{headerShown: true}}
        />
          <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{headerShown: true}}
        />
         <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTP}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TenantDashboard"
          component={TenantNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
  name="LandlordDashboard"
  component={LandlordNavigator} 
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
