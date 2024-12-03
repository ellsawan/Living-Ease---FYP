import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import fonts from '../../constants/Font';
import Colors from '../../constants/Colors';
import apiClient from '../../../../../apiClient'; // Assuming you have this for API calls
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ServiceProviderEditProfile() {
  // State for storing user profile details and selected services
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [userId, setUserId] = useState(null);

  // List of available services
  const servicesList = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Carpentry',
    'Painting',
    'Landscaping',
    'Pest Control',
    'Security Services',
    'Home Appliance Repair',
  ];

  // Handle service selection (adding/removing)
  const toggleService = (service) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((item) => item !== service) // Remove if already selected
        : [...prevSelected, service] // Add if not selected
    );
  };

  // Fetch existing profile details and selected services if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId); // Store userId in state
  
          // Fetch user data and services from your API
          const response = await apiClient.get(`maintenance/service-provider/${storedUserId}/services`);
          
          // Log the entire response for debugging purposes
          console.log('API Response:', response.data);
  
          // Correctly extract data: response.data.data.user and response.data.data.services
          const { firstName, lastName, contactNumber } = response?.data?.data?.user || {};
          const services = response?.data?.data?.services || [];  // Extract services correctly
  
          // Log each part to see if any part is missing
          console.log('User Data:', { firstName, lastName, contactNumber });
          console.log('Services:', services);
  
          // Update state only if data is valid
          if (firstName && lastName && contactNumber !== undefined) {
            setFirstName(firstName);
            setLastName(lastName);
            setContact(contactNumber);
            setSelectedServices(services); // Set the extracted services
          } else {
            console.error('User data is incomplete:', { firstName, lastName, contactNumber });
          }
        } else {
          console.error('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
  
    fetchUserProfile();
  }, []);
  
  
  
  // Handle profile update submission
  const handleSubmit = async () => {
    const profileData = {
      firstName,
      lastName,
      contact,
      services: selectedServices,
      userId,
    };

    try {
      // Replace with your backend API URL
      const response = await apiClient.put('maintenance/service-provider/update-services', profileData);
      console.log('Profile updated successfully:', response.data);
      
      // Display alert on successful profile update
      Alert.alert('Success', 'Profile and services updated successfully', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'There was an error updating your profile. Please try again later.', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Select Services Provided</Text>
      <FlatList
        data={servicesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.serviceButton, selectedServices.includes(item) && styles.selectedService]}
            onPress={() => toggleService(item)}
          >
            <Text style={[styles.serviceText, selectedServices.includes(item) && styles.selectedText]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 30,
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  serviceButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: Colors.gray,
  },
  selectedService: {
    borderColor: Colors.primary,
  },
  serviceText: {
    fontFamily: fonts.bold,
    color: Colors.dark,
  },
  selectedText: {
    color: Colors.dark,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fonts.bold,
    color: '#fff',
    fontSize: 16,
  },
});
