import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';

import SplashScreen from './app/ui/otherScreens/!SplashScreen';
import AppNavigation from './app/navigation/AppNavigation';
import {updateCaches} from './app/utils/functions/CacheHelpers';
import {saveTokenToDatabase} from './app/utils/api/authAPI';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  const requestNotificationPerms = async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } else {
      await messaging().requestPermission();
    }
  };

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
      requestNotificationPerms();
    };

    initialize();

    // handle foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('' + remoteMessage?.notification?.body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  const getCorrectStack = () => {
    return <AppNavigation isLoggedIn={isLoggedIn} />;
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
