import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationView = ({ lat, long }) => {
  const [region, setRegion] = useState({
    latitude: lat,
    longitude: long,
    latitudeDelta: 0.1, // Increased delta values
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    setRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.1, // Increased delta values
      longitudeDelta: 0.1,
    });
  }, [lat, long]);

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, { borderRadius: 50 }]}
        region={region} // Set the region prop to the current region state
        provider={MapView.PROVIDER_GOOGLE}
        apiKey={'AIzaSyCapL4yjDAZ76uB41u1dmYjNGkHs9PXDnQ'} // Replace with your own API key
      >
        <Marker
          coordinate={{ latitude: lat, longitude: long }}
          title="Property Location"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flex: 1,
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  map: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default LocationView;