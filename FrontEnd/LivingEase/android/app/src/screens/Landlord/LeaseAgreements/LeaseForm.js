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
const LeaseForm = () => {
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
  const [propertyId, setPropertyId] = useState('');
  const [rentapplicationId, setrentApplicationId] = useState('');

  const [landlordSignature, setLandlordSignature] = useState('');
  const [tenantSignature, setTenantSignature] = useState('');
  const [landlordModalVisible, setLandlordModalVisible] = useState(false);
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const currentDate = new Date();
 

  useEffect(() => {
    const fetchLeaseDetails = async () => {
      try {
        const response = await apiClient.get(`/leaseAgreement/${leaseId}`);
        const leaseData = response.data;
        console.log('property id', response.data.propertyId._id);
        setTenantName(leaseData.tenantName);
        setTenantCnic(leaseData.tenantCnic);
        setRent(leaseData.rent);
        setLandlordCnic(leaseData.landlordCnic);
        setLandlordName(leaseData.landlordName);
        setLandlordSignature(leaseData.landlordSignature);
        setTenantId(leaseData.tenantId._id);
        setPropertyId(leaseData.propertyId._id);
      } catch (error) {
        console.error('Error fetching lease details:', error);
        Alert.alert('Error', 'Could not fetch leasedetails');
      }
    };

    fetchLeaseDetails();
  }, [leaseId]);
  const handleRemoveLease = async () => {
    try {
      await apiClient.delete(`/leaseAgreement/${leaseId}`);
      Alert.alert('Success', 'Lease agreement removed successfully.');
      navigation.goBack(); 
    } catch (error) {
      console.error('Error removing lease:', error);
      Alert.alert('Error', 'Could not remove lease agreement. Please try again.');
    }
  };


  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  const terms = [
    `The monthly rent for the property is fixed at Rs. ${rent} (Rupees ${rent} only), payable in advance within 10 days and 25th day of each month.`,
    `The tenancy period is from ${formatDate(tenancyStartDate)} to ${formatDate(
      tenancyEndDate,
    )}.`,
    "One month's notice from either party for vacation of the property is mandatory.",
    'The Tenant shall not make any alterations to the property without the written prior approval of the Landlord.',
    'The Tenant shall not sub-let the property wholly or partially.',
    'The possession of the property will be handed over to the Landlord upon expiry of this agreement.',
    'The Tenant shall return the property in the condition it was received, responsible for repairs or replacements of any wear and tear.',
    'The Tenant shall be solely responsible for the payment of all utility bills (Electricity, Gas, etc.) and shall provide the paid bills to the Landlord.',
    'The Landlord or their agents have the right to enter the property at reasonable times to inspect or make necessary repairs.',
    'Any breach of the above terms may result in immediate vacation of the property by the Tenant without notice.',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Parties Involved</Text>
        <Text style={styles.inputTitle}>Landlord's Name</Text>
        <Text style={styles.input}>{landlordName}</Text>

        <Text style={styles.inputTitle}>Landlord's CNIC No.</Text>
        <Text style={styles.input}>{landlordCnic}</Text>

        <Text style={styles.inputTitle}>Tenant's Name</Text>
        
        <Text style={styles.input}>{tenantName}</Text>
       
        <Text style={styles.inputTitle}>Tenant's CNIC No.</Text>
        <Text style={styles.input}>{tenantCnic}</Text>
        
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Terms and Conditions</Text>
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

      <TouchableOpacity
        style={{
          ...styles.button,
          alignSelf: 'center',
          marginBottom: 40,
          marginVertical: 20, // Adjusted margin for spacing between buttons
        }}
        onPress={handleRemoveLease}>
        <Text style={styles.buttonText}>Remove Lease Agreement</Text>
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

export default LeaseForm;
