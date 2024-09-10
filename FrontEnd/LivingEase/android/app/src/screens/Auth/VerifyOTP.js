import React, { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import apiClient from '../../../../../apiClient'; // Ensure this is correctly configured
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import commonStyles from '../../constants/styles'; // Import commonStyles for consistent styling

const OtpScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { email } = route.params; // Email passed from ForgotPasswordScreen

  const inputRefs = useRef([]);

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Alert.alert('Error', 'Please enter a complete OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp: otpCode });

      if (response.status === 200) {
        const { token } = response.data;
        navigation.navigate('ResetPassword', { token }); // Navigate to ResetPassword with token
      } else {
        const data = await response.json();
        // Display specific error messages
        if (data.message) {
          Alert.alert('Error', data.message);
        } else {
          Alert.alert('Error', 'Verification failed. Please try again.');
        }
      }
    } catch (error) {
      // Handle network or unexpected errors
      Alert.alert('Error', 'Enter Valid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the code sent to your email address. OTP will expire in 10 mins.
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              maxLength={1}
              keyboardType="number-pad"
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
            />
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={commonStyles.button}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        <Text style={commonStyles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'flex-start',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: Colors.gray, // Container background color
    borderRadius: 10, // Optional: rounded corners for the container
    padding: 5, // Optional: padding inside the container
    margin: 5, // Spacing between containers
  },
  input: { 
    fontSize: 24,
    width: 40,
    height: 50,
    textAlign: 'center',
    color: Colors.darkText, // Optional: Text color
  },
});

export default OtpScreen;
