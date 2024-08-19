import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('AI chat icon pressed')}>
          <MaterialCommunityIcons name="robot" size={24} color={Colors.blue} />
        </TouchableOpacity>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align icons to the right
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 50,
    height: 50,
    marginLeft: 10, // Adjust margin for spacing between icons
    backgroundColor: Colors.lightgrey,
    borderColor: Colors.primary,
  },
  rightIconsContainer: {
    flexDirection: 'row',
  },
});

export default TopBar;
