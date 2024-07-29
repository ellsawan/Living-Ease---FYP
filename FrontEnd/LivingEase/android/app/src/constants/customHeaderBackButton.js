import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from './Colors';

const CustomHeaderBackButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MaterialIcons name="arrow-back-ios-new" size={15} color={Colors.blue} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8, // add this to center the icon
    marginLeft: 8,
    backgroundColor: Colors.lightgrey, // add this to set the background color
    borderRadius: 30, // add this to set the border radius
    width: 50, // add this to set the width of the circle
    height: 50, // add this to set the height of the circle
  },
});

export default CustomHeaderBackButton;
