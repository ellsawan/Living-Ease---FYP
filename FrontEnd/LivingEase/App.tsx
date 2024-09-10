import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './android/app/src/navigation/AppNavigator';
import LandlordNavigator from './android/app/src/navigation/LandlordNavigator';

const App = () => {
  return (
      <AppNavigator />
  );
};

export default App;
