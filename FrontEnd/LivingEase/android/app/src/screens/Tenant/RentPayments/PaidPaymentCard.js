import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Button,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs'; // For saving the image to file system

const PaidPaymentCard = ({ paymentData }) => {
  const { amount, landlord, paymentDate, paymentIntentId, lease } = paymentData;
  const [modalVisible, setModalVisible] = useState(false);
  const receiptRef = useRef(); // Reference to capture the modal content

  // Format the payment date and time
  const paymentDateObj = new Date(paymentDate);
  const formattedDate = paymentDateObj.toLocaleDateString();
  const formattedTime = paymentDateObj.toLocaleTimeString(); // Extracts time part

  // Extract location from the property object
  const propertyLocation = lease?.propertyId?.location || 'Location not available';

  const handleViewReceipt = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to save the receipt as a PNG file
  const saveReceiptAsPNG = async () => {
    try {
      // Capture the view inside the modal as an image
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 0.8,
      });

      // Save the captured image to the local file system
      const path = `${RNFS.ExternalDirectoryPath}/receipt_${paymentIntentId}.png`;

      await RNFS.copyFile(uri, path);

      Alert.alert('Success', `Receipt saved to: ${path}`);
    } catch (error) {
      console.error('Error saving receipt as PNG', error);
      Alert.alert('Error', 'Failed to save receipt as PNG.');
    }
  };

  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>
            {landlord.firstName} {landlord.lastName}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.row}>
            {/* Left Section: Payment Info */}
            <View style={styles.leftSection}>
              <Text style={[styles.text, styles.boldAmount]}>
                {amount.toFixed(2)} PKR
              </Text>
              <Text style={styles.text}>{formattedDate}</Text>
            </View>
            {/* Right Section: View Receipt Button */}
            <TouchableOpacity style={styles.button} onPress={handleViewReceipt}>
              <Text style={styles.buttonText}>View Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal for Payment Details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} ref={receiptRef}>
            {/* Close Icon */}
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Icon name="close" size={30} color={Colors.dark} />
            </TouchableOpacity>

            <ScrollView>
              <Text style={styles.modalTitle}>Payment Receipt</Text>

              {/* Receipt Details Section */}
              <View style={styles.receiptSection}>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Amount:</Text> {amount.toFixed(2)} PKR
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Payment ID:</Text> {paymentIntentId}
                </Text>
              </View>

              {/* Landlord Information Section */}
              <View style={styles.receiptSection}>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Landlord:</Text> {landlord.firstName}{' '}
                  {landlord.lastName} ({landlord.email})
                </Text>
              </View>

              {/* Property and Payment Date Section */}
              <View style={styles.receiptSection}>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Location:</Text> {propertyLocation}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Payment Date:</Text> {formattedDate}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Payment Time:</Text> {formattedTime}
                </Text>
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveReceiptAsPNG}>
              <Text style={styles.buttonText}>Save Receipt as PNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'visible',
  },
  cardHeader: {},
  headerText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.primary,
  },
  cardBody: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.dark,
  },
  boldAmount: {
    fontFamily: fonts.bold,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.dark,
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.dark,
    marginVertical: 5,
  },
  bold: {
    fontFamily: fonts.bold,
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
    top: 10,
    left: 10,
    zIndex: 1,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default PaidPaymentCard;
