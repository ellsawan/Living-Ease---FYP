import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/common/MessagesScreen';
import NotificationScreen from '../screens/common/NotificationScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import EditProfileScreen from '../screens/common/EditProfileScreen';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';

const Stack = createStackNavigator();

const CommonNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Profile" component={SettingsScreen} />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerTitle:'',
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
         
        })}
      />
    </Stack.Navigator>
  );
};

export default CommonNavigator;
