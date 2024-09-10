import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import apiClient from '../../../../../apiClient'; // Ensure the correct path

const CompareProperties = ({ route }) => {
  const { propertyIds } = route.params;
  const [properties, setProperties] = useState([]);

  const fetchProperties = async () => {
    try {
      const responses = await Promise.all(propertyIds.map(id => apiClient.get(`/property/${id}`)));
      setProperties(responses.map(response => response.data.property));
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (properties.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please select exactly two properties to compare.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Property Comparison</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {properties.map((property, index) => (
              <View key={index} style={styles.tableCell}>
                <Image
                  source={{ uri: property.images.length > 0 ? property.images[0].uri : '' }}
                  style={styles.image}
                />
                <Text style={styles.propertyName}>{property.propertyName}</Text>
                <Text style={styles.propertyLocation}>{property.location}</Text>
                <Text style={styles.propertyPrice}>{property.rentPrice} Rent</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderText}>Description</Text>
            {properties.map((property, index) => (
              <Text key={index} style={styles.tableCellText}>{property.description}</Text>
            ))}
          </View>
          {/* Add more rows for other property details as needed */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.lightgrey,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    padding: 10,
    backgroundColor: Colors.lightgrey,
    textAlign: 'center',
    flex: 1,
  },
  tableCellText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.darkText,
    padding: 10,
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  propertyName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.darkText,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    textAlign: 'center',
  },
});

export default CompareProperties;
