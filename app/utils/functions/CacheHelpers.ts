import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUserInfo} from '../api/authAPI';
import {PoiAPIURL} from '../api/APIConstants';

// caches: auth_token, user_id, name
const cacheStorage = async (authToken: string) => {
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

export const cacheCategories = async () => {
  const response = await fetch(PoiAPIURL + '/category', {
    method: 'GET',
  });

  if (response?.ok) {
    await AsyncStorage.setItem('genres', JSON.stringify(await response.json()));
  } else {
    console.warn('Failed to cache categories');
  }
};

export const cacheUserInfo = async (authToken: string) => {
  // start with clear caches
  clearCaches();

  // set auth token into encrypted storage
  await EncryptedStorage.setItem('auth_token', authToken);

  await cacheStorage(authToken);
};

export const updateCaches = async (authToken: string) => {
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
