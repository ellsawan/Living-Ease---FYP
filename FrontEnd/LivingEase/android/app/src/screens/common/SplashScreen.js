import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import commonStyles from '../../constants/styles'; 
import Colors from '../../constants/Colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Navigating to Welcome screen'); // Debugging log
      navigation.replace('WelcomeScreen'); //
    }, 2000); // Adjust the duration as needed

    return () => {
      clearTimeout(timer); // Clean up the timer
    };
  }, [navigation]);

  return (
    <View style={[commonStyles.container, { backgroundColor: Colors.white }]}>
      <Image
        source={require('../../main/assets/images/logo.png')}
        style={{ width: 120, height: 120, resizeMode: 'contain' }}
      />
      <Text style={commonStyles.title}>
        <Text style={{ color: Colors.blue}}>Living</Text>
        <Text style={{ color: Colors.primary }}>Ease</Text>
      </Text>
    </View>
  );
};

export default SplashScreen;
