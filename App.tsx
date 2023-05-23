import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid} from 'react-native';
import { Platform } from 'react-native';

import SplashScreen from './app/ui/otherScreens/!SplashScreen';
import AppNavigation from './app/navigation/AppNavigation';
import {updateCaches} from './app/utils/functions/CacheHelpers';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  const requestUserPermission = async() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        console.log('Notifications authorized:', enabled);
      }
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const token = await EncryptedStorage.getItem('auth_token');

      if (token) {
        setLoggedIn(true);
        await updateCaches(token);
      } else {
        setLoggedIn(false);
      }

      setLoading(false);
      requestUserPermission();
    };

    initialize();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const getCorrectStack = () => {
    return <AppNavigation isLoggedIn={isLoggedIn} />;
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
