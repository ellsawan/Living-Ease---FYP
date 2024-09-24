import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,Modal,TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import fonts from '../../../constants/Font';
import TenantCard from '../TenantCard';
import PropertyCard from '../Property/PropertyCard';
export default function ApplicationDetails({route, navigation}) {
  const {applicationId} = route.params;
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false); // For showing rejection modal
  const [rejectionReason, setRejectionReason] = useState(''); // To capture rejection reason

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
        {status: 'accepted'},
      );
      alert('Application approved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application.');
    }
  };

  const handleReject = async () => {
    setModalVisible(true);
  };
  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    try {
      await apiClient.patch(
        `/rentalApplication/rental-applications/${applicationId}/status`,
        {status: 'rejected', rejectionReason}, // Pass the reason
      );
      alert('Application rejected successfully!');
      setModalVisible(false); // Close the modal
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
    navigation.navigate('TenantProfile', { tenantId: applicationDetails.tenantId._id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailContainer}>
        <TenantCard
          firstName={tenant?.firstName}
          lastName={tenant?.lastName}
          profileImage={tenant?.profileImage?.url}
          onViewProfile={handleViewProfile}
        />
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
    {/* Property details */}
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
            onPress={() => {}}
          />
        ) : (
          <Text style={styles.errorText}>Property details are not available.This property was either Rented or Deleted.</Text>
        )}
      </View>
     {/* Approve/Reject buttons */}
{property && (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
      <Text style={styles.buttonText}>Accept</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
      <Text style={styles.buttonText}>Reject</Text>
    </TouchableOpacity>
  </View>
)}
  {/* Rejection reason modal */}
  <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejection Reason</Text>
            <TextInput
              style={styles.rejectionInput}
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitRejection}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Poppins-Regular',
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
  propertyLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  propertyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 5,
    paddingBottom: 50,
  },
  approveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    flex: 0.48,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 30,
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginBottom: 10,
  },
  rejectionInput: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    flex: 0.45,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    flex: 0.45,
  },
});
