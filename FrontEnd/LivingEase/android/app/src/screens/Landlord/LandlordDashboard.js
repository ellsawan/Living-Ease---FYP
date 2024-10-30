import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import fonts from '../../constants/Font';

const Stack = createStackNavigator();

const LandlordDashboard = () => {
  const navigation = useNavigation();
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
      <View style={styles.cardsContainer}>
        <DashboardCard
          title="My Property"
          icon="home"
          description="View your properties"
          onPress={() => navigation.navigate('ManageProperty')}
        />
        <DashboardCard
          title="My Visits"
          icon="map"
          description="Schedule visits"
          onPress={() => navigation.navigate('ManageVisits')}
        />
        <DashboardCard
          title="My Applications"
          icon="file-document-outline"
          description="Check applications"
          onPress={() => navigation.navigate('ManageApplications')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file-cabinet"
          description="Access agreements"
          onPress={() => navigation.navigate('ManageAgreements')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="currency-usd"
          description="View payments"
          onPress={() => navigation.navigate('ManagePayments')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench-outline"
          description="Track requests"
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
    shadowOffset: { width: 40, height: 40 },
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
    color: Colors.blue,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default LandlordDashboard;
