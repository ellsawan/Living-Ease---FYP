import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Colors from '../../../constants/Colors'; // Adjust import based on your structure
import fonts from '../../../constants/Font';
import { useNavigation,useFocusEffect  } from '@react-navigation/native'; // Import useNavigation
import apiClient from '../../../../../../apiClient'; // Adjust the path based on your project
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeaseAgreementCard from './LeaseCard'; // Import the LeaseAgreementCard component

const ManageAgreements = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlordId, setLandlordId] = useState('');
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchLandlordId = async () => {
      const id = await AsyncStorage.getItem('userId'); // Adjust the key as necessary
      setLandlordId(id);
    };

    fetchLandlordId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLeaseAgreements = async () => {
        if (!landlordId) return;
  
        setLoading(true);
        try {
          const response = await apiClient.get(`/leaseAgreement/landlord/${landlordId}`);
          const data = Array.isArray(response.data) ? response.data : [];
          console.log("API Response Data:", data);
          setLeaseAgreements(data);
        } catch (error) {
          console.error("Error fetching lease agreements:", error);
          setLeaseAgreements([]); // Fallback
        } finally {
          setLoading(false);
        }
      };
  
      fetchLeaseAgreements();
    }, [landlordId])
  );
  
  const filteredLeases = Array.isArray(leaseAgreements)
    ? leaseAgreements.filter(lease => lease.status === activeTab)
    : [];
  

  const handleCreateLeaseAgreement = () => {
    navigation.navigate('ApprovedApplications'); // Replace with your actual route name
  };

  const renderLeaseAgreement = ({ item }) => (
    <LeaseAgreementCard leaseData={item} />
  );

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

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={filteredLeases}
          keyExtractor={item => item._id.toString()}
          renderItem={renderLeaseAgreement}
          ListEmptyComponent={<Text style={styles.emptyText}>No {activeTab} Lease Agreements</Text>}
        />
      )}

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
    justifyContent: 'space-between',
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
  emptyText: {
    fontSize: 16,
    color: Colors.placeholdertext,
    textAlign: 'center',
    marginTop: 20,
  },
  createButton: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});

export default ManageAgreements;
