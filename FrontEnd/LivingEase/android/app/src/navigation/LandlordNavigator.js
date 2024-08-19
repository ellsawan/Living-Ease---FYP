import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandlordBottomTabs from '../screens/Landlord/LandlordBottomTabs'; // Adjust import if needed
import CommonNavigator from './CommonNavigator';
const Stack = createStackNavigator();

const LandlordNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="LandlordBottomTabs"
        component={LandlordBottomTabs}
      />
      {/* Add other screens specific to the landlord role here if needed */}
    </Stack.Navigator>
  );
};

export default LandlordNavigator;
