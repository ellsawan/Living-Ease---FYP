import React, {useState, useRef, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import SignatureScreenComponent from '../../Landlord/LeaseAgreements/SignatureScreen'; // Import the SignatureScreenComponent
import apiClient from '../../../../../../apiClient';
import {useNavigation} from '@react-navigation/native';
const LeaseAgreementTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {leaseId} = route.params;
  console.log('Received leaseID:', leaseId);
  const [checked, setChecked] = useState(false);
  const [rent, setRent] = useState('');
  const [tenancyStartDate, setTenancyStartDate] = useState(new Date());
  const [tenancyEndDate, setTenancyEndDate] = useState(new Date());
  const [landlordName, setLandlordName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [landlordCnic, setLandlordCnic] = useState('');
  const [tenantCnic, setTenantCnic] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
const[propertyId, setPropertyId] = useState('');
  const [rentapplicationId, setrentApplicationId] = useState('');

  const [landlordSignature, setLandlordSignature] = useState('');
  const [tenantSignature, setTenantSignature] = useState('');
  const [landlordModalVisible, setLandlordModalVisible] = useState(false);
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [terms,setTerms]=useState(['']);
  const currentDate = new Date();
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log(token);
      return token;
   
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const fetchLeaseDetails = async () => {
      try {
        const response = await apiClient.get(`/leaseAgreement/${leaseId}`);
        const leaseData = response.data;
console.log('property id',response.data.propertyId._id)
        setTenantName(leaseData.tenantName);
        setTenantCnic(leaseData.tenantCnic);
        setRent(leaseData.rent);
        setLandlordCnic(leaseData.landlordCnic);
        setLandlordName(leaseData.landlordName);
        setLandlordSignature(leaseData.landlordSignature);
        setTenantId(leaseData.tenantId._id);
        setTerms(leaseData.terms)
      setPropertyId(leaseData.propertyId._id)
      } catch (error) {
        console.error('Error fetching lease details:', error);
        Alert.alert('Error', 'Could not fetch leasedetails');
      }
    };

    fetchLeaseDetails();
  }, [leaseId]);
  const isNameValid = name => {
    // Check if the name contains any numbers
    return /^[A-Za-z\s]+$/.test(name);
  };

  const handleUpdateTenantDetails = async () => {
    // Basic validation checks
    if (!tenantName || !tenantCnic || !tenantSignature) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
  
    if (tenantCnic.length !== 13 || !/^\d+$/.test(tenantCnic)) {
      Alert.alert('Error', 'Tenant CNIC must be exactly 13 digits.');
      return;
    }
  
    if (!isNameValid(tenantName)) {
      Alert.alert('Error', 'Tenant name cannot contain numbers.');
      return;
    }
  
    if (!checked) {
      Alert.alert('Error', 'You must agree to the terms and conditions.');
      return;
    }
  
    const tenantData = {
      tenantName,
      tenantCnic,
      tenantId,
      propertyId,
      tenantSignature,
      status: 'Active',
    };
  
    // Check if tenant has an active lease
    try {
      const activeLeaseResponse = await apiClient.get(`/leaseAgreement/active/${tenantId}`);
      if (activeLeaseResponse.status === 200 && activeLeaseResponse.data.active) {
        Alert.alert('Error', 'You can only rent one property at a time.');
        return; // Exit if the tenant has an active lease
      }
    } catch (error) {
      console.error('Error checking active lease:', error);
      Alert.alert('Error', 'Failed to check active lease status.');
      return; // Exit if there was an error checking the active lease
    }
  
    const rentedData = {
      propertyId,
      tenantId,
    };
  
    // Update lease agreement
    try {
      const response = await apiClient.put(`/leaseAgreement/${leaseId}`, tenantData);
      const token = await getAuthToken(); // Assuming you have a function to get the auth token
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      // Update property status to rented
      try {
        const propertyResponse = await apiClient.post('/property/setRentedBy', rentedData, { headers });
       
      } catch (error) {
        console.error('Error updating property status:', error);
        Alert.alert('Error', 'Failed to update property status.');
      }
  
      // Also update property status
      try {
        const propertyResponse = await apiClient.put(`/property/${propertyId}/status/rented`, {}, { headers });
    
      } catch (error) {
        console.error('Error updating property status:', error);
        Alert.alert('Error', 'Failed to update property status.');
      }
  
      // Final update confirmation
      if (response.status === 200) {
        Alert.alert('Success', 'Agreement Accepted successfully.');
        navigation.goBack();
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error updating tenant details:', error);
      Alert.alert('Error', 'Failed to update tenant details');
    }
  };
  

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Parties Involved</Text>
        <Text style={styles.inputTitle}>Landlord's Name</Text>
        <Text style={styles.input}>{landlordName}</Text>

        <Text style={styles.inputTitle}>Landlord's CNIC No.</Text>
        <Text style={styles.input}>{landlordCnic}</Text>

        <Text style={styles.inputTitle}>Tenant's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Tenant's Name"
          value={tenantName}
          onChangeText={setTenantName}
        />
        <Text style={styles.inputTitle}>Tenant's CNIC No.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Tenant's CNIC"
          keyboardType="numeric"
          value={tenantCnic}
          onChangeText={text => {
            const numericValue = text.replace(/[^0-9]/g, '');
            if (numericValue.length <= 13) {
              setTenantCnic(numericValue);
            }
          }}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Terms and Conditions</Text>
        {terms.map((term, index) => (
          <View key={index} style={styles.termContainer}>
            <Text style={styles.termNumber}>{index + 1}.</Text>
            <Text style={styles.termText}>{term}</Text>
          </View>
        ))}
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Monthly Rent</Text>
          <Text style={styles.input}>{rent}</Text>

          <Text style={styles.inputTitle}>Tenancy Start Date</Text>
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateInput}>{formatDate(tenancyStartDate)}</Text>
          </View>
          <Text style={styles.inputTitle}>Tenancy End Date</Text>
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateInput}>{formatDate(tenancyEndDate)}</Text>
          </View>
        </View>

        {terms.map((term, index) => (
          <View key={index} style={styles.termContainer}>
            <Text style={styles.termNumber}>{index + 1}.</Text>
            <Text style={styles.termText}>{term}</Text>
          </View>
        ))}

        <View style={styles.agreementContainer}>
          <CheckBox
            value={checked}
            onValueChange={() => setChecked(!checked)}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            I agree to the terms and conditions
          </Text>
        </View>
      </View>

      {/* Landlord's Signature Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Landlord's Signature</Text>
        <Image
          source={{uri: `data:image/png;base64,${landlordSignature}`}} // Change image/png to the correct type if needed
          style={styles.signatureImage}
          resizeMode="contain" // or "cover" depending on your layout preference
        />
      </View>

      {/* Landlord's Signature Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tenant's Signature</Text>

        <View style={styles.signaturePartyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setTenantModalVisible(true)}>
            <Text style={styles.buttonText}>Sign Here</Text>
          </TouchableOpacity>
          <Text style={styles.body}>
            Digital Signature: {tenantSignature ? '✔️' : '❌'}
          </Text>
        </View>
      </View>

      {/* Tenant Signature Modal */}
      <Modal
        visible={tenantModalVisible}
        animationType="slide"
        onRequestClose={() => setTenantModalVisible(false)}>
        <SignatureScreenComponent
          onOK={signature => {
            setTenantSignature(signature);
            setTenantModalVisible(false);
          }}
        />
      </Modal>

      <TouchableOpacity
        style={{
          ...styles.button,
          alignSelf: 'center',
          marginBottom: 40,
          marginVertical: 20, // Adjusted margin for spacing between buttons
        }}
        onPress={handleUpdateTenantDetails}>
        <Text style={styles.buttonText}>Accept Lease Agreement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  signatureImage: {
    width: 200,
    height: 100,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  sectionContainer: {
    marginVertical: 10,
    marginBottom: 10,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.semiBold,
    marginBottom: 5,
  },
  terms: {
    fontSize: 14,
    color: Colors.blue,
    fontFamily: fonts.semiBold,
    marginBottom: 5,
  },
  body: {
    fontSize: 16,
    color: Colors.blue,
    marginBottom: 10,
    fontFamily: fonts.bold,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    fontFamily: fonts.regular,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateInputContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateInput: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.regular,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.regular,
  },
  termContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  termNumber: {
    fontSize: 16,
    color: Colors.blue,
    marginRight: 10,
    fontFamily: fonts.bold,
  },
  termText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.regular,
    marginRight: 12,
  },
  signaturePartyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  body: {
    fontSize: 14,
    marginVertical: 4,
    fontFamily: fonts.regular,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },

  buttonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});

export default LeaseAgreementTemplate;
