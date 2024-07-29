import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../constants/styles';
import Colors from '../constants/Colors';
import Fonts from '../constants/Font';

const SelectRoleScreen = ({navigation}) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = role => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('SignUpScreen', {role: selectedRole});
    }
  };

  const getCardStyle = role => {
    if (role === selectedRole) {
      return [styles.roleCard, styles.selectedCard];
    }
    return styles.roleCard;
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Choose Your Role</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={getCardStyle('Landlord')}
          onPress={() => handleRoleSelect('Landlord')}>
          <MaterialCommunityIcons
            name="home-account"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>Landlord</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getCardStyle('Tenant')}
          onPress={() => handleRoleSelect('Tenant')}>
          <MaterialCommunityIcons
            name="account"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>Tenant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getCardStyle('Service Provider')}
          onPress={() => handleRoleSelect('Service Provider')}>
          <MaterialCommunityIcons
            name="tools"
            size={40}
            color={Colors.primary}
          />
          <Text style={styles.roleCardText}>Service Provider</Text>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  roleCardText: {
    fontSize: 18,
    color: Colors.dark,
    fontFamily: Fonts.semiBold,
    marginTop: 10, // Add some space between the icon and the text
  },
});

export default SelectRoleScreen;
