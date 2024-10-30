import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './android/app/src/navigation/AppNavigator';
import LandlordNavigator from './android/app/src/navigation/LandlordNavigator';

import { StripeProvider } from '@stripe/stripe-react-native';
const App = () => {
  return (
    <StripeProvider publishableKey="pk_test_51QEDFEKHTVoAtM1ESbdig1qkDF18d2f9D3QQv7YKzzoj9QU9DgrWangTzgN5NeJbOZ01lGQXonIKMxkbe9v8GJkg00mEEt2nfC">
      <AppNavigator />
      </StripeProvider>
  );
  
};

export default App;
