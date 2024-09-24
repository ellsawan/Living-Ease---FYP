import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import apiClient from '../../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VisitCard from './VisitCard';
import fonts from '../../../constants/Font';

const ManageVisits = () => {
  const navigation = useNavigation();
  const [landlordId, setLandlordId] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    const fetchLandlordId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setLandlordId(id);
        }
      } catch (error) {
        console.error('Failed to fetch landlord ID from storage:', error);
      }
    };

    fetchLandlordId();
  }, []);

  const fetchVisits = async () => {
    if (landlordId) {
      try {
        const response = await apiClient.get(`/appointment/appointments/landlord/${landlordId}`);
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
      fetchVisits();
    }, [landlordId])
  );

  const updateVisitStatus = async (visitId, status) => {
    try {
      await apiClient.patch(`/appointment/${visitId}/status`, { status });
      Alert.alert('Success', `Visit has been ${status === 'accepted' ? 'accepted' : 'rejected'}.`);
      fetchVisits();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      Alert.alert('Error', 'Failed to update visit status. Please try again.');
    }
  };

  const onAccept = (visitId) => {
    updateVisitStatus(visitId, 'accepted');
  };

  const onReject = (visitId) => {
    updateVisitStatus(visitId, 'rejected');
  };

  const filteredVisits = visits.filter(
    visit => visit.status === activeTab.toLowerCase(),
  );

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

      <ScrollView style={styles.tabContent} nestedScrollEnabled={true}>
        <FlatList
          scrollEnabled={false}
          data={filteredVisits}
          renderItem={({ item }) => (
            <VisitCard
              visit={item}
              onAccept={onAccept}
              onReject={onReject}
              tenantFirstName={item.tenantId?.firstName || 'Unknown'}
              tenantLastName={item.tenantId?.lastName || ''}
              tenantProfileImage={item.tenantId?.profileImage?.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              onViewProfile={(tenantId) => navigation.navigate('TenantProfile', { tenantId })}
            />
          )}
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

export default ManageVisits;
