// TenantDashboard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import SearchBar from './SearchBar'; // Import the SearchBar component
import Colors from '../../constants/Colors';

const TenantDashboard = () => {
  return (
    <View style={styles.container}>
      <TopBar />
      <Greeting />
      <SearchBar/>
    
      </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default TenantDashboard;
