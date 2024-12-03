import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ServiceProviderBottomTabs from '../screens/ServiceProvider/ServiceProviderBottomTabs';
import ServiceProviderPayments from '../screens/ServiceProvider/ServiceProviderPayments';
import ServiceProviderSetting from '../screens/ServiceProvider/ServiceProviderSetting';
import ServiceProviderEditProfile from '../screens/ServiceProvider/ServiceProviderEditProfile';
import Colors from '../constants/Colors';
import fonts from '../constants/Font';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
const Stack = createStackNavigator();
const ServiceProviderNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ServiceProviderBottomTabs"
          component={ServiceProviderBottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceProviderSetting"
          component={ServiceProviderSetting}
          options={{
            headerTitle: 'ServiceProviderSetting',
            headerTitleStyle: {
              fontSize: 22,
              color: Colors.blue,
              fontFamily: fonts.bold,
              textAlign: 'center',
              paddingVertical: 10, // Adjust vertical padding
            },
            headerTitleAlign: 'center',
          }}
        />
  
  
        <Stack.Screen
          name="ServiceProviderPayment"
          component={ServiceProviderPayments}
          options={({navigation}) => ({
            headerTitle: '',
            headerShown: false,
            headerTitleStyle: {
              fontSize: 22,
              color: Colors.blue,
              fontFamily: fonts.bold,
              textAlign: 'center',
              paddingVertical: 10, // Adjust vertical padding
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
              <CustomHeaderBackButton onPress={() => navigation.goBack()} />
            ),
          })}
        />
         <Stack.Screen
          name="ServiceProviderEditProfile"
          component={ServiceProviderEditProfile}
          options={({navigation}) => ({
            headerTitle: 'Edit Profile',
            headerShown: true,
            headerTitleStyle: {
              fontSize: 22,
              color: Colors.blue,
              fontFamily: fonts.bold,
              textAlign: 'center',
              paddingVertical: 10, // Adjust vertical padding
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
              <CustomHeaderBackButton onPress={() => navigation.goBack()} />
            ),
          })}
        />
      
      </Stack.Navigator>
  
    );
  };
  
  export default ServiceProviderNavigator;