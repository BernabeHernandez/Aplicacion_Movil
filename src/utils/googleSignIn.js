import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.webClientId || '16257795217-eichv7uhkfa9hl6vnbd00dmck1mpj8p7.apps.googleusercontent.com',
  });
};