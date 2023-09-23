import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
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
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedInStack, setLoggedInStack] = useState<boolean>(false);
  const navigationRef = useRef<any>(null);

  const [screenToNavigate, setScreenToNavigate] = useState<string>('');
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
      if (remoteMessage?.notification?.body && remoteMessage?.data?.screen) {
        setScreenToNavigate(remoteMessage?.data?.screen); // store in an object instead
        setNotificationText(remoteMessage?.notification?.body);
        setTimeout(() => {
          setScreenToNavigate('');
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
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors[theme].background,
          },
        }}
        ref={navigationRef}
      >
        <AppNavigation isLoggedInStack={isLoggedInStack} />
        {notificationText !== '' ? (
          <Notification
            message={notificationText}
            onPress={() => {
              // TODO: navigate to the correct screen
              let screenName = 'Notifications';
              if (screenToNavigate === 'FRIEND_REQUESTS') {
                screenName = 'Requests';
                // TODO: update friends context, make this logic modular
              } else if (screenToNavigate === 'FRIENDS') {
                screenName = 'Friends';
                // TODO: update friends context
              }
              navigationRef.current?.navigate(screenName);
              setNotificationText('');
            }}
          />
        ) : null}
      </NavigationContainer>
    );
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
