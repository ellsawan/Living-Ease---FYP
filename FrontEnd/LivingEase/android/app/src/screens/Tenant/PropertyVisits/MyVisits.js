import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native'; 
import { useFocusEffect } from '@react-navigation/native'; 
import Colors from '../../../constants/Colors'; 
import apiClient from '../../../../../../apiClient'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import VisitCard from './VisitCard'; 
import fonts from '../../../constants/Font';

const MyVisits = () => {
  const [tenantId, setTenantId] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setTenantId(id);
        }
      } catch (error) {
        console.error('Failed to fetch tenant ID from storage:', error);
      }
    };

    fetchTenantId();
  }, []);

  const fetchVisits = async () => {
    if (tenantId) {
      try {
        const response = await apiClient.get(`/appointment/appointments/${tenantId}`);
       console.log(response.data)
        setVisits(response.data);
        
      } catch (error) {
        console.error('Failed to fetch visits:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (tenantId) {
        fetchVisits();
      }
    }, [tenantId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const filteredVisits = visits.filter(visit => visit.status === activeTab.toLowerCase());

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Pending', 'Accepted', 'Rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.tabContent}>
    
    <FlatList
    scrollEnabled={false}
    data={filteredVisits}
    renderItem={({ item }) => {
      if (!item) return null; // Check if item is defined
  
      return (
        <VisitCard appointment={item} />
      );
  
  }}
  keyExtractor={item => item._id}
  contentContainerStyle={styles.list}
/>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: fonts.bold,
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  list: {
    paddingBottom: 20,
  },
});

export default MyVisits;
