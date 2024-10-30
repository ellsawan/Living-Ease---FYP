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
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import SignatureScreenComponent from './SignatureScreen'; // Import the SignatureScreenComponent
import apiClient from '../../../../../../apiClient';
import {useNavigation} from '@react-navigation/native';
const LeaseAgreementTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {applicationId} = route.params;
  console.log('Received applicationId:', applicationId);
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
  const [tenantId, setTenantId] = useState('');
  const [landlordId, setLandlordId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [rentapplicationId, setrentApplicationId] = useState('');
  const [termModalVisible, setTermModalVisible] = useState(false);
  const [landlordSignature, setLandlordSignature] = useState('');
  const [landlordModalVisible, setLandlordModalVisible] = useState(false);
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [editingTermIndex, setEditingTermIndex] = useState(null);
  const [editingTermValue, setEditingTermValue] = useState('');
  const currentDate = new Date();
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await apiClient.get(
          `rentalApplication/rental-applications/${applicationId}`,
        );
        const application = response.data;

        setTenantName(application.fullName);
        setTenantCnic(application.cnic);
        setTenantId(application.tenantId._id);
        setLandlordId(application.landlordId._id);
        setPropertyId(application.propertyId._id);
        setrentApplicationId(application._id);
      } catch (error) {
        console.error('Error fetching application details:', error);
        Alert.alert('Error', 'Could not fetch application details');
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);
  const isNameValid = name => {
    // Check if the name contains any numbers
    return /^[A-Za-z\s]+$/.test(name);
  };
  const handleEditTerm = index => {
    setEditingTermIndex(index);
    setEditingTermValue(terms[index]);
    setTermModalVisible(true);
  };

  const handleSaveTerm = () => {
    if (editingTermIndex !== null) {
      const updatedTerms = [...terms];
      updatedTerms[editingTermIndex] = editingTermValue;
      setTerms(updatedTerms);
      setTermModalVisible(false);
      setEditingTermIndex(null);
    }
  };
  const handleCreateLeaseAgreement = async () => {
    if (
      !tenantName ||
      !tenantCnic ||
      !landlordName ||
      !landlordCnic ||
      !rent ||
      !tenancyStartDate ||
      !tenancyEndDate
    ) {
      Alert.alert('Error', 'All fields must be filled.');
      return;
    }

    if (landlordCnic.length !== 13 || !/^\d+$/.test(landlordCnic)) {
      Alert.alert('Error', 'Landlord CNIC must be exactly 13 digits.');
      return;
    }

    if (tenantCnic.length !== 13 || !/^\d+$/.test(tenantCnic)) {
      Alert.alert('Error', 'Tenant CNIC must be exactly 13 digits.');
      return;
    }
    if (!checked) {
      Alert.alert('Error', 'You must agree to the terms and conditions.');
      return;
    }

    if (!landlordSignature) {
      Alert.alert('Error', 'Please provide a landlord signature.');
      return;
    }
    if (!isNameValid(landlordName)) {
      Alert.alert('Error', 'Landlord name cannot contain numbers.');
      return;
    }
    if (!isNameValid(tenantName)) {
      Alert.alert('Error', 'Tenant name cannot contain numbers.');
      return;
    }
    const leaseAgreementData = {
      landlordId,
      tenantId,
      propertyId,
      tenantName,
      tenantCnic,
      landlordCnic,
      landlordName,
      rent,
      terms,
      tenancyStartDate,
      tenancyEndDate,
      landlordSignature,
      tenantSignature: null, // Tenant will sign independently
      applicationId: rentapplicationId,
    };

    try {
      const response = await apiClient.post(
        '/leaseAgreement/',
        leaseAgreementData,
      );
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Lease agreement is created successfully and Shared with Tenant');
        navigation.navigate('ManageAgreements');
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Failed to create lease agreement');
    }
  };
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setTenancyStartDate(selectedDate);
      if (selectedDate > tenancyEndDate) {
        setTenancyEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      if (selectedDate < tenancyStartDate) {
        Alert.alert('Invalid Date', 'End date cannot be before start date.');
      } else {
        setTenancyEndDate(selectedDate);
      }
    }
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const [terms, setTerms]=useState([
    `The monthly rent for the property is fixed at Rs. ${rent} (Rupees ${rent} only), payable in advance within 10 days of each month.`,
    `The tenancy period is from ${formatDate(tenancyStartDate)} to ${formatDate(
      tenancyEndDate,
    )}.`,
   'The Landlord affirms that they are the rightful owner of the property and possess all necessary legal documentation, ensuring that the property meets legal requirements and has the necessary documentation.',
    'The Tenant shall not make any alterations to the property without the written prior approval of the Landlord.',
    'The Tenant shall not sub-let the property wholly or partially.',
    'The possession of the property will be handed over to the Landlord upon expiry of this agreement.',
    'The Tenant shall return the property in the condition it was received, responsible for repairs or replacements of any wear and tear.',
    'The Tenant shall be solely responsible for the payment of all utility bills (Electricity, Gas, etc.) and shall provide the paid bills to the Landlord.',
    'The Landlord or their agents have the right to enter the property at reasonable times to inspect or make necessary repairs.',
    'Any breach of the above terms may result in immediate vacation of the property by the Tenant without notice.',
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Parties Involved</Text>
        <Text style={styles.inputTitle}>Landlord's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Landlord's Name"
          value={landlordName}
          onChangeText={setLandlordName}
        />

        <Text style={styles.inputTitle}>Landlord's CNIC No.</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Landlord's CNIC"
          keyboardType="numeric"
          value={landlordCnic}
          onChangeText={text => {
            const numericValue = text.replace(/[^0-9]/g, '');
            if (numericValue.length <= 13) {
              setLandlordCnic(numericValue);
            }
          }}
        />

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
          <TouchableOpacity
            key={index}
            onPress={() => index > 1 && handleEditTerm(index)} // Only make editable if index > 1
            disabled={index < 2} // Disable click for first two terms
          >
            <View style={styles.termContainer}>
              <Text style={styles.termNumber}>{index + 1}.</Text>
              <Text style={index < 2 ? styles.termTextNonEditable : styles.termTextEditable}>
                {term}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Monthly Rent</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Monthly Rent"
            keyboardType="numeric"
            value={rent}
            onChangeText={value => {
              const numericValue = value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
              if (value !== numericValue) {
                Alert.alert(
                  'Invalid Input',
                  'Please enter only numeric values.',
                );
              }
              setRent(numericValue);
            }}
          />
          <Text style={styles.inputTitle}>Tenancy Start Date</Text>
          <View style={styles.dateInputContainer}>
            <Text
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}>
              Select Tenancy Start Date: {formatDate(tenancyStartDate)}
            </Text>
            {showStartDatePicker && (
              <DateTimePicker
                value={tenancyStartDate}
                mode="date"
                display="calendar"
                onChange={handleStartDateChange}
                minimumDate={currentDate}
              />
            )}
          </View>
          <Text style={styles.inputTitle}>Tenancy End Date</Text>
          <View style={styles.dateInputContainer}>
            <Text
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}>
              Select Tenancy End Date: {formatDate(tenancyEndDate)}
            </Text>
            {showEndDatePicker && (
              <DateTimePicker
                value={tenancyEndDate}
                mode="date"
                display="calendar"
                onChange={handleEndDateChange}
                minimumDate={tenancyStartDate}
              />
            )}
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

        <View style={styles.signaturePartyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setLandlordModalVisible(true)}>
            <Text style={styles.buttonText}>Sign Here</Text>
          </TouchableOpacity>
          <Text style={styles.body}>
            Digital Signature: {landlordSignature ? '✔️' : '❌'}
          </Text>
        </View>
      </View>

      {/* Tenant's Signature Section */}
      <View style={[styles.sectionContainer, {marginBottom: 40}]}>
        <Text style={styles.sectionTitle}>Tenant's Signature</Text>

        <Text style={styles.inputTitle}>
          The tenant will sign the agreement independently.
        </Text>
      </View>

      {/* Landlord Signature Modal */}
      <Modal
        visible={landlordModalVisible}
        animationType="slide"
        onRequestClose={() => setLandlordModalVisible(false)}>
        <SignatureScreenComponent
          onOK={signature => {
            setLandlordSignature(signature);
            setLandlordModalVisible(false);
          }}
        />
      </Modal>
      {/* Term Editing Modal */}
      <Modal
        visible={termModalVisible}
        animationType="slide"
        onRequestClose={() => setTermModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Term</Text>
          <TextInput
            style={styles.modalInput}
            value={editingTermValue}
            onChangeText={setEditingTermValue}
            multiline
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveTerm}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setTermModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          ...styles.button, // Spread the existing styles
          alignSelf: 'center', // Center the button
          marginBottom: 80, // Add margin at the bottom
        }}
        onPress={handleCreateLeaseAgreement}>
        <Text style={styles.buttonText}>Create Lease Agreement</Text>
      </TouchableOpacity>
      
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
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
  termTextNonEditable: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.primary,
    marginRight:8,
  },
  termTextEditable: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.primary,
    marginRight:8,
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
    backgroundColor: Colors.primary, // Button background color
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
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: Colors.white,
},
modalTitle: {
  fontSize: 20,
  fontFamily: fonts.bold,
  marginBottom: 20,
},
modalInput: {
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 5,
  padding: 10,
  width: '100%',
  height: 100,
  fontSize: 16,
  fontFamily: fonts.regular,
},
modalButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 20,
},
modalButton: {
  backgroundColor: Colors.primary,
  padding: 10,
  borderRadius: 25,
  flex: 1,
  marginHorizontal: 5,
},
modalButtonText: {
  color: Colors.white,
  fontSize: 16,
  fontFamily: fonts.semiBold,
  textAlign: 'center',
},
});

export default LeaseAgreementTemplate;
