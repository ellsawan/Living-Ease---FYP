import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,Modal,
} from 'react-native';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import apiClient from '../../../../../../apiClient';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Rating from '../../common/Rating';
const LeaseAgreementScreen = ({route,navigation}) => {
  const {leaseId} = route.params;
  const [agreementData, setAgreementData] = useState(null); // To store the fetched lease data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [reviewerId, setReviewerId] = useState('');
  const [ratedEntityId, setRatedEntityId] = useState('');
  const role = "Tenant"; // user being rated is tenant here
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  // Fetch lease agreement by leaseId
  useEffect(() => {
    const fetchLeaseAgreement = async () => {
      try {
        const response = await apiClient.get(`/leaseAgreement/${leaseId}`);
        setAgreementData(response.data);
        setRatedEntityId(response.data.tenantId._id);
        setReviewerId(response.data.landlordId._id);
        setLoading(false);
      } catch (err) {
        setError('Error fetching lease agreement');
        setLoading(false);
      }
    };

    fetchLeaseAgreement();
  }, [leaseId]);

  const handleRatingSubmit = async (ratingData) => {
    console.log('Submitted Rating:', ratingData);
     // Construct the data to be sent to the backend
     const dataToSend = {
      reviewerId,
      rating: ratingData.rating,
      review: ratingData.review,
      ratedEntityId, // ID of the user being rated
      role: role, // Role of the user submitting the rating
  };
    try {
      const response = await apiClient.post('/rating/ratings', dataToSend);
      Alert.alert('Success', response.data.message); 

    setIsRatingModalVisible(false);
    navigation.goBack();
  } catch (error) {
    console.error('Error submitting rating:', error);
    Alert.alert('Error', 'Failed to submit rating. Please try again.'); // Display error message
}
};

 // Function to handle lease termination
 const handleTerminate = ()=> {
  Alert.alert(
    'Confirm Termination',
    'Are you sure you want to terminate this lease agreement?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const response = await apiClient.put(`/leaseAgreement/${leaseId}`, {
              status: 'Terminated', // Assuming the status field in the request body
            });
            Alert.alert('Success', 'Lease has been terminated.', [
              {
                  text: 'OK',
                  onPress: () => {
                      setIsRatingModalVisible(true); // Show the rating modal immediately after the alert
                  },
              },
          ]);
          } catch (error) {
            Alert.alert('Error', 'Failed to terminate the lease agreement.');
            console.error('Termination Error:', error);
          }
        },
      },
    ],
    { cancelable: false }
  );
};

  // Function to handle downloading the lease agreement
  const handleDownload = async () => {
    if (!agreementData) return;

    const htmlContent = `
      <h1>Lease Agreement</h1>
      <p>This rent agreement is signed on this day of ${new Date(agreementData.updatedAt).toLocaleDateString()}.</p>
      <h2>BETWEEN</h2>
      <p>${agreementData.landlordName}</p>
      <p>Hereinafter referred to as the “landlord” of the one part.</p>
      <h2>AND</h2>
      <p>${agreementData.tenantName}</p>
      <p>Hereinafter referred to as the “tenant” of the other part.</p>
      <h3>Terms:</h3>
      <ul>
        ${agreementData.terms.map(term => `<li>${term}</li>`).join('')}
      </ul>
      <h2>Signatures</h2>
      <p>Tenant's Signature: <img src="data:image/png;base64,${agreementData.tenantSignature}" /></p>
      <p>Landlord's Signature: <img src="data:image/png;base64,${agreementData.landlordSignature}" /></p>
      <p>Tenant CNIC: ${agreementData.tenantCnic}</p>
      <p>Landlord CNIC: ${agreementData.landlordCnic}</p>
    `;
    console.log('HTML Content:', htmlContent);
    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'LeaseAgreement',
        directory: 'Documents',
      });
      Alert.alert('Download Complete', `File saved to ${pdf.filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF.');
      console.error(error);
    }
  };


  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={styles.loader}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Destructure the data for easier access
  const {
    terms,
    tenantName,
    tenantCnic,
    landlordName,
    landlordCnic,
    tenancyStartDate,
    tenancyEndDate,
    updatedAt,
    tenantSignature,
    landlordSignature,
  } = agreementData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.agreementText}>
        This rent agreement is signed on this day of{' '}
        <Text style={styles.updatedAt}>
          {new Date(updatedAt).toLocaleDateString()}
        </Text>
        .
      </Text>

      <Text style={styles.agreementText}>BETWEEN</Text>

      <Text style={styles.landlordName}>{landlordName}</Text>

      <Text style={styles.agreementText}>
        Hereinafter referred to as the “landlord” of the one part.
      </Text>

      <Text style={styles.agreementText}>AND</Text>

      <Text style={styles.tenantName}>{tenantName}</Text>

      <Text style={styles.agreementText}>
        Hereinafter referred to as the “tenant” of the other part.
      </Text>

      <Text style={styles.agreementText}>
        Whereas the landlord confirms that they are legally competent to rent
        out this property, which includes the necessary electrical fittings and
        fixtures. The landlord has agreed to rent, and the tenant has agreed to
        accept the rent for the aforementioned property.
      </Text>

      <Text style={styles.agreementText}>
        NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS FOLLOWS:
      </Text>

      <Text style={styles.sectionHeader}>Terms:</Text>
      {terms && terms.length > 0 ? (
        terms.map((term, index) => (
          <Text key={index} style={styles.termText}>
            {index + 1}. {term}
          </Text>
        ))
      ) : (
        <Text style={styles.noTermsText}>No terms available.</Text>
      )}

      {/* Displaying Signatures */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureSection}>
          <Text style={styles.label}>Tenant's Signature:</Text>
          {tenantSignature ? (
            <Image
              style={styles.signatureImage}
              source={{uri: `data:image/png;base64,${tenantSignature}`}}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.noSignatureText}>No signature available</Text>
          )}
          <Text style={styles.cnicText}>Tenant CNIC: </Text>
          <Text style={styles.cnicText}> {tenantCnic}</Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.label}>Landlord's Signature:</Text>
          {landlordSignature ? (
            <Image
              style={styles.signatureImage}
              source={{uri: `data:image/png;base64,${landlordSignature}`}}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.noSignatureText}>No signature available</Text>
          )}
          <Text style={styles.cnicText}>Landlord CNIC:</Text>
          <Text style={styles.cnicText}>{landlordCnic}</Text>
        </View>
      </View>

      {/* Terminate and Download buttons */}
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Text style={styles.buttonText}>Download Lease
            
          </Text>
        </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.terminateButton} onPress={handleTerminate}>
          <Text style={styles.buttonText}>Terminate Lease</Text>
        </TouchableOpacity>
       
      </View>
         {/* Rating Modal */}
<Modal
  transparent={true}
  visible={isRatingModalVisible}
  animationType="slide"
  onRequestClose={() => setIsRatingModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Rating onSubmit={handleRatingSubmit} />
    
    </View>
  </View>
</Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  loader: {
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
    color: 'red',
    textAlign: 'center',
  },
  agreementText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginBottom: 10,
    lineHeight: 24,
    textAlign: 'center', // Center align the text
  },
  updatedAt: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
  },
  landlordName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    textAlign: 'center', // Center align the landlord name
  },
  tenantName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    textAlign: 'center', // Center align the tenant name
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left', // Center align the section header
  },
  termText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'left', // Center align the term text
  },
  noTermsText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.gray,
    fontStyle: 'italic',
    textAlign: 'center', // Center align the no terms text
  },
  signatureContainer: {
    flexDirection: 'row', // Arrange signatures side by side
    justifyContent: 'space-between', // Space between signatures
    marginTop: 30,
  },
  signatureSection: {
    width: '48%', // Adjust width to fit two signatures in one row
    marginBottom: 20,
    alignItems: 'center', // Center the content in the signature section
  },
  signatureImage: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 5,
  },
  noSignatureText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.gray,
    fontStyle: 'italic',
    textAlign: 'center', // Center align the no signature text
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    textAlign: 'center', // Center align the label text
  },
  cnicText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.darkText,
    marginTop: 5,
    textAlign: 'left', // Center align the CNIC text
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons side by side
    justifyContent: 'space-between', // Space between buttons
    marginTop: 20,
    paddingHorizontal: 10, // Add padding to the left and right for better spacing
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1, 
    marginHorizontal: 5, 
    elevation:5,
    justifyContent: 'center',
  },
  terminateButton: {
    backgroundColor: 'red', // Set the color of the terminate button to red
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  modalContainer: {
    width: '100%', 
    padding: 20, 
  
    
  },
});

export default LeaseAgreementScreen;
