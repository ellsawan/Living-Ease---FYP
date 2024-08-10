import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../constants/styles';
import Colors from '../constants/Colors';
import apiClient from '../../../../apiClient'; // Import the apiClient
const SignUpScreen = ({ route, navigation }) => {
  const role = route.params?.role || 'User'; // Set default role if undefined
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    console.log('Attempting to sign up with:', { email,name, password,role });
    // Add local validation or other logic here if needed

    try {
      const response = await apiClient.post('auth/register', {
        email,
        name,
        password,
        role,
      });
      console.log(response.data);
      Alert.alert('Success', 'Registration successful!');

      switch (role) {
        case 'Landlord':
          navigation.navigate('LandlordDashboard');
          break;
        case 'ServiceProvider':
          navigation.navigate('ServiceProviderDashboard');
          break;
        case 'Tenant':
          navigation.navigate('TenantDashboard');
          break;
        default:
          navigation.navigate('SignInScreen'); // Navigate to SignInScreen if role is not recognized
          break;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={commonStyles.container}>
      <Image source={require('../main/assets/images/sign-in.png')} />
      <Text style={commonStyles.title}>Create your Account</Text>

      <View style={commonStyles.inputContainer}>
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

  <Text style={commonStyles.inputTitle}>Name</Text>
  <View style={commonStyles.inputWrapper}>
    <Icon name="account" size={20} color={Colors.dark} style={commonStyles.icon} />
    <TextInput
      style={[commonStyles.inputField, { flex: 1 }]}
      placeholder="Name"
      placeholderTextColor={Colors.placeholdertext}
      onChangeText={setName}
      value={name}
      autoCapitalize="words"
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