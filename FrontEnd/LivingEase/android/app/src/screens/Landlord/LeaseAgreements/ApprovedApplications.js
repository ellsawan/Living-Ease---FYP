import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import apiClient from '../../../../../../apiClient'; 
import Colors from '../../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplicationCard from '../RentalApplications/ApplicationCard';
import { useNavigation } from '@react-navigation/native';
import fonts from '../../../constants/Font';

const ApprovedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlordId, setLandlordId] = useState(null);
  const [tenants, setTenants] = useState({});
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const navigation = useNavigation();

  const fetchApprovedApplications = async () => {
    if (landlordId) {
      try {
        const response = await apiClient.get(`/rentalApplication/landlords/${landlordId}/rental-applications`);
        const approvedApplications = response.data.filter(application => application.status === 'accepted');
        setApplications(approvedApplications);
      } catch (error) {
        console.error('Failed to fetch approved applications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

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

  useEffect(() => {
    fetchLandlordId();
  }, []);

  useEffect(() => {
    fetchApprovedApplications();
  }, [landlordId]);

  const fetchTenantDetails = async (tenantId) => {
    try {
      const response = await apiClient.get(`/tenant/user/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tenant details for ${tenantId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadTenantDetails = async () => {
      if (applications.length > 0) {
        const updatedTenants = {};
        for (const application of applications) {
          const tenant = await fetchTenantDetails(application.tenantId);
          if (tenant) {
            updatedTenants[application.tenantId] = tenant;
          }
        }
        setTenants(updatedTenants);
      }
    };
    loadTenantDetails();
  }, [applications]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleSelectApplication = (applicationId) => {
    // Set the selected application ID
    setSelectedApplicationId(applicationId);
  };

  const handleNext = () => {
    if (selectedApplicationId) {
      navigation.navigate('LeaseAgreementTemplate', { applicationId:selectedApplicationId});
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        renderItem={({ item }) => {
          const tenant = tenants[item.tenantId];
          return (
            <ApplicationCard
              application={item}
              tenantFirstName={tenant?.user?.firstName}
              tenantLastName={tenant?.user?.lastName}
              tenantProfileImage={tenant?.user?.profileImage?.url}
              onSelect={() => handleSelectApplication(item._id)} 
              isSelected={selectedApplicationId === item._id} // Check if this application is selected
            />
          );
        }}
        keyExtractor={item => item._id}
      />
      <TouchableOpacity 
        style={[styles.nextButton, { backgroundColor: selectedApplicationId ? Colors.primary : Colors.gray }]} 
        onPress={handleNext} 
        disabled={!selectedApplicationId}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
  nextButton: {
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});

export default ApprovedApplications;
