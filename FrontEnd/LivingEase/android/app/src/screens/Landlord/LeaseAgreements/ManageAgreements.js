import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors'; // Adjust import based on your structure
import fonts from '../../../constants/Font';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
const ManageAgreements = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const navigation = useNavigation();
  const handleCreateLeaseAgreement = () => {
    // Navigate to the Approved Applications screen
    navigation.navigate('ApprovedApplications'); // Replace with your actual route name
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Active', 'Pending'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Placeholder for content below the tabs */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Content for {activeTab} Leases will go here.</Text>
      </View>

      {/* Create Lease Agreement Button positioned at the bottom */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreateLeaseAgreement}
      >
        <Text style={styles.createButtonText}>Create New Lease Agreement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
    justifyContent: 'space-between', // Ensure space between items
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: Colors.darkText,
  },
  createButton: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom:20,
    elevation:5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});

export default ManageAgreements;
