import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

import SplashScreen from './app/ui/otherScreens/splashScreen/SplashScreen';
import AppNavigation from './app/ui/navigations/AppNavigation';
import {cacheCategories, updateCaches} from './app/utils/CacheHelpers';
import {saveTokenToDatabase} from './app/utils/api/authAPI';
import Notification from './app/ui/components/Notification';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  const [notificationText, setNotificationText] = useState<string>('');

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

      try {
        if (token) {
          setLoggedIn(true);
          await updateCaches(token);
        } else {
          setLoggedIn(false);
        }

        await cacheCategories();
      } catch (err) {
        console.warn(err);
        setLoggedIn(false);
      }

      setLoading(false);
      requestNotificationPerms();
    };

    initialize();

    // handle foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.notification?.body) {
        setNotificationText(remoteMessage?.notification?.body);
        setTimeout(() => {
          setNotificationText('');
        }, 5000);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      })
      .catch(err => {
        console.warn(err);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  const getCorrectStack = () => {
    return (
      <>
        {notificationText !== '' ? 
          <Notification
            message={notificationText}
            onPress={() => {}} 
          /> : null}
        <AppNavigation isLoggedIn={isLoggedIn} />
      </>
    );
    
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
