import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rightIconsContainer}>
        <View style={styles.iconContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align icons to the right
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 50,
    height: 50,
    marginLeft: 10, // Keep the margin to maintain spacing
    borderColor: Colors.primary,
  },
  rightIconsContainer: {
    flexDirection: 'row',
  },
});

export default TopBar;
