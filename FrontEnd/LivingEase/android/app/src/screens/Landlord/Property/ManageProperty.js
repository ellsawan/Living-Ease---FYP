import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProperty from './AddProperty';


const Stack = createStackNavigator();

const ManageProperty = () => {
  const navigation = useNavigation();

  const handleAddProperty = () => {
    navigation.navigate('AddProperty');
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      {/* List of properties */}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
});
export default ManageProperty;
