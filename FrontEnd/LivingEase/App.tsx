import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './android/app/src/navigation/AuthNavigator';
import LandlordNavigator from './android/app/src/navigation/LandlordNavigator';

const App = () => {
  return (
      <AuthNavigator />
  );
};

export default App;
