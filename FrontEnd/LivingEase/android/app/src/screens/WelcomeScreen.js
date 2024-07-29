import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import commonStyles from '../constants/styles';
import Colors from '../constants/Colors';
import fonts from '../constants/Font';

const WelcomeScreen = ({ navigation }) => {
  const handleSignInPress = () => {
    navigation.navigate('SignInScreen');
  };

  const handleGetStartedPress = () => {
    navigation.navigate('SelectRoleScreen'); // Changed to SelectRoleScreen
  };

  return (
    <View style={commonStyles.container}>
      <ImageView />
      <Text style={commonStyles.title}>
        <Text style={{ color: Colors.text }}>Living</Text>
        <Text style={{ color: Colors.primary }}>Ease</Text>
      </Text>
      <Text style={commonStyles.subtitle}>
      Your All-in-One Rental Solution for Seamless Living
      </Text>
      <TouchableOpacity
        style={commonStyles.button}
        onPress={handleGetStartedPress}
      >
        <Text style={commonStyles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={{
        fontSize: 16,
        fontFamily:fonts.semiBold,
        color: Colors.text,
        textAlign: 'center',
        marginTop: 10,
      }}>
        Already have an account?{' '}
        <Text
          style={{
            color: Colors.blue,
            textDecorationLine: 'bold',
          }}
          onPress={handleSignInPress}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
};

const ImageView = () => {
  return (
    <View style={{
      width: '95%',
      height: 400,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginBottom: 20,
      alignSelf: 'center',
    }}>
      <Image
        source={require('../main/assets/images/house2.jpg')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }}
      />
    </View>
  );
};

export default WelcomeScreen;