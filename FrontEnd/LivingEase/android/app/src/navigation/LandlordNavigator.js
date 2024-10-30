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
import Colors from '../constants/Colors';
import fonts from '../constants/Font';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import Location from '../screens/Landlord/Property/Location';
import LandlordPublicProfile from '../screens/Landlord/Property/LandlordPublicProfile';
import ManageApplications from '../screens/Landlord/RentalApplications/ManageApplications';
import ApplicationDetails from '../screens/Landlord/RentalApplications/ApplicationDetails';
import ManageVisits from '../screens/Landlord/PropertyVisits/ManageVisits';
import TenantProfile from '../screens/Landlord/TenantProfile';
import ManageAgreements from '../screens/Landlord/LeaseAgreements/ManageAgreements';
import LeaseAgreementTemplate from '../screens/Landlord/LeaseAgreements/LeaseAgreementTemplate';
import ApprovedApplications from '../screens/Landlord/LeaseAgreements/ApprovedApplications';
import LeaseAgreement from '../screens/Landlord/LeaseAgreements/LeaseAgreement';
import LeaseForm from '../screens/Landlord/LeaseAgreements/LeaseForm';
import LandlordOwnProfile from '../screens/Landlord/LandlordOwnProfile';
import ManagePayments from '../screens/Landlord/ManagePayments/ManagePayments';
import CreateAccount from '../screens/Landlord/ManagePayments/CreateAccount';
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
          headerTitle: 'Edit Profile',
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
      <Stack.Screen
        name="ManageApplications"
        component={ManageApplications}
        options={({navigation}) => ({
          headerTitle: 'Rental  Applications',
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
        name="ApplicationDetails"
        component={ApplicationDetails}
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
        name="TenantProfile"
        component={TenantProfile}
        options={({navigation}) => ({
          headerTitle: 'Tenant Profile',
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
        name="ManageVisits"
        component={ManageVisits}
        options={({navigation}) => ({
          headerTitle: 'My Visits',
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
        name="ManageAgreements"
        component={ManageAgreements}
        options={({navigation}) => ({
          headerTitle: 'My Lease Agreements',
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
        name="LeaseAgreementTemplate"
        component={LeaseAgreementTemplate}
        options={({navigation}) => ({
          headerTitle: 'Lease Agreement Template',
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
        name="ApprovedApplications"
        component={ApprovedApplications}
        options={({navigation}) => ({
          headerTitle: 'Approved Applications',
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
            paddingVertical: 10,
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
          headerTitle: 'Lease Form',
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
        name="LandlordOwnProfile"
        component={LandlordOwnProfile}
        options={({navigation}) => ({
          headerTitle: 'Public Profile',
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
        name="ManagePayments"
        component={ManagePayments}
        options={({navigation}) => ({
          headerTitle: 'Rent Payments',
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
        name="CreateAccount"
        component={CreateAccount}
        options={({navigation}) => ({
          headerTitle: 'Create Stripe Account',
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
    </Stack.Navigator>
  );
};

export default LandlordNavigator;
