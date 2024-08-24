import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/common/MessagesScreen';
import NotificationScreen from '../screens/common/NotificationScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import EditProfileScreen from '../screens/common/EditProfileScreen';
import CustomHeaderBackButton from '../constants/customHeaderBackButton';
import fonts from '../constants/Font';
import Colors from '../constants/Colors';

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
          headerTitle:'Edit Profile',
          headerTitleStyle: {
            fontSize: 22,
            marginTop:10, // Font size of the header title
            color: Colors.blue, // Text color
            fontFamily: fonts.bold, // Custom font if using a specific one
          },
          headerLeft: () => (
            <CustomHeaderBackButton onPress={() => navigation.goBack()} />
          ),
         
        })}
      />
    </Stack.Navigator>
  );
};

export default CommonNavigator;
