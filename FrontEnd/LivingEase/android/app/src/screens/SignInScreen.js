import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../constants/styles';
import Colors from '../constants/Colors';
import fonts from '../constants/Font';
import apiClient from '../../../../apiClient'; // Make sure to import your api client

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignInPress = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
  
    setLoading(true);
  
    try {
      // Perform sign-in logic here and get user role
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
  
      const { role } = response.data; // Assuming the response contains the user's role
  
      // Navigate to the appropriate dashboard based on the role
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
  
      }
    } catch (error) {
      
      console.error(error.response?.data || error.message);
       } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={commonStyles.container}>
      <Image source={require('../main/assets/images/sign-in.png')} />
      <Text style={commonStyles.title}>Sign In</Text>

      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>Email</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="email" size={20} color={Colors.darkText} style={commonStyles.icon} />
          <TextInput
            style={commonStyles.inputField}
            placeholder="Email"
            placeholderTextColor={Colors.darkText}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Password</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="lock" size={20} color={Colors.darkText} style={commonStyles.icon} />
          <TextInput
            style={commonStyles.inputField}
            placeholder="Password"
            placeholderTextColor={Colors.darkText}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>
      </View>

      {error ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
      ) : null}

      <TouchableOpacity style={commonStyles.button} onPress={handleSignInPress}>
        {loading ? (
          <Text style={commonStyles.buttonText}>Loading...</Text>
        ) : (
          <Text style={commonStyles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={commonStyles.signInTextContainer}>
        <Text style={commonStyles.subtitle}>
          Don't have an account?  
          <Text onPress={() => navigation.navigate('SelectRoleScreen')} style={[commonStyles.subtitle, { color: Colors.primary, fontFamily: fonts.semiBold }]}> Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignInScreen;
