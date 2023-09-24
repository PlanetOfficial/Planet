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
import { FriendsStateProvider, useFriendsContext } from './app/context/FriendsContext';
import { BookmarkStateProvider } from './app/context/BookmarkContext';
import { LocationStateProvider } from './app/context/LocationContext';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedInStack, setLoggedInStack] = useState<boolean>(false);
  const navigationRef = useRef<any>(null);

  type ScreenName = 'Friends' | 'Requests' | 'Notifications' | '';
  const [foregroundNotificationData, setForegroundNotificationData] = useState<{screenName: ScreenName, notificationText: string}>({screenName: '', notificationText: ''});

  const theme = useColorScheme() || 'light';

  const getScreenName = (screenToNavigate: string): ScreenName => {
    switch (screenToNavigate) {
      case 'FRIENDS':
        return 'Friends';
      case 'USER_PROFILE':
        return 'Requests';
      default:
        return 'Notifications';
    }
  }

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

    // do not continue execution and setup listeners until app is loaded
    if (isLoading) {
      return;
    }

    // handle push notifications from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.screen) {
        navigationRef.current?.navigate(getScreenName(remoteMessage.data.screen));
      }
    });
    
    // handle push notifications from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen) {
          navigationRef.current?.navigate(getScreenName(remoteMessage.data.screen));
        }
      });

    // handle foreground notifications
    messaging().onMessage(remoteMessage => {
      if (remoteMessage?.notification?.body && remoteMessage?.data?.screen) {
        setForegroundNotificationData({screenName: getScreenName(remoteMessage.data.screen), notificationText: remoteMessage.notification.body})
        setTimeout(() => {
          setForegroundNotificationData({screenName: '', notificationText: ''});
        }, 5000);
      }
    });
  }, [theme, isLoading]);

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

  const AppBody = () => {
    const {refreshFriends} = useFriendsContext();

    return (
      <>
        <AppNavigation isLoggedInStack={isLoggedInStack} />
        {foregroundNotificationData.notificationText !== '' && foregroundNotificationData.screenName !== '' ? (
          <Notification
            message={foregroundNotificationData.notificationText}
            onPress={() => {
              if (foregroundNotificationData.screenName === 'Friends' || foregroundNotificationData.screenName === 'Requests') {
                refreshFriends();
              }

              navigationRef.current?.navigate(foregroundNotificationData.screenName);
              setForegroundNotificationData({screenName: '', notificationText: ''});
            }}
          />
        ) : null}
      </>
    );
  };

  return isLoading ? <SplashScreen /> : (
    <FriendsStateProvider isLoggedInStack={isLoggedInStack}>
      <BookmarkStateProvider isLoggedInStack={isLoggedInStack}>
        <LocationStateProvider isLoggedInStack={isLoggedInStack}>
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
            <AppBody />
          </NavigationContainer>
        </LocationStateProvider>
      </BookmarkStateProvider>
    </FriendsStateProvider>
  );
}
