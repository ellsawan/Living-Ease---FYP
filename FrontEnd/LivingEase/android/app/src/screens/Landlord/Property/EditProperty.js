import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import commonStyles from '../../../constants/styles';
import Colors from '../../../constants/Colors';
import fonts from '../../../constants/Font';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../../../../../apiClient';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProperty = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {propertyId} = route.params;
  const [propertyType, setPropertyType] = useState('Residential');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState(route.params?.location || '');
  const [propertyName, setPropertyName] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [propertySize, setPropertySize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('Marla');
  const [showSizeUnitDropdown, setShowSizeUnitDropdown] = useState(false);
  const [features, setFeatures] = useState([]);
  const [contactNumber, setContactNumber] = useState('');
  const [images, setImages] = useState([]);
  const [locationLatLng, setLocationLatLng] = useState({
    type: 'Point',
    coordinates: [0, 0],
  });

  const {
    address = 'Select Location on Maps',
  } = route?.params || {};
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (route.params?.locationLatLng) {
      setLocationLatLng(route.params.locationLatLng);
      setRegion({
        latitude: route.params.locationLatLng.coordinates[1],
        longitude: route.params.locationLatLng.coordinates[0],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarkerCoordinate({
        latitude: route.params.locationLatLng.coordinates[1],
        longitude: route.params.locationLatLng.coordinates[0],
      });
      if (route.params?.address) { setLocation(route.params.address);}
    }
  }, [route.params?.locationLatLng, route.params?.address]);
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await apiClient.get(`/property/${propertyId}`);
        const property = response.data.property; // Note the change here

        // Set form data with existing property details
        setPropertyType(property?.propertyType);
        setSelectedCategory(property?.category);
        setLocation(property?.location || '');
        setPropertyName(property?.propertyName);
        setPropertyDescription(property?.propertyDescription);
        setRentPrice(String(property?.rentPrice)); // Convert to string if necessary
        setLocationLatLng(property?.locationLatLng || { type: 'Point', coordinates: [0, 0] });
        setBedrooms(String(property?.bedrooms));
        setBathrooms(String(property?.bathrooms));
        setPropertySize(String(property?.propertySize));
        setSizeUnit(property?.sizeUnit);
        setFeatures(property?.features);
        setContactNumber(property?.contactNumber);
        setImages(property?.images?.map(image => ({uri: image.uri})));
        setRegion({
          latitude: property?.locationLatLng?.coordinates[1] || 37.78825,
          longitude: property?.locationLatLng?.coordinates[0] || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);
  useEffect(() => {
    if (route.params?.address) {
      setLocation(route.params.address);
    }
  }, [route.params]);
  const handleNewLocation = ({ address, locationLatLng }) => {
    console.log('handleNewLocation:', address);
    setLocation(address);
    setLocationLatLng(locationLatLng);
    setRegion({
      latitude: locationLatLng.coordinates[1],
      longitude: locationLatLng.coordinates[0],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarkerCoordinate({
      latitude: locationLatLng.coordinates[1],
      longitude: locationLatLng.coordinates[0],
    });
  };
  console.log('PropertyType:', propertyType);
  console.log('SelectedCategory:', selectedCategory);
  console.log('Location:', location);
  console.log('PropertyName:', propertyName);
  console.log('PropertyDescription:', propertyDescription);
  console.log('RentPrice:', rentPrice);
  console.log('Bedrooms:', bedrooms);
  console.log('Bathrooms:', bathrooms);
  console.log('PropertySize:', propertySize);
  console.log('SizeUnit:', sizeUnit);
  console.log('Features:', features);
  console.log('ContactNumber:', contactNumber);
  console.log('Images:', images);
  console.log('LocationLatLng:', locationLatLng);
  console.log('Region:', region);
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        return userId;
      } else {
        throw new Error('User ID not found');
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    if (
      !propertyType ||
      !selectedCategory ||
      !location ||
      !propertyName ||
      !propertyDescription ||
      !rentPrice ||
      !bedrooms ||
      !bathrooms ||
      !propertySize ||
      !sizeUnit ||
      !contactNumber
    ) {
      alert('Please fill in all fields');
      navigation.navigate('ManageProperty');
      return;
    }

    try {
      const userId = await getUserId();
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
        });
      });

      formData.append('propertyType', propertyType);
      formData.append('category', selectedCategory);
      formData.append('location', address);
      formData.append('propertyName', propertyName);
      formData.append('propertyDescription', propertyDescription);
      formData.append('rentPrice', rentPrice);
     
      formData.append('propertySize', propertySize);
      formData.append('sizeUnit', sizeUnit);
     
      if (propertyType === 'Residential') {
        formData.append('bedrooms', bedrooms);
        formData.append('bathrooms', bathrooms);
      }
      formData.append('contactNumber', contactNumber);
      if (features.length > 0) {
        formData.append('features', JSON.stringify(features));
      }
      formData.append('locationLatLng', JSON.stringify(locationLatLng));
      formData.append('owner', userId);

      console.log('FormData:', formData);
      const response = await apiClient.put(
        `/property/${propertyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log(response.data);
      alert('Property Updated Successfully!');
      navigation.navigate('ManageProperty', {refresh: true});
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Error adding property. Please try again.');
    }
  };

  const handleIncrement = (setter, value) => {
    setter(String(parseInt(value) + 1)); // Ensure value is a string
  };
  const handleDecrement = (setter, value) => {
    const newValue = parseInt(value) - 1;
    setter(String(newValue < 0 ? 0 : newValue)); // Ensure value is a string
  };
  const sizeUnits = ['Marla', 'Sq Ft', 'Sq M', 'Sq Yd', 'Kanal'];
  const residentialCategories = [
    'House',
    'Flat',
    'Lower Portion',
    'Upper Portion',
    'Room',
    'Farm House',
    'Guest House',
    'Annexe',
    'Basement',
  ];
  const commercialCategories = [
    'Office',
    'Shop',
    'Warehouse',
    'Building',
    'Plaza',
  ];
  const featureOptions = [
    'Parking',
    'CCTV Camera',
    'Electricity',
    'Water Supply',
    'Gas',
    'Security',
    'Internet Access',
  ];
  const handleRemoveImage = uri => {
    setImages(images.filter(image => image.uri !== uri));
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo', // Specify the type of media to pick (photo or video)
      quality: 1, // Quality of the image (0 to 1)
      selectionLimit: 0, // 0 means no limit, you can specify a number if you want to limit the selection
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map(asset => ({uri: asset.uri}));
        setImages(prevImages => [...prevImages, ...newImages]);
      }
    });
  };

  const renderCategories = () => {
    const categories =
      propertyType === 'Residential'
        ? residentialCategories
        : commercialCategories;

    return (
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {category === 'House' && (
                <Icon
                  name="home"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Flat' && (
                <Icon
                  name="office-building"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Lower Portion' && (
                <Icon
                  name="home-modern"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Upper Portion' && (
                <Icon
                  name="home-outline"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Room' && (
                <Icon
                  name="bed"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Farm House' && (
                <Icon
                  name="home-city"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Guest House' && (
                <Icon
                  name="home-variant-outline"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Annexe' && (
                <Icon
                  name="home-city"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Basement' && (
                <Icon
                  name="sitemap"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Office' && (
                <Icon
                  name="office-building"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Shop' && (
                <Icon
                  name="storefront"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Warehouse' && (
                <Icon
                  name="warehouse"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Building' && (
                <Icon
                  name="home-city"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              {category === 'Plaza' && (
                <Icon
                  name="storefront"
                  size={20}
                  color={Colors.primary}
                  style={{marginRight: 8}}
                />
              )}
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                {category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const toggleFeature = feature => {
    setFeatures(prevFeatures =>
      prevFeatures.includes(feature)
        ? prevFeatures.filter(f => f !== feature)
        : [...prevFeatures, feature],
    );
  };

  return (
    <ScrollView horizontal={false} keyboardShouldPersistTaps="always">
   
        <View style={styles.formContainer}>
          <Text style={commonStyles.inputTitle}>Property Type</Text>
          <View style={styles.propertyTypeContainer}>
            <TouchableOpacity
              style={[
                styles.propertyTypeButton,
                propertyType === 'Residential' &&
                  styles.selectedPropertyTypeButton,
              ]}
              onPress={() => {
                setPropertyType('Residential');
                setSelectedCategory(''); // Reset category when type changes
              }}>
              <Text
                style={[
                  styles.propertyTypeText,
                  propertyType === 'Residential' &&
                    styles.selectedPropertyTypeText,
                ]}>
                Residential
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.propertyTypeButton,
                propertyType === 'Commercial' &&
                  styles.selectedPropertyTypeButton,
              ]}
              onPress={() => {
                setPropertyType('Commercial');
                setSelectedCategory(''); // Reset category when type changes
              }}>
              <Text
                style={[
                  styles.propertyTypeText,
                  propertyType === 'Commercial' &&
                    styles.selectedPropertyTypeText,
                ]}>
                Commercial
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.primary,
              marginVertical: 10,
            }}
          />
          {renderCategories()}

          <View>
            <Text style={commonStyles.inputTitle}>Location</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Location', {mode: 'add'})}
              style={{
                borderColor: Colors.primary,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: Colors.darkText,
                  fontSize: 16,
                  fontFamily: fonts.semiBold,
                }}>
                {address}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={commonStyles.inputTitle}>Size</Text>
          <View style={commonStyles.inputWrapper}>
            <TextInput
              style={commonStyles.inputField}
              placeholder="Enter size"
              keyboardType="numeric"
              value={propertySize}
              onChangeText={setPropertySize}
            />
            <View style={styles.sizeInputContainer}>
              <Text style={styles.sizeUnitText}>{sizeUnit}</Text>
              <TouchableOpacity onPress={() => setShowSizeUnitDropdown(true)}>
                <Icon name="chevron-down" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {showSizeUnitDropdown && (
              <Modal
                transparent
                visible={showSizeUnitDropdown}
                animationType="fade"
                onRequestClose={() => setShowSizeUnitDropdown(false)}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setShowSizeUnitDropdown(false)}>
                  <View style={styles.sizeUnitDropdown}>
                    <FlatList
                      data={sizeUnits}
                      keyExtractor={item => item}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.sizeUnitOption}
                          onPress={() => {
                            setSizeUnit(item);
                            setShowSizeUnitDropdown(false);
                          }}>
                          <Text style={styles.sizeUnitOptionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>

          <Text style={commonStyles.inputTitle}>Property Images</Text>
          <TouchableOpacity
            onPress={selectImage}
            style={{
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Icon
              name="upload"
              size={20}
              color={Colors.darkText}
              style={{marginRight: 10, alignItems: 'center'}}
            />
            <Text
              style={{
                color: Colors.darkText,
                fontSize: 16,
                textAlign: 'center',
                fontFamily: fonts.semiBold,
              }}>
              UPLOAD IMAGES
            </Text>
          </TouchableOpacity>
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{uri: image.uri}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(image.uri)}>
                  <Icon name="close" size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={commonStyles.inputTitle}>Property Features</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {featureOptions.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  features.includes(feature) && styles.selectedCategoryButton,
                ]}
                onPress={() => toggleFeature(feature)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {feature === 'Parking' && (
                    <Icon
                      name="parking"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'CCTV Camera' && (
                    <Icon
                      name="cctv"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'Electricity' && (
                    <Icon
                      name="lightning-bolt"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'Water Supply' && (
                    <Icon
                      name="water-pump"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'Gas' && (
                    <Icon
                      name="gas-cylinder"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'Security' && (
                    <Icon
                      name="shield"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  {feature === 'Internet Access' && (
                    <Icon
                      name="wifi"
                      size={20}
                      color={Colors.primary}
                      style={{marginRight: 8}}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryText,
                      features.includes(feature) && styles.selectedCategoryText,
                    ]}>
                    {feature}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {propertyType === 'Residential' && (
            <>
              {/* Bedrooms */}
              <View style={styles.featureInput}>
                <Text style={commonStyles.inputTitle}>Bedrooms</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDecrement(setBedrooms, bedrooms)}>
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
                    onPress={() => handleIncrement(setBedrooms, bedrooms)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bathrooms */}
              <View style={styles.featureInput}>
                <Text style={commonStyles.inputTitle}>Bathrooms</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDecrement(setBathrooms, bathrooms)}>
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
                    onPress={() => handleIncrement(setBathrooms, bathrooms)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          <Text style={commonStyles.inputTitle}>Property Title</Text>
          <View style={commonStyles.inputWrapper}>
            <TextInput
              style={commonStyles.inputField}
              placeholder="Enter property title"
              value={propertyName}
              onChangeText={setPropertyName}
            />
          </View>

          <Text style={commonStyles.inputTitle}>Property Description</Text>
          <View style={commonStyles.inputWrapper}>
            <TextInput
              style={commonStyles.inputField}
              placeholder="Enter property description"
              multiline
              numberOfLines={4}
              value={propertyDescription}
              onChangeText={setPropertyDescription}
            />
          </View>

          <Text style={commonStyles.inputTitle}>Monthly Rent</Text>
          <View style={commonStyles.inputWrapper}>
            <TextInput
              style={commonStyles.inputField}
              placeholder="Enter rent price"
              keyboardType="numeric"
              value={rentPrice}
              onChangeText={setRentPrice}
            />
          </View>

          <Text style={commonStyles.inputTitle}>Contact Number</Text>
          <View style={commonStyles.inputWrapper}>
            <TextInput
              style={commonStyles.inputField}
              placeholder="Enter contact number"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={commonStyles.button}>
            <Text style={commonStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 24,
    color: Colors.white,
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  propertyTypeButton: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderColor: Colors.gray,
    borderWidth: 2,
    fontFamily: fonts.semiBold,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPropertyTypeButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 10,
  },
  propertyTypeText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: fonts.bold,
  },
  selectedPropertyTypeText: {
    color: Colors.blue,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 2,
    borderRadius: 10,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderWidth: 2,
    borderColor: Colors.gray,
    borderRadius: 10,
  },
  selectedCategoryButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.blue,
  },
  selectedCategoryText: {
    color: Colors.blue,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  sizeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  sizeInput: {
    flex: 1,
    marginRight: 8,
  },
  sizeUnitText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sizeUnitDropdown: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontFamily: fonts.semiBold,
  },
  sizeUnitOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sizeUnitOptionText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.blue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shortInput: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 16,
    color: Colors.darkText,
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
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    padding: 4,
  },
});

export default EditProperty;
