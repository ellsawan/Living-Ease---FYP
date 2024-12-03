import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import apiClient from '../../../../../../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import MaintenanceRequestCard from './MaintenanceRequestCard';

export default function ManageRequests() {
  const [requestTitle, setRequestTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Plumbing');
  const [modalVisible, setModalVisible] = useState(false);
  const [tenantId, setTenantId] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          setTenantId(userId);
        }
      } catch (error) {
        console.error('Failed to load userId:', error);
      }
    };

    fetchTenantId();
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchRequests();
    }
  }, [tenantId]);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get(`/maintenance/tenant/${tenantId}/requests`);
      if (response.status === 200) {
        const requestsData = response.data.data;
        setRequests(requestsData);
      } else {
        console.error('Failed to fetch requests:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleRequestSubmission = async () => {
    if (!requestTitle || !description || !tenantId) {
      Alert.alert('Error', 'Please fill in all required fields and make sure you are logged in.');
      return;
    }

    const requestData = {
      tenantId,
      requestTitle,
      description,
      priority,
      category,
    };

    try {
      const response = await apiClient.post('/maintenance/submit-maintenance-request', requestData);
      if (response.status === 201) {
        Alert.alert('Success', response.data.message);
        setModalVisible(false);
        fetchRequests();
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      Alert.alert('Error', 'Failed to submit the request. Please try again later.');
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestTitle}>{item.requestTitle}</Text>
      <Text style={styles.requestDescription}>{item.description}</Text>
      <Text style={styles.requestCategory}>Category: {item.category}</Text>
      <Text style={styles.requestPriority}>Priority: {item.priority}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newRequestButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.newRequestButtonText}>New Maintenance Request</Text>
      </TouchableOpacity>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <MaintenanceRequestCard request={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No maintenance requests available.</Text>}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.formContainer}>
              <Text style={styles.label}>Request Title</Text>
              <TextInput style={styles.input} value={requestTitle} onChangeText={setRequestTitle} placeholder="Enter request title" />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the issue"
                multiline
                numberOfLines={4}
              />
              <Text style={styles.label}>Category</Text>
              <View style={styles.inlineOptions}>
                {['Plumbing', 'Electrical', 'Cleaning'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.option, category === item && styles.optionSelected]}
                    onPress={() => setCategory(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.inlineOptions}>
                {['Low', 'Medium', 'High'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.option, priority === item && styles.optionSelected]}
                    onPress={() => setPriority(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleRequestSubmission}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
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
    fontFamily: fonts.bold,
    fontSize: 16,
    color: Colors.dark,
  },
  activeTabText: {
    color: Colors.dark,
  },
  tabContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  newRequestButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation:10,
  },
  newRequestButtonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '90%',
    padding: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  label: {
    fontFamily: fonts.bold,
    marginBottom: 10,
    color: Colors.dark,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: Colors.dark,
    fontFamily: fonts.regular,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inlineOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  option: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.gray,
    borderRadius: 20,
  },
  optionSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  optionText: {
    color: Colors.dark,
    fontFamily: fonts.semiBold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    margin:10,
  },
  submitButtonText: {

    color: Colors.white,
    fontFamily: fonts.bold,

  },
  cancelButton: {
    margin:10,
    backgroundColor: Colors.dark,
  },
  listContainer: {
    padding: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
