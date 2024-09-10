import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const SelectRoleScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = role => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('SignUpScreen', { role: selectedRole });
    }
  };

  const getCardStyle = role => {
    if (role === selectedRole) {
      return [styles.roleCard, styles.selectedCard];
    }
    return styles.roleCard;
  };

  const getRoleDescription = role => {
    switch (role) {
      case 'Landlord':
        return " Keep your properties and tenants in check";
      case 'Tenant':
        return "Rent, manage, and live with comfort.";
      case 'Service Provider':
        return "Connect with those who need your expertise.";
      default:
        return '';
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>What's Your Role?</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={getCardStyle('Landlord')}
          onPress={() => handleRoleSelect('Landlord')}>
          <MaterialCommunityIcons
            name="home-account"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>I am a Landlord</Text>
          <Text style={styles.roleDescription}>
            {getRoleDescription('Landlord')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getCardStyle('Tenant')}
          onPress={() => handleRoleSelect('Tenant')}>
          <MaterialCommunityIcons
            name="account"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>I am a Tenant</Text>
          <Text style={styles.roleDescription}>
            {getRoleDescription('Tenant')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getCardStyle('Service Provider')}
          onPress={() => handleRoleSelect('Service Provider')}>
          <MaterialCommunityIcons
            name="tools"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>I am a Service Provider</Text>
          <Text style={styles.roleDescription}>
            {getRoleDescription('Service Provider')}
          </Text>
        </TouchableOpacity>
      </View>
      {selectedRole && (
        <TouchableOpacity style={commonStyles.button} onPress={handleContinue}>
          <Text style={commonStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  roleCard: {
    backgroundColor: Colors.background,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  roleCardText: {
    fontSize: 18,
    color: Colors.dark,
    fontFamily: fonts.semiBold,
    marginTop: 10,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.placeholdertext,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default SelectRoleScreen;
