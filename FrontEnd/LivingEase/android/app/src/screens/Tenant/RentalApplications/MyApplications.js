import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplicationCard from './ApplicationCard';
import fonts from '../../../constants/Font';

const ManageApplications = () => {
  const [tenantId, setTenantId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setTenantId(id);
        }
      } catch (error) {
        console.error('Failed to fetch tenant ID from storage:', error);
      }
    };

    fetchTenantId();
  }, []);

  // Add a useEffect to log tenantId when it updates
  useEffect(() => {
    if (tenantId) {
      console.log('Tenant ID:', tenantId);
    }
  }, [tenantId]);

  const fetchApplications = async () => {
    if (tenantId) {
      try {
        const response = await apiClient.get(
          `/rentalApplication/tenant/${tenantId}/rental-applications`,
        );
        setApplications(response.data);
        console.log('Fetched Applications:', response.data);
      } catch (error) {
        console.error('Failed to fetch rental applications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch applications when screen is focused and tenantId is available
  useFocusEffect(
    React.useCallback(() => {
      if (tenantId) {
        fetchApplications();
      }
    }, [tenantId]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const filteredApplications = applications.filter(
    application => application.status === activeTab.toLowerCase(),
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Pending', 'Accepted', 'Rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.tabContent} nestedScrollEnabled={true}>
        <FlatList
          scrollEnabled={false}
          data={filteredApplications}
          renderItem={({item}) => {
            const tenant = item.tenantId; // Access the tenantId object directly
            const tenantFirstName = tenant.firstName; // Get the first name
            const tenantLastName = tenant.lastName; // Get the last name
            const tenantProfileImage =
              tenant?.profileImage?.url ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; // Updated line

            return (
              <ApplicationCard
                application={item}
                tenantFirstName={tenantFirstName} // Pass the first name
                tenantLastName={tenantLastName} // Pass the last name
                tenantProfileImage={tenantProfileImage} // Pass the profile image
              />
            );
          }}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
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
  tabContent: {
    flex: 1,
    width: '100%',
  },
  list: {
    paddingBottom: 20,
  },
});

export default ManageApplications;
