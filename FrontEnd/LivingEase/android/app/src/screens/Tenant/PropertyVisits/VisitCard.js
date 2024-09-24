import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisitCard = ({ appointment }) => {
  // Destructure the appointment object safely
  const { appointmentDate, appointmentTime, propertyId, ownerId } = appointment || {};
  const navigation = useNavigation();

  // Check if propertyId exists and access _id safely
  const propertyIdString = propertyId ? propertyId._id : null;
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const id = await AsyncStorage.getItem('tenantId'); // Change this key to match your storage key
        setTenantId(id);
      } catch (error) {
        console.error('Error fetching tenant ID from Async Storage:', error);
      }
    };

    fetchTenantId();
  }, []);

  const handleViewProperty = () => {
    // Check if propertyIdString and ownerId exist before navigating
    if (propertyIdString && ownerId) {
      navigation.navigate('PropertyDetails', { propertyId: propertyIdString, ownerId: ownerId._id, tenantId });
    } else {
      console.warn('Property ID or Owner ID is missing');
    }
  };

  // Early return if propertyId is not valid
  if (!propertyId) {
    return null; // Do not render the card if propertyId is null
  }

  return (
    <View style={styles.card}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: ownerId?.profileImage?.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{ownerId?.firstName} {ownerId?.lastName}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.infoContainer}>
          <Icon name="date-range" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.infoText}>
            {new Date(appointmentDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="access-time" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.infoText}>
            {appointmentTime}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewPropertyButton} onPress={handleViewProperty}>
        <Text style={styles.buttonText}>View Property</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: Colors.blue,
  },
  detailsContainer: {
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: Colors.blue,
  },
  icon: {
    marginRight: 8,
  },
  viewPropertyButton: {
    marginTop: 10,
    backgroundColor: Colors.lightgrey,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.blue,
    fontFamily: fonts.bold,
  },
});

export default VisitCard;
