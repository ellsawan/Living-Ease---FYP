import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet, TextInput } from 'react-native';
import apiClient from '../../../../../apiClient'; // Adjust the import as needed
import MaintenanceRequestCard from './MaintenanceRequestCard';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const MaintenanceRequestList = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]); // State to store requests
  const [filteredRequests, setFilteredRequests] = useState([]); // State to store filtered requests
  const [loading, setLoading] = useState(true); // Loading state
  const [searchText, setSearchText] = useState(''); // State for the search bar text

  // Fetch maintenance requests on component mount
  useEffect(() => {
    apiClient
      .get('/maintenance/requests') // Adjust the endpoint according to your API
      .then(response => {
        setMaintenanceRequests(response.data); // Set the data in state
        setFilteredRequests(response.data); // Initially display all requests
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error("Error fetching maintenance requests:", error);
        setLoading(false); // Stop loading even in case of error
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle the search input change
  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredRequests(maintenanceRequests); // If search text is empty, show all requests
    } else {
      const filtered = maintenanceRequests.filter(request => 
        request.title.toLowerCase().includes(text.toLowerCase()) || 
        request.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRequests(filtered); // Set the filtered requests
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title or description"
        value={searchText}
        onChangeText={handleSearch}
      />

      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <View key={request._id} style={styles.cardContainer}>
              <MaintenanceRequestCard request={request} />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text>No maintenance requests found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  searchBar: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 2,
    margin: 20,
    borderRadius: 8,
    paddingLeft: 20,
    borderRadius:25,
    fontFamily:fonts.semiBold,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  cardContainer: {
    paddingHorizontal: 16, // Add padding to the sides of each card
    marginVertical: 8,     // Add margin between cards
  },
});

export default MaintenanceRequestList;
