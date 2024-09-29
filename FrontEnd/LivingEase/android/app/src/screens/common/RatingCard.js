import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const RatingCard = ({ rating, review }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <MaterialIcons
            key={value}
            name={rating >= value ? "star" : "star-border"}
            size={20}
            color={Colors.primary}
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{review}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    borderColor:Colors.primary,
    borderWidth:1,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.blue,
  },
});

export default RatingCard;
