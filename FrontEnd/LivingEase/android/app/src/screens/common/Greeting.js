// Greeting.js
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import apiClient from '../../../../../apiClient'; // Import the apiClient
import fonts from '../../constants/Font';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Greeting = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Retrieved Token:', token);

        if (token) {
          const response = await apiClient.get('/user/name', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Response Status:', response.status);
          console.log('Response Data:', response.data);

          if (response.status === 200) {
            // Capitalize the first letter of both first and last names
            setFirstName(capitalizeFirstLetter(response.data.firstName));
            setLastName(capitalizeFirstLetter(response.data.lastName));
          } else {
            setError('Failed to fetch user name');
          }
        } else {
          setError('No token found');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchName();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Hello,</Text>
      <Text style={styles.nameText}>
        {firstName} {lastName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -60, // Add a margin top to position the Greeting component
    marginLeft: 20,
    marginBottom: 20, // Add a margin left to position the Greeting component
    // Add any additional styling if needed
  },
  greetingText: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
  nameText: {
    marginTop: -12,
    fontSize: 26,
    fontFamily: fonts.bold, // Use a bold font for the user's name
    color: Colors.primary, // Use an accent color to highlight the user's name
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Greeting;
