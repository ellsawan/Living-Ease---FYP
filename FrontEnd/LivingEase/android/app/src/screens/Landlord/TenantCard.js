import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TenantCard = ({ firstName, lastName, profileImage, onViewProfile }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onViewProfile}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.tenantName}>
            {firstName} {lastName}
          </Text>
        </View>
        <TouchableOpacity onPress={onViewProfile} style={styles.viewProfileButton}>
  <Text style={styles.viewProfileText}>View Profile</Text>
  <Icon name="arrow-forward" size={18} color={Colors.primary} />
</TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 15,  // Adjust vertical padding
    paddingHorizontal: 20, // Add horizontal padding
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
  },
  viewProfileText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
});

export default TenantCard;
