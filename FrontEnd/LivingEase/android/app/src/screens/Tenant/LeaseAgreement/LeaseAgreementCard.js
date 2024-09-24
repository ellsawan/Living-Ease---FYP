import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import { useNavigation } from '@react-navigation/native';

const LeaseAgreementCard = ({ leaseData }) => {
  const navigation = useNavigation(); // Get the navigation prop
  const placeholderImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
const landlordImg=leaseData.landlordId.profileImage
  const handlePress = () => {
    console.log(leaseData.landlordId)
    navigation.navigate('LeaseDetails', { leaseId: leaseData._id });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} onPress={handlePress}>
      <Image
          source={{ uri: landlordImg || placeholderImage }}
          style={styles.profileImage}
          onError={() => console.log('Image failed to load, using placeholder.')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.tenantName}>
            {leaseData.landlordId.firstName}  {leaseData.landlordId.lastName} 
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>View Lease {'>'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.bold,
  },
  leaseTitle: {
    fontSize: 14,
    color: Colors.darkText,
    fontFamily: fonts.regular,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.primary,
    fontFamily: fonts.bold,
  },
});

export default LeaseAgreementCard;
