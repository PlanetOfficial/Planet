import React, {useEffect, useState} from 'react';
import SplashScreen from './app/components/SplashScreen';
import EncryptedStorage from 'react-native-encrypted-storage';
import AppNavigation from './app/components/AppNavigation';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const token = await EncryptedStorage.getItem('auth_token');
      token ? setLoggedIn(true) : setLoggedIn(false);
      setLoading(false);
    };

    initialize();
  }, []);

  const getCorrectStack = () => {
    return <AppNavigation isLoggedIn={isLoggedIn}/> // TODO: what if token expires
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
