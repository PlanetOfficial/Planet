import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUserInfo} from '../api/authAPI';

// caches: auth_token, user_id, name
const cacheStorage = async (authToken: any) => {
  const response = await getUserInfo(authToken);
  let name = '';
  if (response?.name) {
    name = response.name;
  }

  if (response?.id) {
    await EncryptedStorage.setItem('user_id', response.id.toString());
  } else {
    await EncryptedStorage.setItem('user_id', '');
  }

  // set name and other info into async storage
  await AsyncStorage.setItem('name', name);
};

export const cacheUserInfo = async (authToken: any) => {
  // start with clear caches
  clearCaches();

  // set auth token into encrypted storage
  await EncryptedStorage.setItem('auth_token', authToken);

  await cacheStorage(authToken);
};

export const updateCaches = async (authToken: any) => {
  await cacheStorage(authToken);
};

export const clearCaches = async () => {
  if (await EncryptedStorage.getItem('auth_token')) {
    EncryptedStorage.removeItem('auth_token');
  }

  if (await AsyncStorage.getItem('name')) {
    AsyncStorage.removeItem('name');
  }
};
