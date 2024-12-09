import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TenantBottomTabs from '../screens/Tenant/TenantBottomTabs';
import Properties from '../screens/Tenant/Properties';
import TenantSetting from '../screens/Tenant/TenantSetting';
import TenantEditProfile from '../screens/Tenant/TenantEditProfile';
import EditProperty from '../screens/Landlord/Property/EditProperty';
import fonts from '../constants/Font';
import Colors from '../constants/Colors';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import SearchFilter from '../screens/Tenant/SearchFilter';
import Location from '../screens/Tenant/Location';
import Favorites from '../screens/Tenant/Favorites';
import PropertyDetails from '../screens/Tenant/PropertyDetails';
import CompareProperties from '../screens/Tenant/CompareProperties';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TenantMessages from '../screens/Tenant/TenantMessages';
import TenantNotifications from '../screens/Tenant/TenantNotifications';
import LandlordProfile from '../screens/Tenant/LandlordProfile';
import ScheduleVisit from '../screens/Tenant/PropertyVisits/ScheduleVisit';
import ApplicationForm from '../screens/Tenant/RentalApplications/ApplicationForm';
import MyApplications from '../screens/Tenant/RentalApplications/MyApplications';
import ApplicationDetail from '../screens/Tenant/RentalApplications/ApplicationDetail';
import MyVisits from '../screens/Tenant/PropertyVisits/MyVisits';
import MyLeaseAgreements from '../screens/Tenant/LeaseAgreement/MyLeaseAgreements'
import LeaseForm from '../screens/Tenant/LeaseAgreement/LeaseForm';
import LeaseAgreement from '../screens/Tenant/LeaseAgreement/LeaseAgreement';
import MyProperty from '../screens/Tenant/MyProperty';
import TenantPublicProfile from '../screens/Tenant/TenantPublicProfile';
import ManagePayments from '../screens/Tenant/RentPayments/ManagePayments';
import RecommendedProperties from '../screens/Tenant/RecommendedProperties';
import ManageRequests from '../screens/Tenant/MaintenanceRequests/ManageRequests';
import ServiceProviderDetails from '../screens/Tenant/MaintenanceRequests/ServiceProviderDetails';
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
        name="TenantEditProfile"
        component={TenantEditProfile}
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
        options={({navigation}) => ({
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
        name="ApplicationForm"
        component={ApplicationForm}
        options={({navigation}) => ({
          headerTitle: 'Rental Application',
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
        name="MyApplications"
        component={MyApplications}
        options={({navigation}) => ({
          headerTitle: 'My Rental Applications',
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
        name="ApplicationDetail"
        component={ApplicationDetail}
        options={({navigation}) => ({
          headerTitle: 'Application Details',
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
        name="MyVisits"
        component={MyVisits}
        options={({navigation}) => ({
          headerTitle: 'My Visits',
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
       <Stack.Screen
        name="MyLeaseAgreements"
        component={MyLeaseAgreements}
        options={({navigation}) => ({
          headerTitle: 'My Lease Agreement',
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
       <Stack.Screen
        name="LeaseForm"
        component={LeaseForm}
        options={({navigation}) => ({
          headerTitle: 'Lease Agreement',
          headerTitleStyle: {
            fontSize: 22,
            color: Colors.blue,
            fontFamily: fonts.bold,
            textAlign: 'center',
            paddingVertical: 10, 
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
       <Stack.Screen
        name="LeaseAgreement"
        component={LeaseAgreement}
        options={({navigation}) => ({
          headerTitle: 'Lease Agreement',
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
        name="MyProperty"
        component={MyProperty}
        options={({navigation}) => ({
          headerTitle: 'My Property',
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
        name="TenantPublicProfile"
        component={TenantPublicProfile}
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
         <Stack.Screen
        name="ManagePayments"
        component={ManagePayments}
        options={({navigation}) => ({
          headerTitle: 'Manage Payments',
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
        name="RecommendedProperties"
        component={RecommendedProperties}
        options={({navigation}) => ({
          headerTitle: 'Recommended Properties',
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
        name="ManageRequests"
        component={ManageRequests}
        options={({navigation}) => ({
          headerTitle: 'Maintenance Requests',
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
        name="ServiceProviderDetails"
        component={ServiceProviderDetails}
        options={({navigation}) => ({
          headerTitle: 'Service Provider',
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
