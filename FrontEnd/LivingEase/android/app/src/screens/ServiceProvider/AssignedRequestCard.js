// MaintenanceRequestCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const MaintenanceRequestCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.requestTitle}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardAmount}>Bid Amount: ${item.bidAmount}</Text>
      <Text style={styles.cardPriority}>Priority: {item.priority}</Text>
      <Text style={styles.cardCategory}>Category: {item.category}</Text>
      <Text style={styles.cardTenant}>
        Tenant: {item.tenantId.firstName} {item.tenantId.lastName}
      </Text>
      <Text style={styles.cardLocation}>
        Property Location: {item.propertyId.location}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.primary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  cardPriority: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
  },
  cardCategory: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
  },
  cardTenant: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
  },
  cardLocation: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#555',
  },
});

export default MaintenanceRequestCard;
