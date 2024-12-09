import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import {useNavigation, useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
import apiClient from '../../../../../apiClient';
import mime from 'mime';

const SettingsScreen = () => {
  const [profilePicture, setProfilePicture] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchProfileData = async () => {
    setLoading(true); // Set loading state before fetching
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Fetch profile image
        try {
          const profileImageResponse = await apiClient.get(
            '/user/profile-image',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (
            profileImageResponse.status === 200 &&
            profileImageResponse.data.profileImageUrl
          ) {
            setProfilePicture(profileImageResponse.data.profileImageUrl);
          } else {
            setProfilePicture(
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            );
          }
        } catch (profileImageError) {
          console.log('Error fetching profile image:', profileImageError);
          setProfilePicture(
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          );
        }

        // Fetch user name
        try {
          const nameResponse = await apiClient.get('/user/name', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (nameResponse.status === 200) {
            setFirstName(nameResponse.data.firstName || '');
            setLastName(nameResponse.data.lastName || '');
          } else {
            setError('Failed to fetch user name');
          }
        } catch (nameError) {
          console.error('Error fetching user name:', nameError);
          setError('Failed to fetch user name');
        }
      } else {
        setError('No token found');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData(); // Fetch profile data when screen is focused
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleLogout = async () => {
    try {
      const response = await apiClient.post('auth/logout');
      if (response.status === 200) {
        console.log('Logged out successfully!');
        await AsyncStorage.removeItem('token');
        navigation.navigate('SignInScreen');
      } else {
        console.log('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const uploadImage = async image => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: mime.getType(image.uri),
      name: image.uri.split('/').pop(),
    });

    try {
      const response = await apiClient.post(
        'user/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 201) {
        console.log('Image uploaded successfully!');
        setProfilePicture(response.data.url);
      } else {
        console.log('Error uploading image:', response.status);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('ServiceProviderEditProfile');
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
        uploadImage(image);
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
        uploadImage(image);
        setProfilePicture(image.uri);
      }
    });
  };

  const handleImageSourceSelection = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Take Photo', onPress: handleCamera},
        {text: 'Choose from Library', onPress: handleImagePicker},
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImageSourceSelection}>
          <Image source={{uri: profilePicture}} style={styles.profilePicture} />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImageSourceSelection}>
            <Icon name="camera" size={20} color={Colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
        <TouchableOpacity
          onPress={handleEditProfile}
          style={styles.editButtonContainer}>
          <Text style={styles.editButtonText}>View and Edit Profile</Text>
          <Icon
            name="square-edit-outline"
            size={20}
            color={Colors.blue}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('ServiceProviderPublicProfile')}>
          <Icon
            style={styles.icon}
            name="eye-outline"
            size={26}
            color={Colors.primary}
          />
          <Text style={styles.optionText}>Public Profile</Text>
          <Icon
            name="chevron-right"
            size={26}
            color={Colors.blue}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon
            style={styles.icon}
            name="logout"
            size={26}
            color={Colors.primary}
          />
          <Text style={styles.optionText}>Logout</Text>
          <Icon
            name="chevron-right"
            size={26}
            color={Colors.blue}
            style={styles.arrowIcon}
          />
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 5,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 10,
  },
  name: {
    marginTop: 10,
    marginBottom: -5,
    fontSize: 26,
    fontFamily: fonts.bold,
    color: Colors.blue,
  },
  editButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    marginRight: 5,
  },
  editIcon: {
    marginLeft: 5,
  },
  optionsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
  },
  icon: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: Colors.blue,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;
