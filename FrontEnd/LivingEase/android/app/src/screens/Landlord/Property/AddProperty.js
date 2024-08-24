import React, {useState} from 'react';
import {Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {launchImageLibrary} from 'react-native-image-picker';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import apiClient from '../../../../../../apiClient';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Location from './Locations';
import commonStyles from '../../../constants/styles';
import LocationComponent from './Locations';

const AddProperty = () => {
  const navigation = useNavigation();
  const [propertyCategory, setPropertyCategory] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [amenities, setAmenities] = useState([]);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);
  const handleAddImage = () => {
    if (images.length < 15) {
      handleSelectImage();
    } else {
      Alert.alert('Image Limit Reached', 'You can only add up to 15 images.');
    }
  };
  const handleCityChange = (city) => {
    setCity(city);
  };
  const handlePropertyCategoryChange = category =>
    setPropertyCategory(category);

  const handleLocationChange = text => setLocation(text);
  const handleAreaChange = text => setArea(text);
  const handleRentPriceChange = text => setRentPrice(text);
  const handleIncrement = setter => {
    setter(prev => String(parseInt(prev) + 1));
  };

  const handleDecrement = setter => {
    setter(prev => {
      const newValue = parseInt(prev) - 1;
      return newValue < 0 ? '0' : String(newValue);
    });
  };

  const handleAmenitiesChange = amenity => {
    setAmenities(prevAmenities =>
      prevAmenities.includes(amenity)
        ? prevAmenities.filter(item => item !== amenity)
        : [...prevAmenities, amenity],
    );
  };

  const handlePropertyTitleChange = text => setPropertyTitle(text);
  const handlePropertyDescriptionChange = text => setPropertyDescription(text);
  const handleSubmit = async () => {
    if (
      !propertyCategory ||
      !city ||
      !location ||
      !area ||
      !rentPrice ||
      !bedrooms ||
      !bathrooms ||
      amenities.length === 0 ||
      !propertyTitle ||
      !propertyDescription ||
      images.length === 0
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields and add at least one image.');
      return; // Stop the function if validation fails
    }
  
    const formData = new FormData();
    formData.append('propertyCategory', propertyCategory);
    formData.append('city', city);
    formData.append('location', location);
    formData.append('area', area);
    formData.append('rentPrice', rentPrice);
    formData.append('bedrooms', bedrooms);
    formData.append('bathrooms', bathrooms);
    amenities.forEach((amenity) => {
      formData.append('amenities', amenity);
    });
    formData.append('propertyTitle', propertyTitle);
    formData.append('propertyDescription', propertyDescription);
    images.forEach((image) => {
      formData.append('images', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    });
    amenities.forEach((amenity) => {
      formData.append('amenities', amenity);
    });
    try {
      const response = await apiClient.post('properties/addproperty', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      // Show success alert
      console.log(response.data);
      Alert.alert('Success', 'Your property listing is now published.', [
        { text: 'OK', onPress: () => navigation.navigate('ManageProperty') }, // Navigate to Home
      ]);
    } catch (error) {
      console.error(error);
      // Show error alert
      Alert.alert('Error', 'There was a problem publishing your property listing. Please try again.');
    }
  };

  const handleRemoveImage = index => {
    setImages(images.filter((_, i) => i !== index));
    setImageCount(imageCount - 1); // Update image count
  };

  const handleSelectImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 15 - imageCount,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedImages = response.assets.map(asset => asset.uri);
        setImages([...images, ...selectedImages]);
        setImageCount(imageCount + selectedImages.length);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.formContainer}>

        {/* Property Category */}
        <Text style={commonStyles.inputTitle}>Property Category</Text>
        <View style={styles.selectionContainer}>
          {[
            'house',
            'flat',
            'upper portion',
            'lower portion',
            'ground portion',
            'farm house',
            'room',
            'guest house',
            'villa', 'Office','Building','Shop',
          ].map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.selectionButton,
                propertyCategory === category && styles.selectedButton,
              ]}
              onPress={() => handlePropertyCategoryChange(category)}>
              <Text style={styles.selectionButtonText}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        
        </View>

    
        <LocationComponent onSelectCity={(selectedCity) => {
        setCity(selectedCity);
        console.log('Selected city:', selectedCity);
      }} />
      

        {/* Location */}
        <View >
          
          <Text style={commonStyles.inputTitle}>Location</Text>
          <View style={commonStyles.inputWrapper} >
          <TextInput
            value={location}
            onChangeText={handleLocationChange}
            
            style={commonStyles.inputField}
          />
        </View>
        </View>
{/* Property Images */}
<Text style={commonStyles.inputTitle}>Property Images</Text>
<View style={styles.imagesContainer}>
  {/* Map through the images and display them */}
  {images.map((image, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: image }} style={styles.image} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => handleRemoveImage(index)}
      >
        <Icon name="close" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  ))}

  {/* Always show the Add Image button */}
  <TouchableOpacity
    onPress={handleAddImage}
    style={styles.addImageButton}
  >
    <Text style={styles.addImageButtonText}>+</Text>
  </TouchableOpacity>
</View>


        {/* Area in Marla */}
        <View >
          <Text style={commonStyles.inputTitle}>Area </Text>
          <View  style={commonStyles.inputWrapper}>
          <TextInput
            value={area}
            placeholder="Enter Area of Property"
              placeholderTextColor={Colors.placeholdertext}
            onChangeText={handleAreaChange}

            keyboardType="numeric"
            style={commonStyles.inputField}
          />
          <Text style={styles.fixedCurrency}>MARLA</Text>
        </View>
        </View>
        <View style={styles.featuresContainer}>
          <View style={styles.featureInput}>
            <Text style={commonStyles.inputTitle}>Bedrooms</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDecrement(setBedrooms)}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                value={bedrooms}
                onChangeText={setBedrooms}
                placeholder="Bedrooms"
                keyboardType="numeric"
                style={styles.shortInput}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleIncrement(setBedrooms)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.featureInput}>
            <Text style={commonStyles.inputTitle}>Bathrooms</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDecrement(setBathrooms)}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                value={bathrooms}
                onChangeText={setBathrooms}
                placeholder="Bathrooms"
                keyboardType="numeric"
                style={styles.shortInput}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleIncrement(setBathrooms)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <Text style={commonStyles.inputTitle}>Amenities</Text>
        <View style={styles.selectionContainer}>
          {[
            'Parking',
            'Water Supply',
            'CCTV Cameras','Wi-Fi',
            'Electricity',
            'Gas',
          ].map(amenity => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.selectionButton,
                amenities.includes(amenity) && styles.selectedButton,
              ]}
              onPress={() => handleAmenitiesChange(amenity)}>
              <Text style={styles.selectionButtonText}>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Property Title */}
        <View >
          <Text style={commonStyles.inputTitle}>Property Title</Text>
          <View  style={commonStyles.inputWrapper}>
          <TextInput
            value={propertyTitle}
            onChangeText={handlePropertyTitleChange}
            placeholder="Enter Property Title"
            placeholderTextColor={Colors.placeholdertext}
            style={commonStyles.inputField}
          />
        </View>
        </View>

        {/* Property Description */}
        <View >
          <Text style={commonStyles.inputTitle}>Property Description</Text>
          <View style={commonStyles.descriptionWrapper} >
          <TextInput
            style={styles.descriptionField}
            value={propertyDescription}
            placeholder="Enter Property Description"
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={handlePropertyDescriptionChange}
            multiline
            numberOfLines={10}
          />
        </View>
      </View>
        {/* Rent Price */}
        <View >
          <Text style={[commonStyles.inputTitle, { paddingTop: 10 }]}>Monthly Rent</Text>
          <View  style={commonStyles.inputWrapper}>
          <TextInput
            value={rentPrice}
            onChangeText={handleRentPriceChange}
            keyboardType="numeric"
            placeholder="Enter Monthly Rent"
            placeholderTextColor={Colors.placeholdertext}
            style={commonStyles.inputField}
          />
          <Text style={styles.fixedCurrency}>PKR</Text>
        </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={commonStyles.button}>
          <Text style={commonStyles.buttonText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  descriptionWrapper: {
    backgroundColor: Colors.lightgrey,
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    paddingBottom:10,
    color: Colors.darkText, // Ensure full width
  },
  descriptionField: {
    height: 150, // Adjust height for multiline input
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop:10,
    paddingBottom:10,
    fontFamily: fonts.regular,
    fontSize: 16,
    borderRadius:10,
    color: Colors.darkText,
    backgroundColor: Colors.lightgrey,
    textAlignVertical: 'top', // Align text to the top of the input field
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily:fonts.regular,
    fontSize: 16,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical:10,
    marginVertical: 10,
    paddingTop:10,
    backgroundColor: Colors.lightgrey
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontFamily:fonts.regular,
  },
  selectionButtonText:
  {fontFamily:fonts.regular,
    fontSize:16,
    color:Colors.darkText,
  },
  buttonText: {
    fontFamily:fonts.regular,
    fontSize: 25,
    color: Colors.white,
  },
  fixedCurrency: {
    marginLeft: 8,
    fontSize: 16,

    fontFamily: fonts.semiBold,
    color: Colors.placeholdertext,
  },
  shortInput: {
    fontFamily:fonts.regular,
    color:Colors.darkText,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectionButton: {
    borderRadius: 10,
    padding: 10,
    margin: 5,
    backgroundColor: Colors.lightgrey,
  },
  
  selectedButton: {
    borderRadius: 10,
    padding: 10,
    margin: 5,
    backgroundColor: Colors.lightgrey,
    borderColor: Colors.primary,
    borderWidth:2,
  },
  
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  addImageButton: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 20,
    backgroundColor: Colors.lightgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButtonText: {
    fontSize: 40,
    color: Colors.blue,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    padding: 4,
  },
 
});

export default AddProperty;
