import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PicturePlaceHolder = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="person" size={30} color="#000" />
      <Text>Profile Icon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PicturePlaceHolder;
