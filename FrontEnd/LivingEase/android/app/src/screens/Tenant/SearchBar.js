import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SearchBar = () => {
  const navigation = useNavigation(); // Get the navigation object

  const handleSearchPress = () => {
    navigation.navigate('SearchFilter'); // Navigate to the SearchFilter screen
  };

  return (
    <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
      <TextInput
        style={styles.searchInput}
        placeholder="Find your dream home"
        placeholderTextColor={Colors.placeholdertext}
        editable={false} // Make input non-editable since it's a search bar
      />
      <MaterialCommunityIcons name="magnify" size={30} color={Colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightgrey,
    borderRadius: 50,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 8,
    margin: 5,
    marginBottom:20,
    marginTop: -5,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    height: 50,
    fontSize: 16,
    color: Colors.darkText,
    marginRight: 10, // Space between input and icon
  },
});

export default SearchBar;
