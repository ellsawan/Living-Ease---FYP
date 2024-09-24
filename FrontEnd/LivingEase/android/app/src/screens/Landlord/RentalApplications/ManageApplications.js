import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import here
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplicationCard from './ApplicationCard';
import fonts from '../../../constants/Font';

const ManageApplications= () => {
  const [landlordId, setLandlordId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState({});
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    const fetchLandlordId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setLandlordId(id);
        }
      } catch (error) {
        console.error('Failed to fetch landlord ID from storage:', error);
      }
    };

    fetchLandlordId();
  }, []);

  const fetchApplications = async () => {
    if (landlordId) {
      try {
        const response = await apiClient.get(`/rentalApplication/landlords/${landlordId}/rental-applications`);
        console.log('app',response.data)
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch rental applications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add useFocusEffect here
  useFocusEffect(
    React.useCallback(() => {
      fetchApplications();
    }, [landlordId])
  );

  useEffect(() => {
    const fetchTenantDetails = async (userId) => {
      try {
        const response = await apiClient.get(`/tenant/user/${userId}`);
      
        setTenants(prevTenants => ({
          ...prevTenants,
          [userId]: response.data,
        }));
      } catch (error) {
        console.error(`Failed to fetch tenant details for ${userId}:`, error);
      }
    };

    if (applications.length > 0) {
      applications.forEach(application => {
        const tenantId = application.tenantId; // Ensure this is correct
        if (!tenants[tenantId]) {
          fetchTenantDetails(tenantId); // Fetch tenant details only if not already fetched
        }
      });
    }
  }, [applications]);

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
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.tabContent} nestedScrollEnabled={true}>
      <FlatList
  scrollEnabled={false}
  data={filteredApplications}
  renderItem={({ item }) => {
    const tenant = tenants[item.tenantId];

    // Check if propertyId exists before rendering the ApplicationCard
    if (!item.propertyId) {
      return null; // Don't render anything if propertyId is not available
    }

    return (
      <ApplicationCard
        application={item}
        tenantFirstName={tenant?.user?.firstName}
        tenantLastName={tenant?.user?.lastName}
        tenantProfileImage={tenant?.user?.profileImage?.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
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
