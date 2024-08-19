import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import mime from 'mime';

const SettingsScreen = () => {
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigation = useNavigation();
  
  const uploadImage = async (image) => {
    const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    type: mime.getType(image.uri),
    name: image.uri.split("/").pop(),
  });
  
    try {
      const response = await apiClient.post('/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        console.log('Image uploaded successfully!');
        setProfilePicture(response.data.data.profileImage.url);
      } else {
        console.log('Error uploading image:', response.status);
        console.log('Error response:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error response:', error.response);
    }
  };
  const handleEditProfile = () => {
    navigation.navigate('CommonNavigator', {
      screen: 'EditProfileScreen',
    });
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        uploadImage(image); // Call the uploadImage function here
        setProfilePicture(image.uri);
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
        const image = response.assets[0];
        uploadImage(image); // Call the uploadImage function here
        setProfilePicture(image.uri);
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImageSourceSelection}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          <TouchableOpacity style={styles.cameraButton} onPress={handleImageSourceSelection}>
            <Icon name="camera" size={20} color={Colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.name}>{firstName} {lastName}</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButtonContainer}>
          <Text style={styles.editButtonText}>View and Edit Profile</Text>
          <Icon name="square-edit-outline" size={20} color={Colors.blue} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => console.log('Public Profile')}>
          <Icon style={styles.icon} name="eye-outline" size={26} color={Colors.primary} />
          <Text style={styles.optionText}>Public Profile</Text>
          <Icon name="chevron-right" size={26} color={Colors.blue} style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => console.log('Payments')}>
          <Icon style={styles.icon} name="credit-card" size={26} color={Colors.primary} />
          <Text style={styles.optionText}>Payments</Text>
          <Icon name="chevron-right" size={26} color={Colors.blue} style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => console.log('Notifications')}>
          <Icon style={styles.icon} name="bell" size={26} color={Colors.primary} />
          <Text style={styles.optionText}>Notifications</Text>
          <Icon name="chevron-right" size={26} color={Colors.blue} style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => console.log('Logout')}>
          <Icon style={styles.icon} name="logout" size={26} color={Colors.primary} />
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="chevron-right" size={26} color={Colors.blue} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    shadowColor: Colors.primary,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 5,
  },
  name: {
    marginTop: 10,
    marginBottom: -5,
    fontSize: 26,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  editButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: Colors.primary,
    marginRight: 10,
  },
  editIcon: {
    marginLeft: -5,
  },
  optionsContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.blue,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});

export default SettingsScreen;
