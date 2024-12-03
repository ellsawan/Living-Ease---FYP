import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import apiClient from '../../../../../apiClient';

const Properties = ({route, navigation}) => {
  const [properties, setProperties] = useState([]);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tenantIdFromStorage = await AsyncStorage.getItem('userId');
        setTenantId(tenantIdFromStorage);


        const searchParams = route.params?.searchParams || {};
        const filteredSearchParams = route.params?.filteredSearchParams ;
        console.log('filtrs ',filteredSearchParams)
        const listedProperties = Array.isArray(searchParams)
          ? searchParams.filter(property => property.status === 'listed')
          : [];
        setProperties(listedProperties);
        console.log('search params in properties',searchParams)
        const searchParamsForRecommendation = {
          propertyType: filteredSearchParams.propertyType || 'Residential',
          category: filteredSearchParams.category || 'House, Flat, Lower Portion, Upper Portion, Room, Farm House, Guest House, Annexe, Basement',
          minRentPrice: filteredSearchParams.minRentPrice ,
          maxRentPrice: filteredSearchParams.maxRentPrice ,
          minPropertySize: filteredSearchParams.minPropertySize ,
          maxPropertySize: filteredSearchParams.maxPropertySize ,
          location: filteredSearchParams.location,
          longitude: filteredSearchParams.longitude,
          latitude: filteredSearchParams.latitude,
          distance: filteredSearchParams.distance,
        };
        const response = await apiClient.post(
          'http://10.0.2.2:8081/recommends',
          searchParamsForRecommendation,
        );

        const recommendedPropertyIds = response.data || [];
        console.log('search params for recommendation',searchParamsForRecommendation)
        console.log('ids',response.data)
        if (recommendedPropertyIds.length > 0) {
          const recommendedPropertiesResponse = await apiClient.post(
            '/property/search/properties',
            { ids: recommendedPropertyIds }
          );
          setRecommendedProperties(recommendedPropertiesResponse.data || []);
          console.log(recommendedPropertiesResponse);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params?.searchParams]);

  const handlePress = useCallback(
    (propertyId, ownerId) => {
      navigation.navigate('PropertyDetails', {propertyId, ownerId, tenantId});
    },
    [navigation, tenantId],
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item._id, item.owner)}>
      <Image
        source={{
          uri: item.images?.[0]?.uri || 'https://via.placeholder.com/150',
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {item.propertyName}
        </Text>
        <View style={styles.row}>
          <Icon
            name="location"
            size={18}
            color={Colors.primary}
            style={styles.icon}
          />
          <Text style={styles.propertyLocation} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon
            name="cash"
            size={18}
            color={Colors.primary}
            style={styles.icon}
          />
          <Text style={styles.propertyPrice} numberOfLines={1}>
            {item.rentPrice} Rent
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="bed" size={18} color={Colors.primary} />
            <Text style={styles.propertyDetailText}>
              {item.bedrooms} Bedrooms
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcon name="bathtub" size={18} color={Colors.primary} />
            <Text style={styles.propertyDetailText}>
              {item.bathrooms} Bathrooms
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="grid" size={18} color={Colors.primary} />
            <Text style={styles.propertyDetailText}>
              {item.propertySize} {item.sizeUnit}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ListHeaderComponent={
        <>
          {recommendedProperties.length > 0 && (
            <>
              <Text style={styles.recommendationTitle}>
                AI-Recommended Properties
              </Text>
              <FlatList
                data={recommendedProperties}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                horizontal
                contentContainerStyle={styles.horizontalScrollContainer}
              />
            </>
          )}
          <Text style={styles.listHeader}>All Available Properties</Text>
        </>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      ListEmptyComponent={() => (
        <Text style={styles.noPropertiesText}>
          No properties available at the moment.
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  recommendationTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.primary,
    paddingLeft: 15,
  },
  listHeader: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.primary,
    paddingLeft: 15,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 18,
    paddingBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 6,
    marginHorizontal: 10,
    marginVertical: 15,
    overflow: 'hidden',
    width: 350,
    height: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  propertyName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: Colors.darkText,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  propertyLocation: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: Colors.darkText,
  },
  propertyPrice: {
    fontSize: 14,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailText: {
    fontSize: 14,
    color: Colors.darkText,
    fontFamily: fonts.semiBold,
    marginLeft: 5,
  },
  noPropertiesText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Properties;
