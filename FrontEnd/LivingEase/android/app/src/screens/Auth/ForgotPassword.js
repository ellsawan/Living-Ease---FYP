import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient';

// Get screen dimensions
const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email });
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email'
      );
      navigation.navigate('VerifyOTP', { email }); // Navigate back to Sign In screen
    } catch (error) {
      console.error("Full error details:", error); // Log entire error object
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address to reset your password.
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
      </View>

      <TouchableOpacity
        style={commonStyles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={commonStyles.buttonText}>
          {loading ? 'Loading...' : 'Request OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={commonStyles.subtitle}>
          Remembered your password?
          <Text
            onPress={() => navigation.navigate('SignInScreen')}
            style={[commonStyles.subtitle, { color: Colors.primary, fontFamily: fonts.semiBold }]}
          >
            {' '}Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: 30,
    alignItems: 'flex-start', // Align header items to the left
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.placeholdertext,
    marginTop: 5,
    textAlign: 'left',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;
