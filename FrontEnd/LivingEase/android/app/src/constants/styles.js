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
    backgroundColor: Colors.lightgrey,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%', // Ensure full width
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.darkText,
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
  
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ensure button takes full width
    alignSelf: 'center', // Center the button horizontally
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // for Android
  },
  buttonText: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },

  inputTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.blue,
    marginBottom: 5,
  },
});

export default commonStyles;
