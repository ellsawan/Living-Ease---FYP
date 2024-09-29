import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../constants/Colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import apiClient from '../../../../../../apiClient';
import LeaseAgreementCard from './LeaseAgreementCard';
import fonts from '../../../constants/Font';

const MyLeaseAgreements = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Function to fetch lease agreements
  const fetchLeaseAgreements = async () => {
    try {
      setLoading(true); // Show loading indicator
      const tenantId = await AsyncStorage.getItem('userId');
      if (tenantId) {
        const response = await apiClient.get(
          `/leaseAgreement/tenant/${tenantId}`,
        );
        setLeaseAgreements(response.data); // Update state with fetched data
      }
    } catch (error) {
      console.error('Error fetching lease agreements:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Fetch lease agreements when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchLeaseAgreements();
    }, []),
  );

  // Filter only active and pending lease agreements
  const filteredLeases = leaseAgreements.filter(lease => {
    if (activeTab === 'Active') {
      return lease.status === 'Active';
    } else if (activeTab === 'Pending') {
      return lease.status === 'Pending';
    }
    return false;
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {/* Only Active and Pending tabs */}
        {['Active', 'Pending'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          {filteredLeases.length === 0 ? (
            <View style={styles.noAgreementsContainer}>
              <Text style={styles.noAgreementsText}>
                There are no agreements
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredLeases}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => (
                <View style={styles.leaseCard}>
                  <LeaseAgreementCard leaseData={item} />
                </View>
              )}
              contentContainerStyle={styles.list}
            />
          )}
        </>
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
  noAgreementsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAgreementsText: {
    fontSize: 18,
    color: Colors.blue,
    fontFamily: fonts.bold,
  },
  leaseCard: {
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
});

export default MyLeaseAgreements;
