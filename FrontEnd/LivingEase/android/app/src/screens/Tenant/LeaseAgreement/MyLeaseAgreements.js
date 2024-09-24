import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../../../../apiClient';
import LeaseAgreementCard from './LeaseAgreementCard';
import fonts from '../../../constants/Font';
const MyLeaseAgreements = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLeaseAgreements = async () => {
      try {
        const tenantId = await AsyncStorage.getItem('userId');
        if (tenantId) {
          const response = await apiClient.get(`/leaseAgreement/tenant/${tenantId}`);
          setLeaseAgreements(response.data);
        }
      } catch (error) {
        console.error("Error fetching lease agreements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaseAgreements();
  }, []);

  const filteredLeases = leaseAgreements.filter(lease => lease.status === activeTab);

  const handleViewDetails = (leaseId) => {
    navigation.navigate('LeaseDetails', { leaseId });
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredLeases}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.leaseCard}>
              <LeaseAgreementCard leaseData={item} />
           
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.bold,
  },
  viewButton: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    marginTop: 5,
    justifyContent: 'center',  // Center the content vertically
    alignItems: 'center',      // Center the content horizontally
    flexDirection: 'row',      // Ensure that the content is row-oriented
  },
  viewButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: fonts.bold,
    textAlign: 'center',       // Center the text
  },
  list: {
    paddingBottom: 20,
  },
});

export default MyLeaseAgreements;
