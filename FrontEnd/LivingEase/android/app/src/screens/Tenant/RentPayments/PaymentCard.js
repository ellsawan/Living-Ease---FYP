import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';

const PaymentCard = ({ title, dateLabel, date, amount }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={styles.label}>{dateLabel}:</Text>
       
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>{`${amount} PKR`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  cardBody: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: Colors.darkText,
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.black,
  },
});

export default PaymentCard;
