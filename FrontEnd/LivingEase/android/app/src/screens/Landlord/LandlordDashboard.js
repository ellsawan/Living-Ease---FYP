import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import fonts from '../../constants/Font';

const Stack = createStackNavigator();

const LandlordDashboard = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TopBar />
      <Greeting />
      <View style={styles.cardsContainer}>
        <DashboardCard
          title="My Property"
          icon="home"
          description="View and manage your properties"
          onPress={() => navigation.navigate('ManageProperty')}
        />
        <DashboardCard
          title="My Tours"
          icon="map"
          description="Schedule and manage property tours"
          onPress={() => console.log('Navigate to My Tours screen')}
        />
        <DashboardCard
          title="My Applications"
          icon="file-document-outline"
          description="View and manage rental applications"
          onPress={() => console.log('Navigate to My Applications screen')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file-cabinet"
          description="View and manage lease agreements"
          onPress={() => console.log('Navigate to Lease Agreement screen')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="currency-usd"
          description="View and manage rent payments"
          onPress={() => console.log('Navigate to Rent Payment screen')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench-outline"
          description="View and manage maintenance requests"
          onPress={() => console.log('Navigate to Maintenance Requests screen')}
        />
      </View>
    </View>
  );
};

const DashboardCard = ({title, icon, description, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name={icon} size={32} color={Colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 20,
    shadowColor: Colors.dark,
    shadowOffset: {width: 40, height: 40},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '45%',
    height: 160,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    marginTop: 10,
    marginBottom: 5,
    color: Colors.darkText,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.placeholdertext,
    textAlign: 'center',
  },
});

export default LandlordDashboard;
