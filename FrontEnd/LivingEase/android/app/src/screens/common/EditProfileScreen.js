import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import commonStyles from '../../constants/styles';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import fonts from '../../constants/Font';

const EditProfileScreen = ({ navigation }) => {
  const [contactNumber, setContactNumber] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      console.log('Image Picker response:', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      } else {
        console.log('Unexpected response: ', response);
      }
    });
  };

  const handleCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      console.log('Camera response:', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      } else {
        console.log('Unexpected response: ', response);
      }
    });
  };

  const handleImageSourceSelection = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleCamera },
        { text: 'Choose from Library', onPress: handleImagePicker },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    console.log('Saving profile with:', {
      firstName,
      lastName,
      contactNumber,
      profileImage,
    });
    Alert.alert('Success', 'Profile updated successfully!');
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Edit Your Profile</Text>

      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagePickerContainer} onPress={() => {}}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="account-circle" size={100} color={Colors.dark} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImageSourceSelection} style={styles.cameraButton}>
          <Icon name="camera" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameText}>
        {firstName} {lastName}
      </Text>

      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputTitle}>First Name</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon
            name="account"
            size={20}
            color={Colors.dark}
            style={commonStyles.icon}
          />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="First Name"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setFirstName}
            value={firstName}
            autoCapitalize="words"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Last Name</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon
            name="account"
            size={20}
            color={Colors.dark}
            style={commonStyles.icon}
          />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Last Name"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setLastName}
            value={lastName}
            autoCapitalize="words"
          />
        </View>

        <Text style={commonStyles.inputTitle}>Contact Number</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon
            name="phone"
            size={20}
            color={Colors.dark}
            style={commonStyles.icon}
          />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Contact Number"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setContactNumber}
            value={contactNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
        <Text style={commonStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  imagePickerContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  nameText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.green,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default EditProfileScreen;
