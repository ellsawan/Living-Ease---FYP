import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from './Colors';

const CustomHeaderBackButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MaterialIcons name="arrow-back" size={30} color={Colors.blue} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  
    marginTop: 8, // add this to center the icon
    marginLeft: 8,
   
  },
});

export default CustomHeaderBackButton;
