// ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import apiClient from '../../../../../apiClient'; // Ensure this is correctly configured
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import commonStyles from '../../constants/styles';

const ResetPasswordScreen = ({ route, navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = route.params; // Token passed from OtpScreen

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Your password has been updated');
        navigation.navigate('SignInScreen'); // Navigate to Sign In screen or wherever appropriate
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter New Password</Text>
        <Text style={styles.subtitle}>Enter your new password below.</Text>
      </View>
      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>New Password</Text>
        <View style={commonStyles.inputWrapper}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor={Colors.darkText}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={commonStyles.inputField}
          />
        </View>

        <Text style={commonStyles.inputTitle}>Confirm New Password</Text>
        <View style={commonStyles.inputWrapper}>
          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={commonStyles.inputField}
          />
        </View>

        <TouchableOpacity
          style={commonStyles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={commonStyles.buttonText}>
            {loading ? 'Updating...' : 'Update Password'}
          </Text>
        </TouchableOpacity>
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
    marginTop: -3,
    textAlign: 'left',
  },
});

export default ResetPasswordScreen;
