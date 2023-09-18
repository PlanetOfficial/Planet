import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import SplashScreen from './app/ui/otherScreens/splashScreen/SplashScreen';
import AppNavigation from './app/ui/navigations/AppNavigation';
import {cacheCategories, updateCaches} from './app/utils/CacheHelpers';
import {saveTokenToDatabase} from './app/utils/api/authAPI';
import Notification from './app/ui/components/Notification';
import colors from './app/constants/colors';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedInStack, setLoggedInStack] = useState<boolean>(false);

  const [notificationText, setNotificationText] = useState<string>('');

  const theme = useColorScheme() || 'light';

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
      // android specific ui configurations
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors[theme].background);
        SystemNavigationBar.setNavigationColor(
          colors[theme].background,
          colors[theme].androidNavigationBarStyle,
        );
      }

      const token = await EncryptedStorage.getItem('auth_token');

      try {
        if (token) {
          setLoggedInStack(true);
          await updateCaches(token);
        } else {
          setLoggedInStack(false);
        }

        await cacheCategories();
      } catch (err) {
        console.warn(err);
        setLoggedInStack(false);
      }

      setLoading(false);
      requestNotificationPerms();
    };

    initialize();

    // handle foreground notifications
    const unsubscribe = messaging().onMessage(remoteMessage => {
      if (remoteMessage?.notification?.body) {
        setNotificationText(remoteMessage?.notification?.body);
        setTimeout(() => {
          setNotificationText('');
        }, 5000);
      }
    });

    return unsubscribe;
  }, [theme]);

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
        <AppNavigation isLoggedInStack={isLoggedInStack} />
        {notificationText !== '' ? (
          <Notification
            message={notificationText}
            onPress={() => {
              // TODO: navigate to the correct screen
            }}
          />
        ) : null}
      </>
    );
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
