import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../constants/styles';
import Colors from '../constants/Colors';

const SignUpScreen = ({ route, navigation }) => {
  const role = route.params?.role || 'User'; // Set default role if undefined
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log('Signing up with:', { name, contact, email, password, role });

    // Navigate to the appropriate dashboard based on the role
    if (role === 'Landlord') {
      navigation.navigate('LandlordDashboard');
    } else if (role === 'Tenant') {
      navigation.navigate('TenantDashboard');
    } else if (role === 'Service Provider') {
      navigation.navigate('ServiceProviderDashboard');
    }
  };

  return (
    <View style={commonStyles.container}>
      <Image
        source={require('../main/assets/images/sign-in.png')}
      />
      <Text style={commonStyles.title} >Create your Account</Text>

      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>Name</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="account" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]} // Add flex: 1 to take up remaining space
            placeholder="Name"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setName}
            value={name}
            autoCapitalize="words"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Contact</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="phone" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]} // Add flex: 1 to take up remaining space
            placeholder="Contact"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setContact}
            value={contact}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Email</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon name="email" size={20} color={Colors.dark} style={commonStyles.icon} />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]} // Add flex: 1 to take up remaining space
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
            style={[commonStyles.inputField, { flex: 1 }]} // Add flex: 1 to take up remaining space
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
