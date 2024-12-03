import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

const PendingPaymentCard = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.tenantName}</Text>
      <Text style={styles.cardSubtitle}>Property: {item.propertyName}</Text>
      <Text style={styles.cardSubtitle}>Month: {item.month}</Text>
      <Text style={styles.cardAmount}>Due Amount: PKR {item.dueAmount.toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderColor: Colors.gray,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.primary,
  },
  cardSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.dark,
  },
  cardAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FF0000',
    marginTop: 5,
  },
});

export default PendingPaymentCard;
