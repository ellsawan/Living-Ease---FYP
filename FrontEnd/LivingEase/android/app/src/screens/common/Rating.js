import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Importing Material Icons
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const Rating = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (rating === 0 || review.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields (rating and review).');
      return; // Exit the function if validation fails
    }

    // Call the onSubmit prop function with rating data
    onSubmit({ rating, review });
    setReview(''); // Clear the review after submission
    setRating(0); // Reset rating after submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={styles.star}
            onPress={() => handleRating(value)}
          >
            {rating >= value ? (
              <MaterialIcons name="star" size={50} color={Colors.primary} />
            ) : (
              <MaterialIcons name="star-border" size={50} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        placeholder="Write your review here..."
        placeholderTextColor={Colors.placeholdertext}
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: fonts.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    padding: 10,
  },
  reviewInput: {
    height: 80,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlignVertical: 'top', // Align text at the top for multiline input
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});

export default Rating;
