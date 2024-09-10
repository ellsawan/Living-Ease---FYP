import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import commonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';

const WelcomeScreen = ({ navigation }) => {
  const handleGetStartedPress = () => {
    navigation.navigate('SelectRoleScreen'); 
  };

  const handleSignInPress = () => {
    navigation.navigate('SignInScreen');
  };

  const { height, width } = Dimensions.get('window');

  return (
    <View style={{ flex: 1 }}> 
      <Image
        source={require('../../main/assets/images/h2.jpg')} 
        style={{
          width,
          height, 
          top: -140,
          resizeMode: 'cover', 
        }}
      />
      <View style={{
        position: 'absolute',
        top: 600,
        bottom: -50,
        width,
        borderRadius: 50,
        backgroundColor: Colors.white,
        padding: 20,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 24,
          marginBottom: 10,
          fontFamily: fonts.bold,
          color: Colors.darkText,
        }}>
          Find, Rent, Relax.
        </Text>
       
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 50,
            paddingVertical: 15,
            paddingHorizontal: 100,
            marginBottom: 20,
          }}
          onPress={handleGetStartedPress}
        >
          <Text style={commonStyles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleSignInPress}>
          <Text style={{
            fontSize: 16,
            fontFamily: fonts.regular,
            color: Colors.darkText,
          }}>
            Already have an account? <Text style={{ fontFamily: fonts.bold }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
