import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TenantBottomTabs from '../screens/Tenant/TenantBottomTabs';
import Properties from '../screens/Tenant/Properties';
import TenantSetting from '../screens/Tenant/TenantSetting'
import TenantEditProfile from '../screens/Tenant/TenantEditProfile'
import EditProperty from '../screens/Landlord/Property/EditProperty';
import fonts from '../constants/Font';
import Colors from '../constants/Colors';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import SearchFilter from '../screens/Tenant/SearchFilter';
import Location from '../screens/Tenant/Location';
import Favorites from '../screens/Tenant/Favorites';
import PropertyDetails from '../screens/Tenant/PropertyDetails';
import CompareProperties from '../screens/Tenant/CompareProperties';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TenantMessages from '../screens/Tenant/TenantMessages';
import TenantNotifications from '../screens/Tenant/TenantNotifications';
import LandlordProfile from '../screens/Tenant/LandlordProfile';
import ScheduleVisit from '../screens/Tenant/ScheduleVisit';
import SubmitApplication from '../screens/Tenant/SubmitApplication';
const Stack = createStackNavigator();

const TenantNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TenantBottomTabs"
        component={TenantBottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchFilter"
        component={SearchFilter}
        options={{
          headerTitle: 'Search Property',
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
        name="Favorites"
        component={Favorites}
        options={{
          headerTitle: 'Favorites',
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
        name="TenantMessages"
        component={TenantMessages}
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
        name="TenantNotifications"
        component={TenantNotifications}
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
        name="Properties"
        component={Properties}
        options={({navigation}) => ({
          headerTitle: 'Properties',
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
        name="TenantSetting"
        component={TenantSetting}
        options={({navigation}) => ({
          headerTitle: '',
          headerShown:false,
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
        name="TenantEditProfile"
        component={TenantEditProfile}
        options={({navigation}) => ({
          headerTitle: '',
          headerShown:false,
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
        name="LandlordProfile"
        component={LandlordProfile}
        options={({navigation}) => ({
          headerTitle: 'Landlord Profile',
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
  options={({ navigation }) => ({
    headerTitle: '',
    headerTransparent: false, // Set to false to apply background color
    headerLeft: () => (
      <CustomHeaderBackButton onPress={() => navigation.goBack()} />
    ),
   
    headerStyle: {
      backgroundColor: 'white', // White background color for the headerd
    },
    headerTitleAlign: 'center', // Ensure the title aligns correctly
  })}
/>

<Stack.Screen
        name="CompareProperties"
        component={CompareProperties}
        options={({navigation}) => ({
          headerTitle: 'Compare Properties',
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
        name="ScheduleVisit"
        component={ScheduleVisit}
        options={({navigation}) => ({
          headerTitle: 'Schedule Visit',
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
        name="SubmitApplication"
        component={SubmitApplication}
        options={({navigation}) => ({
          headerTitle: 'Submit Application',
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

export default TenantNavigator;
