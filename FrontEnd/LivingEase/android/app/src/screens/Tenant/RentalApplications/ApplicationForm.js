import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import commonStyles from '../../../constants/styles';
import apiClient from '../../../../../../apiClient';
const RentalApplicationForm = () => {
  const navigation = useNavigation(); // Get navigation object
  const route = useRoute(); // Access route parameters
  const {propertyId, ownerId, tenantId} = route.params; // Destructure parameters
  const [loading, setLoading] = useState(false); // Loading state
  const [formData, setFormData] = useState({
    fullName: '',
    dob: null,
    cnic: '',
    jobTitle: '',
    numberOfOccupants: 1,
    hasPets: false,
    petDetails: '',
    hasVehicles: false,
    vehicleDetails: '',
    leaseDuration: '',
    tenantInterest: '',
    leaseType: '',
  });
  const formatDate = date => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
    return `${day}-${month}-${year}`;
  };

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [showDesiredMoveInPicker, setShowDesiredMoveInPicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleDateChange = (name, selectedDate) => {
    handleInputChange(name, selectedDate || null); // Only set the date if selected
  };

  const handleIncrement = (name, value) => {
    setFormData({...formData, [name]: Math.max(1, formData[name] + value)});
  };

  const handleLeaseTypeChange = type => {
    setFormData({...formData, leaseType: type});
  };

  const handleSubmit = async () => {
    const {
      fullName,
      dob,
      cnic,
      jobTitle,
      numberOfOccupants,
      leaseType,
      tenantInterest,
      petDetails,
      vehicleDetails,
    } = formData;

    let errorMessage = '';

    // Check for missing required fields
    if (!fullName) {
      errorMessage += 'Full Name is required.\n';
    } else if (/\d/.test(fullName)) {
      errorMessage += 'Full Name should not contain numbers.\n';
    }

    if (!dob) {
      errorMessage += 'Date of Birth is required.\n';
    }

    if (!cnic) {
      errorMessage += 'CNIC Number is required.\n';
    } else if (!/^\d{13}$/.test(cnic)) {
      errorMessage +=
        'CNIC Number must be a 13-digit number and contain numbers only.\n';
    }

    if (!jobTitle) {
      errorMessage += 'Job Title is required.\n';
    }
    if (numberOfOccupants < 1) {
      errorMessage += 'Number of Occupants must be at least 1.\n';
    }
    if (!leaseType) {
      errorMessage += 'Expected Lease Duration is required.\n';
    }
    if (!tenantInterest) {
      errorMessage += 'Additional Information is required.\n';
    }
    if (formData.hasPets && !petDetails) {
      errorMessage += 'Pet Details are required if you have pets.\n';
    }
    if (formData.hasVehicles && !vehicleDetails) {
      errorMessage += 'Vehicle Details are required if you have vehicles.\n';
    }

    if (errorMessage) {
      Alert.alert('Missing Fields', errorMessage);
      return;
    }

    // Include additional required fields
    const updatedFormData = {
      ...formData,
      propertyId, // Include propertyId from route params
      landlordId: ownerId, // Include landlordId from route params
      tenantId, // Include tenantId from route params
    };

    setLoading(true); // Start loading
    try {
      const response = await apiClient.post(
        '/rentalApplication/rental-applications',
        updatedFormData,
      );
      console.log('Form submitted successfully:', response.data);
      Alert.alert(
        'Success',
        'Your application has been submitted successfully.',
      ); // Add success alert
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error(
        'Form submission error:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'There was an error submitting your application. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {/* Full Name */}
      <Text style={styles.labelText}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={formData.fullName}
        onChangeText={text => handleInputChange('fullName', text)}
      />
      {/* Date of Birth */}
      <Text style={styles.labelText}>Date of Birth</Text>
      <TouchableOpacity
        onPress={() => setShowDOBPicker(true)}
        style={styles.input}>
        <Text>
          {formData.dob ? formatDate(formData.dob) : 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>
      {showDOBPicker && (
        <DateTimePicker
          value={formData.dob || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDOBPicker(false);
            handleDateChange('dob', selectedDate);
          }}
        />
      )}

      {/* CNIC Number */}
      <Text style={styles.labelText}>CNIC Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 13 digit CNIC number"
        keyboardType="numeric"
        value={formData.cnic}
        onChangeText={text => handleInputChange('cnic', text)}
      />

      {/* Job Title */}
      <Text style={styles.labelText}>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your job title"
        value={formData.jobTitle}
        onChangeText={text => handleInputChange('jobTitle', text)}
      />

      {/* Number of Occupants with + - Incrementer */}
      <Text style={styles.labelText}>Number of Occupants</Text>
      <View style={styles.incrementerContainer}>
        <TouchableOpacity
          style={styles.incrementButton}
          onPress={() => handleIncrement('numberOfOccupants', -1)}>
          <Text style={styles.incrementButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.occupantCount}>{formData.numberOfOccupants}</Text>
        <TouchableOpacity
          style={styles.incrementButton}
          onPress={() => handleIncrement('numberOfOccupants', 1)}>
          <Text style={styles.incrementButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Pets */}
      <Text style={styles.labelText}>Do you have any pets?</Text>
      <View style={styles.switchContainer}>
        <Switch
          value={formData.hasPets}
          onValueChange={value => handleInputChange('hasPets', value)}
        />
        <Text>{formData.hasPets ? 'Yes' : 'No'}</Text>
      </View>
      {formData.hasPets && (
        <>
          <Text style={styles.labelText}>Pet Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter details of pets"
            value={formData.petDetails}
            onChangeText={text => handleInputChange('petDetails', text)}
          />
        </>
      )}

      {/* Vehicles */}
      <Text style={styles.labelText}>Do you have any vehicles?</Text>
      <View style={styles.switchContainer}>
        <Switch
          value={formData.hasVehicles}
          onValueChange={value => handleInputChange('hasVehicles', value)}
        />
        <Text>{formData.hasVehicles ? 'Yes' : 'No'}</Text>
      </View>
      {formData.hasVehicles && (
        <>
          <Text style={styles.labelText}>Vehicle Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter details of vehicles"
            value={formData.vehicleDetails}
            onChangeText={text => handleInputChange('vehicleDetails', text)}
          />
        </>
      )}

      {/* Desired Move-In Date */}
      <Text style={styles.labelText}>Desired Move-In Date</Text>
      <TouchableOpacity
        onPress={() => setShowDesiredMoveInPicker(true)}
        style={styles.input}>
        <Text>
          {formData.desiredMoveInDate
            ? formatDate(formData.desiredMoveInDate)
            : 'Select Move-In Date'}
        </Text>
      </TouchableOpacity>
      {showDesiredMoveInPicker && (
        <DateTimePicker
          value={formData.desiredMoveInDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDesiredMoveInPicker(false);
            handleDateChange('desiredMoveInDate', selectedDate);
          }}
        />
      )}

      {/* Lease Duration */}
      <Text style={styles.labelText}>Expected Lease Duration</Text>
      <View style={styles.leaseButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.leaseButton,
            formData.leaseType === 'Short Term'
              ? styles.leaseButtonActive
              : null,
          ]}
          onPress={() => handleLeaseTypeChange('Short Term')}>
          <Text style={styles.leaseButtonText}>Short Term</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.leaseButton,
            formData.leaseType === 'Long Term'
              ? styles.leaseButtonActive
              : null,
          ]}
          onPress={() => handleLeaseTypeChange('Long Term')}>
          <Text style={styles.leaseButtonText}>Long Term</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Information */}
      <Text style={styles.labelText}>Additional Information</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Express your interest or provide additional information"
        value={formData.tenantInterest}
        onChangeText={text => handleInputChange('tenantInterest', text)}
        multiline={true}
        numberOfLines={5}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
        <Text style={commonStyles.buttonText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.primary, // Updated to use Colors.primary
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontFamily: fonts.regular,
    color: Colors.blue,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: Colors.primary, // Updated to use Colors.primary
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: fonts.regular,
    color: Colors.blue,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  incrementerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  incrementButton: {
    borderWidth: 1,
    borderColor: Colors.primary, // Updated to use Colors.primary
    padding: 10,
    borderRadius: 5,
  },
  incrementButtonText: {
    fontSize: 18,
    color: Colors.primary, // Updated to use Colors.primary
  },
  occupantCount: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: fonts.bold,
  },
  leaseButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leaseButton: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderWidth: 1.5,
    borderColor: Colors.gray,
    borderRadius: 15,
    alignItems: 'center',
  },
  leaseButtonActive: {
    borderColor: Colors.primary,
  },
  leaseButtonText: {
    fontFamily: fonts.bold,
    color: Colors.primary, // Updated to use Colors.primary
  },
  labelText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    marginBottom: 5,
    color: Colors.blue,
  },
};

export default RentalApplicationForm;
