import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Ionicons icon library

const MaintenanceRequestCard = ({ request }) => {
  const { tenantId, propertyId, requestTitle, description, priority, category, status, createdAt,paymentStatus } = request;
  const navigation = useNavigation(); // Get the navigation object

  const handleCardPress = () => {
    // Navigate to the details screen and pass the request data as params
    navigation.navigate('MaintenanceRequestDetails', { request });
  };

  // Function to determine the color of the priority circle based on color codes
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return '#28a745'; // Green color for Low priority
      case 'Medium':
        return '#ffc107'; // Yellow color for Medium priority
      case 'High':
        return '#dc3545'; // Red color for High priority
      default:
        return '#6c757d'; // Grey color for unknown priority
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <Text style={styles.title}>{requestTitle}</Text>
      
      <View style={styles.detailsContainer}>
        {/* Priority Circle */}
        <View style={[styles.priorityCircle, { backgroundColor: getPriorityColor(priority) }]}>
          <Text style={styles.priorityText}>{priority[0]}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          {description.length > 50 ? description.substring(0, 50) + '...' : description}
        </Text>
      </View>
      
      <View style={styles.locationContainer}>
        <Icon name="location-sharp" size={20} color={Colors.primary} />
        <Text style={styles.detailText}>{propertyId.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: 'relative', // To position the priority dot
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: fonts.semiBold,
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: Colors.dark,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  // Style for priority circle dot
  priorityCircle: {
    position: 'absolute',
    top: -35,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 30, // Makes it a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});

export default MaintenanceRequestCard;
