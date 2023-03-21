import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUserInfo} from '../api/auth/getUserInfo';

export const cacheUserInfo = async (authToken: any) => {
  // start with clear caches
  clearCaches();

  // set auth token into encrypted storage
  await EncryptedStorage.setItem('auth_token', authToken);

  const response = await getUserInfo(authToken);
  let name = '';
  if (response?.name) {
    name = response.name;
  }

  // // set name and other info into async storage
  await AsyncStorage.setItem('name', name);
};

export const clearCaches = async () => {
  if (await EncryptedStorage.getItem('auth_token')) {
    EncryptedStorage.removeItem('auth_token');
  }

  if (await AsyncStorage.getItem('name')) {
    AsyncStorage.removeItem('name');
  }
};
