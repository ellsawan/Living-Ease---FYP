import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import TopBar from '../common/TopBar';
import Greeting from '../common/Greeting';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ManageProperty from './Property/ManageProperty';
import AddProperty from './Property/AddProperty';
import fonts from '../../constants/Font';
import CustomHeaderBackButton from '../../constants/customHeaderBackButton';

const Stack = createStackNavigator();

const LandlordDashboard = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" 
      component={DashboardScreen} 
      options={{
        headerShown: false, }}/>
      <Stack.Screen name="ManageProperty" component={ManageProperty} />
      <Stack.Screen name="AddProperty" component={AddProperty} options={{ headerTitle: 'Add Listing',headerTitleAlign: 'center',headerLeft: () => (
              <CustomHeaderBackButton onPress={() => navigation.goBack()} />
            ), headerTitleStyle: { fontFamily:fonts.semiBold,fontSize:18, color: Colors.blue,marginTop:15}
    }}/> 
    </Stack.Navigator>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: Colors.background, flex: 1, padding: 0 }}>
      <TopBar />
      <Greeting />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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
          icon="file"
          description="View and manage rental applications"
          onPress={() => console.log('Navigate to My Applications screen')}
        />
        <DashboardCard
          title="Lease Agreement"
          icon="file"
          description="View and manage lease agreements"
          onPress={() => console.log('Navigate to Lease Agreement screen')}
        />
        <DashboardCard
          title="Rent Payment"
          icon="cash"
          description="View and manage rent payments"
          onPress={() => console.log('Navigate to Rent Payment screen')}
        />
        <DashboardCard
          title="Maintenance Requests"
          icon="wrench"
          description="View and manage maintenance requests"
          onPress={() => console.log('Navigate to Maintenance Requests screen')}
        />
      </View>
    </View>
  );
};

const DashboardCard = ({ title, icon, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft:15,marginBottom: 20, marginRight: 15 }}>
      <View
        style={{
          backgroundColor: Colors.white,
          padding: 20,
          borderRadius: 10,
          shadowColor: Colors.dark,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 3,
          width: 160,
          height: 130,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons name={icon} size={28} color={Colors.primary} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: Colors.darkText }}>
          {title}
        </Text>
        <Text style={{ fontSize: 13, textAlign: 'center', color: Colors.placeholdertext }}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};


export default LandlordDashboard;