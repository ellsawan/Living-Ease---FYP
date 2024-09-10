import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';
import Fonts from './Font';

const screenHeight = Dimensions.get('window').height;

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100',
    height: '100',
    resizeMode: 'contain',
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    color: Colors.blue,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.blue,
    fontFamily: Fonts.regular,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth:1.5,
    borderColor: Colors.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    
 
  },
  inputField: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.darkText,
    height: 60,
    
  },
  icon: {
    marginRight: 10,
  },
  
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
   
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center', // Center the button horizontally
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // for Android
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },

  inputTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.blue,
    marginBottom: 5,
  },
});

export default commonStyles;
