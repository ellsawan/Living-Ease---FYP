import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import fonts from '../../../constants/Font';
import PropertyCard from '../PropertyCard';

export default function ApplicationDetails({ route, navigation }) {
  const { applicationId } = route.params;
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await apiClient.get(
          `/rentalApplication/rental-applications/${applicationId}`,
        );
        setApplicationDetails(response.data);
      } catch (error) {
        console.error('Error fetching application details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const handleApprove = async () => {
    try {
      await apiClient.patch(
        `/rentalApplication/rental-applications/${applicationId}/status`,
        { status: 'accepted' },
      );
      alert('Application approved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application.');
    }
  };

  const handleReject = async () => {
    try {
      await apiClient.patch(
        `/rentalApplication/rental-applications/${applicationId}/status`,
        { status: 'rejected' },
      );
      alert('Application rejected successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!applicationDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching application details.
        </Text>
      </View>
    );
  }

  const tenant = applicationDetails.tenantId;
  const property = applicationDetails.propertyId;

  const handleViewProfile = () => {
    navigation.navigate('TenantProfile', { tenantId: tenant._id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Full Name:</Text>
        <Text style={styles.detailText}>{applicationDetails.fullName}</Text>
      </View>

      {/* Additional tenant details */}
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>DOB:</Text>
        <Text style={styles.detailText}>
          {new Date(applicationDetails.dob).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>CNIC:</Text>
        <Text style={styles.detailText}>{applicationDetails.cnic}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Job Title</Text>
        <Text style={styles.detailText}>{applicationDetails.jobTitle}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Number of Occupants:</Text>
        <Text style={styles.detailText}>
          {applicationDetails.numberOfOccupants}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Has Pets:</Text>
        <Text style={styles.detailText}>
          {applicationDetails.hasPets ? 'Yes' : 'No'}
        </Text>
      </View>
      {applicationDetails.hasPets && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Pet Details:</Text>
          <Text style={styles.detailText}>{applicationDetails.petDetails}</Text>
        </View>
      )}
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Has Vehicles:</Text>
        <Text style={styles.detailText}>
          {applicationDetails.hasVehicles ? 'Yes' : 'No'}
        </Text>
      </View>
      {applicationDetails.hasVehicles && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Vehicle Details:</Text>
          <Text style={styles.detailText}>
            {applicationDetails.vehicleDetails}
          </Text>
        </View>
      )}
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Desired Move-In Date:</Text>
        <Text style={styles.detailText}>
          {new Date(applicationDetails.desiredMoveInDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Expected Lease Duration:</Text>
        <Text style={styles.detailText}>{applicationDetails.leaseType}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Additional Information:</Text>
        <Text style={styles.detailText}>
          {applicationDetails.tenantInterest}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Application Submission Date:</Text>
        <Text style={styles.detailText}>
          {new Date(applicationDetails.submissionDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Display rejection reason if it exists */}
      {applicationDetails.status === 'rejected' && applicationDetails.rejectionReason && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Rejection Reason:</Text>
          <Text style={styles.detailText}>{applicationDetails.rejectionReason}</Text>
        </View>
      )}
{/* Displaying property details using PropertyCard */}
<View style={styles.detailContainer}>
  <Text style={styles.detailLabel}>For Property:</Text>
  {property ? (
    <PropertyCard
      property={{
        propertyName: property.propertyName,
        location: property.location,
        rentPrice: property.rentPrice,
        images: property.images || [],
      }}
      onPress={() => navigation.navigate('PropertyDetails', { propertyId: property._id })} // Pass propertyId
    />
  ) : (
    <Text style={styles.errorText}>Property not available.</Text>
  )}
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: fonts.semiBold,
    marginBottom:20,
  },
  detailContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  detailLabel: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: Colors.blue,
  },
  detailText: {
    backgroundColor: Colors.lightgrey,
    borderColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
  },
});
