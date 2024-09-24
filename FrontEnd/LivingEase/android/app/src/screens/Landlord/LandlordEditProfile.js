import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import commonStyles from '../../constants/styles';
import fonts from '../../constants/Font';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import apiClient from '../../../../../apiClient';

const EditProfileScreen = ({ navigation }) => {
  const [contactNumber, setContactNumber] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('user/userData');
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setContactNumber(userData.contactNumber.replace('+92 ', '')); // Remove +92 prefix
        setProfileImage(
          userData.profileImage ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

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

  const handleSave = async () => {
    try {
      setLoading(true);
      const trimmedContactNumber = `+92 ${contactNumber.trim()}`; // Add +92 prefix

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('contactNumber', trimmedContactNumber);
      formData.append('email', email);

      if (
        profileImage &&
        profileImage !==
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      ) {
        formData.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        });
      }

      const response = await apiClient.put('user/updateUserData', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'Email is already in use'
      ) {
        Alert.alert(
          'Error',
          'This email is already in use. Please use another email.'
        );
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactNumberChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setContactNumber(cleanedText);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImageSourceSelection}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImageSourceSelection}
          >
            <Icon name="camera" size={20} color={Colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
      </View>

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

        <Text style={commonStyles.inputTitle}>Email</Text>
        <View style={commonStyles.inputWrapper}>
          <Icon
            name="email"
            size={20}
            color={Colors.dark}
            style={commonStyles.icon}
          />
          <TextInput
            style={[commonStyles.inputField, { flex: 1 }]}
            placeholder="Email"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
          {error && error.email && (
            <Text style={{ color: 'red', fontSize: 12 }}>{error.email}</Text>
          )}
        </View>

        <Text style={commonStyles.inputTitle}>Contact Number</Text>
        <View style={commonStyles.inputWrapper}>
          <Text style={{ position: 'absolute', left: 20, top: 15, color: Colors.dark, fontSize: 18 }}>+92 </Text>
          <TextInput
            style={[commonStyles.inputField, { flex: 1, paddingLeft: 50 }]}
            placeholder=""
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={handleContactNumberChange}
            keyboardType="phone-pad"
            maxLength={10}
            value={contactNumber}
          />
        </View>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
        <Text style={commonStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    padding: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 26,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
});

export default EditProfileScreen;
