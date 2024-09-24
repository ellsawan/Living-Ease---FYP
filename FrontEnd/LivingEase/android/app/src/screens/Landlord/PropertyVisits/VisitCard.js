import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';

const VisitCard = ({ visit, onAccept, onReject, onViewProfile }) => {
  // Handle case where visit is null or does not have a propertyId
  if (!visit || !visit.propertyId) {
    return null; // Do not render the card
  }

  const appointmentDate = new Date(visit.appointmentDate);
  const isValidDate = !isNaN(appointmentDate.getTime());

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = isValidDate ? appointmentDate.toLocaleDateString(undefined, options) : 'Date not available';
  const formattedTime = visit.appointmentTime || 'Time not available';
  const propertyName = visit.propertyId.propertyName || 'Property name not available';

  const tenant = visit.tenantId || {};
  const tenantFirstName = tenant.firstName || 'Unknown';
  const tenantLastName = tenant.lastName || '';

  const placeholderImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  return (
    <View style={styles.card}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: tenant?.profileImage?.url || placeholderImage }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{tenantFirstName} {tenantLastName}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <Icon name="home" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.property}>{propertyName}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Icon name="date-range" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Icon name="access-time" size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={() => visit._id && onAccept(visit._id)} // Check visit._id
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.rejectButton} 
          onPress={() => visit._id && onReject(visit._id)} // Check visit._id
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.viewProfileButton} 
        onPress={() => tenant._id && onViewProfile(tenant._id)} // Check tenant._id
      >
        <Text style={styles.viewProfileText}>View Tenant Profile</Text>
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
    borderRadius: 50,
    marginRight: 10,
  },
  name: {
    marginTop: 8,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  property: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: Colors.blue,
  },
  date: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: Colors.blue,
  },
  time: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: Colors.blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 30,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  viewProfileButton: {
    marginTop: 20,
    backgroundColor: Colors.lightgrey,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  viewProfileText: {
    fontFamily: fonts.bold,
    color: Colors.darkText,
    fontSize: 16,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
  },
});

export default VisitCard;
