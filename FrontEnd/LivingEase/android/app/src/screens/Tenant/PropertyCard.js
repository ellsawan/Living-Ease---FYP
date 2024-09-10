import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';

const PropertyCard = ({ property, onPress, onSelect, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={() => onPress(property._id)}
      onLongPress={() => onSelect(property._id)} // Use long press for selection
    >
      <Image
        source={{ uri: property.images.length > 0 ? property.images[0].uri : '' }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.propertyName} numberOfLines={1}>{property.propertyName}</Text>
        <View style={styles.row}>
          <Icon name="location" size={18} color={Colors.primary} style={styles.icon} />
          <Text style={styles.propertyLocation} numberOfLines={1}>{property.location}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="cash" size={18} color={Colors.primary} style={styles.icon} />
          <Text style={styles.propertyPrice} numberOfLines={1}>{property.rentPrice} Rent</Text>
        </View>
      </View>
      {isSelected && <Icon name="checkmark-circle" size={24} color={Colors.primary} style={styles.checkIcon} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    position: 'relative',
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  propertyName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    flexShrink: 1,
  },
  propertyLocation: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: Colors.darkText,
    flexShrink: 1,
  },
  propertyPrice: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
    flexShrink: 1,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default PropertyCard;
