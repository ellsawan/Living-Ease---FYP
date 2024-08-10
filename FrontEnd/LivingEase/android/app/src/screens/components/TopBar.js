import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import commonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Profile icon pressed')}>
        <MaterialIcons name="person" size={24} color={Colors.dark} />
      </TouchableOpacity>
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('AI chat icon pressed')}>
          <MaterialIcons name="wechat" size={24}
           color={Colors.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => console.log('Notification icon pressed')}>
          <MaterialIcons name="notifications-none" size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginRight: 5, // add some margin between the icons
    borderWidth: 2, // add a border width of 2
    borderColor: Colors.primary, // set the border color to primary
  },
  rightIconsContainer: {
    flexDirection: 'row',
  },
});

export default TopBar;