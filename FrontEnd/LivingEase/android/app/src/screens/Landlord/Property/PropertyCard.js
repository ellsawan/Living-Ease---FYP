import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';

const PropertyCard = ({ property, onPress, isSelected }) => {
  return (
    <View
      style={[styles.card, isSelected && styles.selectedCard]}
      onTouchEnd={() => onPress(property)} // Trigger onPress when touched
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
    </View>
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
  },
  selectedCard: {
    borderColor: Colors.white,
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
});

export default PropertyCard;
