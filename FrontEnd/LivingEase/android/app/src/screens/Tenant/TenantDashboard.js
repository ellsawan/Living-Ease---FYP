import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import SearchBar from './SearchBar';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const TenantDashboard = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
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
      <SearchBar />
      <View style={styles.cardsContainer}>
        <DashboardCard
          title="My Property"
          icon="home"
          description="View details of your rental home."
          onPress={() => navigation.navigate('MyProperty')}
        />
        <DashboardCard
          title="My Visits"
          icon="map"
          description="View upcoming property visits."
          onPress={() => navigation.navigate('MyVisits')}
        />
        <DashboardCard
          title="My Applications"
          icon="file-document-outline"
          description="Track rental applications."
          onPress={() => navigation.navigate('MyApplications')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file-cabinet"
          description="Access your lease documents."
          onPress={() => navigation.navigate('MyLeaseAgreements')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="currency-usd"
          description="Review your payment history."
          onPress={() => console.log('Navigate to Rent Payment screen')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench-outline"
          description="Report issues."
          onPress={() => console.log('Navigate to Maintenance Requests screen')}
        />
      </View>
    </View>
  );
};

const DashboardCard = ({ title, icon, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name={icon} size={30} color={Colors.primary} />
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '48%',
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
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default TenantDashboard;
