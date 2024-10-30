// CreateAccountScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const CreateAccountScreen = ({ route }) => {
  const { accountLinkUrl } = route.params; // Get the URL from navigation params

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: accountLinkUrl }} 
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => {
          // Optionally, handle any navigation events here if needed
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreateAccountScreen;
