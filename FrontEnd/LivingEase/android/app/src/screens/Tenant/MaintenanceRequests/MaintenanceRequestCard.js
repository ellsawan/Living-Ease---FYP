import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import fonts from '../../../constants/Font';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const MaintenanceRequestCard = ({request}) => {
  const {requestTitle, description, category, priority, status, createdAt} =
    request;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  // Determine badge colors based on status
  const getStatusBadgeStyle = status => {
    switch (status) {
      case 'Pending':
        return {
          backgroundColor: '#FFC107',
          borderColor: '#FFB300',
          color: '#000',
        };
      case 'Approved':
        return {
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          color: '#fff',
        };
      case 'In Progress':
        return {
          backgroundColor: '#2196F3',
          borderColor: '#1976D2',
          color: '#fff',
        };
      case 'Complete':
        return {
          backgroundColor: '#9C27B0',
          borderColor: '#7B1FA2',
          color: '#fff',
        };
      default:
        return {
          backgroundColor: '#E0E0E0',
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
          backgroundColor: '#8BC34A',
          borderColor: '#689F38',
          color: '#fff',
        };
      case 'Medium':
        return {
          backgroundColor: '#FFC107',
          borderColor: '#FFA000',
          color: '#000',
        };
      case 'High':
        return {
          backgroundColor: '#F44336',
          borderColor: '#D32F2F',
          color: '#fff',
        };
      default:
        return {
          backgroundColor: '#E0E0E0',
          borderColor: '#BDBDBD',
          color: '#000',
        };
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{requestTitle}</Text>
      <Text style={styles.description}>{description}</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
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
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
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
});

export default MaintenanceRequestCard;
