import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import commonStyles from '../../../constants/styles';

const LocationComponent = ({ onSelectCity }) => {
  const [city, setCity] = useState('');

  const handleSelectCity = (data, details = null) => {
    setCity(data.description);
    onSelectCity(data.description);
  };

  return (
 
      <View keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          placeholder='Search City'
          fetchDetails={true}
          disableScroll={true}
          listViewDisplayed={false}
          enablePoweredByContainer={false}
          onPress={handleSelectCity}
          query={{
            key: 'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ',
            language: 'en',
            types: 'geocode',
          }}
          styles={{
            textInput: commonStyles.inputField,
            container: { marginBottom: 10 },
          }}
        />
      </View>
    
  );
};

export default LocationComponent;