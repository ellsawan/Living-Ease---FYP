import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import commonStyles from '../../constants/styles';
import Location from './Location';
import {useRoute, useNavigation} from '@react-navigation/native';
import apiClient from '../../../../../apiClient';

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

const sizeUnits = ['Marla', 'Sq Ft', 'Sq M', 'Sq Yd', 'Kanal'];

const SearchFilter = ({route}) => {
  const [locationLatLng, setLocationLatLng] = useState({
    type: 'Point',
    coordinates: [0, 0],
  });
  const navigation = useNavigation();

  const [distance, setDistance] = useState(route.params?.distance || '');
  const [propertyType, setPropertyType] = useState('Residential');
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState(route.params?.address || '');
  const [minRentPrice, setMinRentPrice] = useState('');
  const [maxRentPrice, setMaxRentPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('');
  const [minPropertySize, setMinPropertySize] = useState('');
  const [maxPropertySize, setMaxPropertySize] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSizeUnit, setSelectedSizeUnit] = useState('Marla');
  const bedroomOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  const bathroomOptions = ['1', '2', '3', '4', '5', '6+'];
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const handleCategoryToggle = item => {
    setCategory(prevCategory =>
      prevCategory.includes(item)
        ? prevCategory.filter(c => c !== item)
        : [...prevCategory, item],
    );
  };
  const handleSelectAllCategories = () => {
    const categories =
      propertyType === 'Residential'
        ? residentialCategories
        : commercialCategories;
    if (category.length === categories.length) {
      setCategory([]); // Deselect all if already selected
    } else {
      setCategory(categories); // Select all
    }
  };
  const handleIncrement = (setter, value) => {
    const currentValue = parseInt(value, 10);
    if (isNaN(currentValue)) {
      setter('1'); // default to 1 if value is not a number
    } else {
      setter(String(currentValue + 1));
    }
  };
  const {address = 'Select Location on Maps'} = route?.params || {};
  useEffect(() => {
    if (route.params?.locationLatLng) {
      setLocationLatLng(route.params.locationLatLng);
      setLocation(route.params.address);
      setDistance(route.params.distance);
    }
  }, [
    route.params?.locationLatLng,
    route.params?.address,
    route.params?.distance,
  ]);

  const onLocationSelect = selectedLocation => {
    setLocation(selectedLocation);
  };

  const handleDecrement = (setter, value) => {
    const currentValue = parseInt(value, 10);
    if (isNaN(currentValue)) {
      setter('0'); // default to 0 if value is not a number
    } else if (currentValue > 0) {
      setter(String(currentValue - 1));
    }
  };

  const handleSearch = async () => {
    // Validate rent and property size inputs
    const minRent = parseFloat(minRentPrice);
    const maxRent = parseFloat(maxRentPrice);
    const minProperty = parseFloat(minPropertySize);
    const maxProperty = parseFloat(maxPropertySize);

    // List of all available categories
    const allCategories = [
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

    // Ensure that categories are set to all categories if propertyType is empty or undefined
    const finalCategory =
      propertyType === '' || propertyType === undefined || category.length === 0
        ? allCategories
        : category;

    // Validate input values
    if ((minRentPrice && isNaN(minRent)) || (maxRentPrice && isNaN(maxRent))) {
      Alert.alert('Error', 'Rent values must be numeric.');
      return;
    }

    if (
      (minPropertySize && isNaN(minProperty)) ||
      (maxPropertySize && isNaN(maxProperty))
    ) {
      Alert.alert('Error', 'Property size values must be numeric.');
      return;
    }

    if (minRentPrice && maxRentPrice && minRent > maxRent) {
      Alert.alert('Error', 'Maximum rent cannot be less than minimum rent.');
      return;
    }

    if (minPropertySize && maxPropertySize && minProperty > maxProperty) {
      Alert.alert(
        'Error',
        'Maximum property size cannot be less than minimum property size.',
      );
      return;
    }

    const searchParams = {
      propertyType,
      category: finalCategory.join(', '), // Join the array of categories into a string
      minRentPrice: minRentPrice ? minRentPrice : undefined,
      maxRentPrice: maxRentPrice ? maxRentPrice : undefined,
      bedrooms:
        selectedBedrooms === '10+'
          ? '10_or_more'
          : selectedBedrooms
          ? parseInt(selectedBedrooms, 10)
          : undefined,
      bathrooms:
        selectedBathrooms === '6+'
          ? '6_or_more'
          : selectedBathrooms
          ? parseInt(selectedBathrooms, 10)
          : undefined,
      minPropertySize: minPropertySize ? minPropertySize : undefined,
      maxPropertySize: maxPropertySize ? maxPropertySize : undefined,
      sizeUnit,
      location,
      longitude: locationLatLng?.coordinates?.[0] || '',
      latitude: locationLatLng?.coordinates?.[1] || '',
      distance: parseFloat(distance),
    };

    // Filter out undefined and null values
    const filteredSearchParams = {};
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key];
      if (value !== '' && value !== undefined && value !== null) {
        filteredSearchParams[key] = value;
      }
    });

    try {
      const response = await apiClient.get('/property/search', {
        params: filteredSearchParams,
      });

      navigation.navigate('Properties', {
        searchParams: response.data,
        filteredSearchParams: filteredSearchParams,
      });
      console.log('navigating with', filteredSearchParams);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSizeUnitSelect = unit => {
    setSelectedSizeUnit(unit);
    setSizeUnit(unit);
    setModalVisible(false);
  };

  const renderSizeUnitItem = ({item}) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSizeUnitSelect(item)}>
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCategoryButtons = () => {
    const categories = residentialCategories;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            category.length === residentialCategories.length &&
              styles.categoryButtonActive,
          ]}
          onPress={handleSelectAllCategories}>
          <Text style={styles.categoryButtonText}>All</Text>
        </TouchableOpacity>
        {categories.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category.includes(item) && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryToggle(item)}>
            <Text style={styles.categoryButtonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  const renderHorizontalOptions = (
    options,
    selectedOption,
    setSelectedOption,
    label,
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={commonStyles.inputTitle}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOption === option && styles.optionButtonActive,
            ]}
            onPress={() => {
              // If the selected option is already selected, deselect it
              if (selectedOption === option) {
                setSelectedOption(''); // or null
              } else {
                setSelectedOption(option);
              }
            }}>
            <Text style={styles.optionButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Category */}
      <View style={styles.inputWrapper}>
        <Text style={commonStyles.inputTitle}>Property Category</Text>
        <View style={styles.buttonGroup}>
          {propertyType && renderCategoryButtons()}
        </View>
      </View>

      {/* Location */}
      <View style={styles.inputWrapper}>
        <Text style={commonStyles.inputTitle}>Location</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Location')}>
          <Text style={styles.textInput}>{address}</Text>
        </TouchableOpacity>
      </View>

      {/* Rent Price Range */}
      <View style={styles.inputWrapper}>
        <Text style={commonStyles.inputTitle}>Rent (PKR)</Text>
        <View style={styles.rentPriceContainer}>
          <TextInput
            style={styles.rentPriceInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minRentPrice}
            onChangeText={setMinRentPrice}
          />
          <Text style={styles.rentPriceDivider}>TO</Text>
          <TextInput
            style={styles.rentPriceInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxRentPrice}
            onChangeText={setMaxRentPrice}
          />
        </View>
      </View>

      {/* Bedrooms */}
      {propertyType === 'Residential' && (
        <>
          {renderHorizontalOptions(
            bedroomOptions,
            selectedBedrooms,
            setSelectedBedrooms,
            'Bedrooms',
          )}

          {/* Bathrooms */}

          {/* Bathrooms */}
          {renderHorizontalOptions(
            bathroomOptions,
            selectedBathrooms,
            setSelectedBathrooms,
            'Bathrooms',
          )}
        </>
      )}

      {/* Property Size Range */}
      <View style={styles.sizeRangeWrapper}>
        <Text style={commonStyles.inputTitle}>Property Size </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.sizeUnitText}>{selectedSizeUnit}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rentPriceContainer}>
        <TextInput
          style={styles.rentPriceInput}
          placeholder="Min"
          keyboardType="numeric"
          value={minPropertySize}
          onChangeText={setMinPropertySize}
        />
        <Text style={styles.rentPriceDivider}>TO</Text>
        <TextInput
          style={styles.rentPriceInput}
          placeholder="Max"
          keyboardType="numeric"
          value={maxPropertySize}
          onChangeText={setMaxPropertySize}
        />
      </View>

      {/* Size Unit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={sizeUnits}
              renderItem={renderSizeUnitItem}
              keyExtractor={item => item}
            />
          </View>
        </View>
      </Modal>

      {/* Apply Button */}
      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.button} onPress={handleSearch}>
          <Text style={commonStyles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  sizeRangeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sizeUnitButtonText: {
    color: Colors.white, // Text color
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  textInput: {
    height: 50,
    backgroundColor: Colors.lightgrey,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: Colors.darkText,
    textAlign: 'autor',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.lightgrey,
    borderColor: Colors.gray,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: Colors.blue,
  },
  buttonActive: {
    borderColor: Colors.primary,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.lightgrey,
    borderColor: Colors.gray,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: Colors.blue,
  },
  categoryButtonActive: {
    borderColor: Colors.primary,
  },
  rentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rentPriceInput: {
    flex: 1,
    height: 50,
    borderColor: Colors.gray,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: Colors.darkText,
  },
  rentPriceDivider: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    paddingHorizontal: 10,
  },
  sizeUnitButton: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sizeUnitText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: Colors.placeholdertext,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: Colors.darkText,
  },

  optionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: Colors.lightgrey,
    borderRadius: 20,
    marginRight: 10,
  },
  optionButtonActive: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
  },
});

export default SearchFilter;
