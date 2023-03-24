import React, {useEffect, useState} from 'react';
import SplashScreen from './app/components/SplashScreen';
import EncryptedStorage from 'react-native-encrypted-storage';
import AppNavigation from './app/navigation/AppNavigation';
import {updateAsyncStorage} from './app/utils/functions/CacheHelpers';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const token = await EncryptedStorage.getItem('auth_token');

      if (token) {
        setLoggedIn(true);
        await updateAsyncStorage(token);
      } else {
        setLoggedIn(false);
      }

      setLoading(false);
    };

    initialize();
  }, []);

  const getCorrectStack = () => {
    return <AppNavigation isLoggedIn={isLoggedIn} />;
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
