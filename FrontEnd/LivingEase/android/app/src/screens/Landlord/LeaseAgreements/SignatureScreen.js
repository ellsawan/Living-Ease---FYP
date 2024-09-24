import React, { useRef } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
const SignatureScreenComponent = ({ onOK }) => {
  const signatureRef = useRef(null);

  const saveSignature = () => {
    signatureRef.current.saveImage();
  };

  const onSaveEvent = (result) => {
    console.log('Signature saved:', result.encoded);
    onOK(result.encoded);
    Alert.alert('Success', 'Signature saved successfully!');
  };

  const onDragEvent = () => {
    console.log('User is dragging');
  };

  return (
    <View style={styles.container}>
      <View style={styles.signatureContainer}>
        <SignatureCapture
          style={styles.signature}
          ref={signatureRef}
          onSaveEvent={onSaveEvent}
          onDragEvent={onDragEvent}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'portrait'}
               
         minStrokeWidth={4}
                   
        maxStrokeWidth={4}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={saveSignature}>
        <Text style={styles.buttonText}>Save Signature</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => signatureRef.current.resetImage()}>
        <Text style={styles.buttonText}>Reset Signature</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signatureContainer: {
    width: '100%',
    height: 200,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: Colors.lightgrey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
      
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:30,
  },
  signature: {
    width: '100%',
    height: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary, // Button background color
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%', 
    alignItems: 'center',
    elevation:5,
  },
  buttonText: {
    color: Colors.white, 
    fontFamily:fonts.bold,
    fontSize: 16,
  },
});

export default SignatureScreenComponent;
