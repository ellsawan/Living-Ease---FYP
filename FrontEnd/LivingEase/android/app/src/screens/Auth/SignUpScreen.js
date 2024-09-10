import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import apiClient from '../../../../../apiClient';
import commonStyles from '../../constants/styles';
import fonts from '../../constants/Font';

const SignUpScreen = ({ route, navigation }) => {
  const role = route.params?.role || 'User'; // Set default role if undefined
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Trim input values to remove leading/trailing spaces
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    // Check if any field is empty or contains only spaces
    if (!trimmedFirstName || !trimmedLastName || !email || !password) {
      Alert.alert('Missing Fields', 'All fields are required and cannot be just spaces.');
      return;
    }

    // Validate email and password
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    console.log('Attempting to sign up with:', { email, firstName: trimmedFirstName, lastName: trimmedLastName, password, role });

    try {
      const response = await apiClient.post('auth/register', {
        email,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        password,
        role,
      });

      console.log(response.data);
      Alert.alert('Success', 'Registration successful!');

      // Navigate to the SignInScreen after successful registration
      navigation.navigate('SignInScreen');
    } catch (error) {
      if (error.response?.status === 400) {
        Alert.alert('User Already Exists', 'An account with this email already exists. Please use a different email or sign in.');
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
      console.error(error);
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ marginBottom: 30, alignItems: 'flex-start', width: '100%' }}>
        <Text style={{ fontSize: 32, fontFamily: fonts.bold, color: Colors.darkText, textAlign: 'left' }}>
          Get Started.
        </Text>
        <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: Colors.placeholdertext, marginTop: -5, textAlign: 'left' }}>
          Fill in your details to register.
        </Text>
      </View>

      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>First Name</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="account" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="First Name"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setFirstName}
            value={firstName}
            autoCapitalize="words"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Last Name</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="account" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Last Name"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setLastName}
            value={lastName}
            autoCapitalize="words"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Email</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="email" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Email"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Password</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="lock" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSignUp}>
        <Text style={commonStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
