import React, { useState, useRef } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView,Alert } from 'react-native'; 
import Colors from '../../../constants/Colors'; 
import fonts from '../../../constants/Font'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs'; // For saving the image to file system
 // Importing view-shot for capturing the screen

const PaidPaymentCard = ({ item }) => {
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const receiptRef = useRef(); // Ref to capture the modal content

  // Function to toggle the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Function to save the receipt as PNG
  const saveReceiptAsPNG = async () => {
    try {
      // Capture the view inside the modal as an image
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 0.8,
      });

      // Save the captured image to the local file system
      const path = `${RNFS.ExternalDirectoryPath}/receipt_${item.paymentIntentId}.png`;

      await RNFS.copyFile(uri, path);

      Alert.alert('Success', `Receipt saved to: ${path}`);
    } catch (error) {
      console.error('Error saving receipt as PNG', error);
      Alert.alert('Error', 'Failed to save receipt as PNG.');
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <Text style={styles.title}>
            {item.tenant.firstName} {item.tenant.lastName}
          </Text>
          <Text style={styles.subText}>{item.amount.toLocaleString()} PKR</Text>
          <Text style={styles.subText}>{formatDate(item.paymentDate)}</Text>
        </View>
        {/* Right Section */}
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>
            {showModal ? 'Close Receipt' : 'View Receipt'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal to display the receipt */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent} ref={receiptRef}>
              <Text style={styles.receiptTitle}>Payment Receipt</Text>

              <View style={styles.receiptSection}>
                <Text style={styles.receiptText}>Amount: {item.amount.toLocaleString()} PKR</Text>
                <Text style={styles.receiptText}>Payment ID: {item.paymentIntentId}</Text>
              </View>
              <View style={styles.receiptSection}>
                <Text style={styles.receiptText}>Tenant: {item.tenant.firstName} {item.tenant.lastName}</Text>
                <Text style={styles.receiptText}>Property Name: {item.lease.propertyId.propertyName}</Text>
                <Text style={styles.receiptText}>Property Location: {item.lease.propertyId.location}</Text>
              </View>
              <View style={styles.receiptSection}>
                <Text style={styles.receiptText}>Payment Date: {formatDate(item.paymentDate)}</Text>
                <Text style={styles.receiptText}>Payment Time: {formatTime(item.paymentDate)}</Text>
              </View>
              {item.month && (
                <Text style={styles.receiptText}>Month: {item.month}</Text>
              )}

              {/* Save Receipt as PNG Button */}
              <TouchableOpacity style={styles.saveButton} onPress={saveReceiptAsPNG}>
                <Text style={styles.saveButtonText}>Save Receipt as PNG</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
                <Icon name="close" size={30} color={Colors.dark} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderColor: Colors.gray,
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: fonts.bold,
  },
  subText: {
    fontSize: 16,
    color: Colors.dark,
    fontFamily: fonts.semiBold,
    marginTop: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: '85%',
  },
  modalContent: {
    paddingHorizontal: 10, // Optional: to prevent text from touching the edges
  },
  receiptTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.dark,
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingBottom: 10
  },
  receiptSection: {
    marginBottom: 20, // Space between sections
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 1,
    left: 8,
    zIndex: 1,
  },
  receiptText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});

export default PaidPaymentCard;
