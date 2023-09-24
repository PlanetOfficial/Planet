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
import {cacheCategories, updateCaches} from './app/utils/CacheHelpers';
import {saveTokenToDatabase} from './app/utils/api/authAPI';
import colors from './app/constants/colors';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {FriendsStateProvider} from './app/context/FriendsContext';
import {BookmarkStateProvider} from './app/context/BookmarkContext';
import {LocationStateProvider} from './app/context/LocationContext';
import {ForegroundNotificationData, ScreenName} from './app/utils/types';
import AppBody from './app/ui/AppBody';

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoggedInStack, setLoggedInStack] = useState<boolean>(false);
  const navigationRef = useRef<any>(null);

  const [foregroundNotificationData, setForegroundNotificationData] =
    useState<ForegroundNotificationData>({
      screenName: '',
      notificationText: '',
    });

  const theme = useColorScheme() || 'light';

  // converts from backend string to frontend
  const getScreenName = (screenToNavigate: string): ScreenName => {
    switch (screenToNavigate) {
      case 'FRIENDS':
        return 'Friends';
      case 'USER_PROFILE':
        return 'Requests';
      case 'EVENT':
        return 'Notifications';
      default:
        return '';
    }
  };

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
        navigationRef.current?.navigate(
          getScreenName(remoteMessage.data.screen),
        );
      }
    });

    // handle push notifications from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen) {
          navigationRef.current?.navigate(
            getScreenName(remoteMessage.data.screen),
          );
        }
      });

    // handle foreground notifications
    messaging().onMessage(remoteMessage => {
      if (remoteMessage?.notification?.body && remoteMessage?.data?.screen) {
        setForegroundNotificationData({
          screenName: getScreenName(remoteMessage.data.screen),
          notificationText: remoteMessage.notification.body,
        });
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

  return isLoading ? (
    <SplashScreen />
  ) : (
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
            ref={navigationRef}>
            <AppBody
              isLoggedInStack={isLoggedInStack}
              foregroundNotificationData={foregroundNotificationData}
              setForegroundNotificationData={setForegroundNotificationData}
              navigationRef={navigationRef}
            />
          </NavigationContainer>
        </LocationStateProvider>
      </BookmarkStateProvider>
    </FriendsStateProvider>
  );
}
