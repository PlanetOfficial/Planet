import React, {useEffect, useState} from 'react';
import UnloggedNavigation from './app/components/UnloggedNavigation';
import LoggedNavigation from './app/components/LoggedNavigation';
import SplashScreen from './app/components/SplashScreen';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const token = await EncryptedStorage.getItem('auth_token');
      setLoading(false);
      token ? setLoggedIn(true) : setLoggedIn(false);
    };

    initialize();
  }, []);

  const getCorrectStack = () => {
    return isLoggedIn ? <LoggedNavigation /> : <UnloggedNavigation />;
  };

  return isLoading ? <SplashScreen /> : getCorrectStack();
}
