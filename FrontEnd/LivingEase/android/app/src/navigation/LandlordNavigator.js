import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LandlordBottomTabs from '../screens/Landlord/LandlordBottomTabs';
import LandlordMessages from '../screens/Landlord/LandlordMessages';
import LandlordSetting from '../screens/Landlord/LandlordSetting';
import LandlordEditProfile from '../screens/Landlord/LandlordEditProfile';
import LandlordNotifications from '../screens/Landlord/LandlordNotifications';
import ManageProperty from '../screens/Landlord/Property/ManageProperty';
import AddProperty from '../screens/Landlord/Property/AddProperty';
import EditProperty from '../screens/Landlord/Property/EditProperty';
import PropertyDetails from '../screens/Landlord/Property/PropertyDetails';
import fonts from '../constants/Font';
import Colors from '../constants/Colors';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import Location from '../screens/Landlord/Property/Location';
import LandlordPublicProfile from '../screens/Landlord/Property/LandlordPublicProfile';
const Stack = createStackNavigator();

const LandlordNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LandlordBottomTabs"
        component={LandlordBottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LandlordMessages"
        component={LandlordMessages}
        options={{
          headerTitle: 'Messages',
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
        name="Location"
        component={Location}
        options={{
          headerTitle: 'Select Location',
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
        name="LandordSetting"
        component={LandlordSetting}
        options={{
          headerTitle: 'Settings',
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
        name="LandlordNotifications"
        component={LandlordNotifications}
        options={{
          headerTitle: 'Notifications',
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
        name="LandlordEditProfile"
        component={LandlordEditProfile}
        options={{
          headerTitle: 'Messages',
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
        name="ManageProperty"
        component={ManageProperty}
        options={({navigation}) => ({
          headerTitle: 'My Properties',
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
        name="AddProperty"
        component={AddProperty}
        options={({navigation}) => ({
          headerTitle: 'Add Property',
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
        name="EditProperty"
        component={EditProperty}
        options={({navigation}) => ({
          headerTitle: 'Edit Property',
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
        name="PropertyDetails"
        component={PropertyDetails}
        options={({navigation}) => ({
          headerTitle: '',
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
     
      <Stack.Screen
        name="LandlordPublicProfile"
        component={LandlordPublicProfile}
        options={({navigation}) => ({
          headerTitle: 'Public Profile',
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

export default LandlordNavigator;
