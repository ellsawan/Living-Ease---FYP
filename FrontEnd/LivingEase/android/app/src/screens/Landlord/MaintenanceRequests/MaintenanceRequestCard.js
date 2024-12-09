import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../../../constants/Font';
import Colors from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
const MaintenanceRequestCard = ({ request, onReview }) => {
    const navigation = useNavigation(); // Hook to access navigation
  const { requestTitle, description, category, priority, status, createdAt,propertyName,location } = request;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  // Determine badge colors based on status
  const getStatusBadgeStyle = status => {
    switch (status) {
      case 'Pending':
        return {
          backgroundColor: '#FFEB3B', // Pastel Yellow
          borderColor: '#FFC107',
          color: '#000',
        };
      case 'Approved':
        return {
          backgroundColor: '#C8E6C9', // Pastel Green
          borderColor: '#4CAF50',
          color: '#000',
        };
      case 'In Progress':
        return {
          backgroundColor: '#BBDEFB', // Pastel Blue
          borderColor: '#2196F3',
          color: '#000',
        };
      case 'Complete':
        return {
          backgroundColor: '#E1BEE7', // Pastel Purple
          borderColor: '#9C27B0',
          color: '#000',
        };
      default:
        return {
          backgroundColor: '#F5F5F5', // Light Grey
          borderColor: '#BDBDBD',
          color: '#000',
        };
    }
  };

  // Determine badge colors based on priority
  const getPriorityBadgeStyle = priority => {
    switch (priority) {
      case 'Low':
        return {
          backgroundColor: '#C8E6C9', // Pastel Green
          borderColor: '#8BC34A',
          color: '#000',
        };
      case 'Medium':
        return {
          backgroundColor: '#FFEB3B', // Pastel Yellow
          borderColor: '#FFC107',
          color: '#000',
        };
      case 'High':
        return {
          backgroundColor: '#FFCDD2', // Pastel Red
          borderColor: '#F44336',
          color: '#000',
        };
      default:
        return {
          backgroundColor: '#F5F5F5', // Light Grey
          borderColor: '#BDBDBD',
          color: '#000',
        };
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{requestTitle}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.tenant}>
        Tenant: <Text style={styles.tenantName}>{request.tenantId.firstName} {request.tenantId.lastName}</Text>
      </Text>
      <View style={styles.detailsRow}>
        <Text style={styles.badge}>{category}</Text>
        <Text style={[styles.badge, getPriorityBadgeStyle(priority)]}>
          {priority}
        </Text>
        <Text style={[styles.badge, getStatusBadgeStyle(status)]}>
          {status}
        </Text>
      </View>
      <Text style={styles.date}>{formattedDate}</Text>

      {/* Review Button */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.reviewButton]} onPress={() => onReview(request)}>
          <Text style={styles.buttonText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative', // Allows absolute positioning for the date
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    marginBottom: 5,
    color: Colors.primary,
  },
  description: {
    fontFamily: fonts.semiBold,
    color: Colors.dark,
    marginBottom: 10,
  },
  tenant: {
    fontSize: 14,
    color: Colors.dark,
    fontFamily: fonts.semiBold,
    marginBottom: 10,
  },
  tenantName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.primary,  // Highlight the tenant's name with a distinct color
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  badge: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.dark,
    fontFamily: fonts.semiBold,
  },
  date: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    position: 'absolute',
    top: 10,
    right: 10, // Positions the date in the upper right corner
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  reviewButton: {
    backgroundColor: Colors.primary,
    borderColor: '#4CAF50',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
});

export default MaintenanceRequestCard;
