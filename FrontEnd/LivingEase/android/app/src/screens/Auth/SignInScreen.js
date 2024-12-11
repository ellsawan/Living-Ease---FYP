import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleSignInPress = async () => {
    if (!email || !password) {
      Alert.alert(
        'Field is empty',
        'Please enter your email address and password',
      );
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {email, password});
      const {success, message, token, role, _id: userId} = response.data;

      if (!success) {
        // Display the message received from the server
        Alert.alert('Error', message);
        setLoading(false);
        return;
      }

      // Continue with successful login process
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

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
          console.error('Unknown role');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={commonStyles.container}>
      <View style={{marginBottom: 30, alignItems: 'flex-start', width: '100%'}}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: fonts.bold,
            color: Colors.darkText,
            textAlign: 'left',
          }}>
          Welcome Back!
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.regular,
            color: Colors.placeholdertext,
            marginTop: -5,
            textAlign: 'left',
          }}>
          Let's get you signed in.
        </Text>
      </View>

      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>Email</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon
            name="email"
            size={20}
            color={Colors.darkText}
            style={commonStyles.icon}
          />
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
          <Icon
            name="lock"
            size={20}
            color={Colors.darkText}
            style={commonStyles.icon}
          />
          <TextInput
            style={commonStyles.inputField}
            placeholder="Password"
            placeholderTextColor={Colors.darkText}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 20, top: 18}}
            onPress={togglePasswordVisibility}>
            <Icon
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.placeholdertext}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: 10}}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 5,
              fontFamily: fonts.semiBold,
              color: Colors.primary,
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSignInPress}>
        {loading ? (
          <Text style={commonStyles.buttonText}>Loading...</Text>
        ) : (
          <Text style={commonStyles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View>
        <Text
          style={[
            {color: Colors.blue, fontFamily: fonts.regular, fontSize: 16},
          ]}>
          Don't have an account?
          <Text
            onPress={() => navigation.navigate('SelectRoleScreen')}
            style={[
              commonStyles.subtitle,
              {color: Colors.primary, fontFamily: fonts.semiBold},
            ]}>
            {' '}
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignInScreen;
