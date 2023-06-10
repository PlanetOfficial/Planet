import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUserInfo} from './api/authAPI';
import {PoiAPIURL} from './api/APIConstants';

/*
 * Data we cache:
 * - auth_token
 * - user_id
 * - first_name
 * - last_name
 * - username
 * - categories
 */

// caches categories
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

// caches auth_token, user_id, first_name, last_name, and username
export const cacheUserInfo = async (authToken: string) => {
  // start with clear caches (for user storage)
  clearCaches();

  // set auth token into encrypted storage
  await EncryptedStorage.setItem('auth_token', authToken);

  // stores the rest
  return await cacheStorage(authToken);
};

export const updateCaches = async (authToken: string) => {
  await cacheStorage(authToken);
};

// clears auth_token, user_id, first_name, last_name, and username from cache
export const clearCaches = async () => {
  if (await EncryptedStorage.getItem('auth_token')) {
    await EncryptedStorage.removeItem('auth_token');
  }

  if (await EncryptedStorage.getItem('user_id')) {
    await EncryptedStorage.removeItem('user_id');
  }

  if (await AsyncStorage.getItem('first_name')) {
    AsyncStorage.removeItem('first_name');
  }

  if (await AsyncStorage.getItem('last_name')) {
    AsyncStorage.removeItem('last_name');
  }

  if (await AsyncStorage.getItem('username')) {
    AsyncStorage.removeItem('username');
  }
};

const cacheStorage = async (authToken: string) => {
  const response = await getUserInfo(authToken);

  if (response === undefined) {
    return false;
  }

  await EncryptedStorage.setItem('user_id', response.id.toString());

  // set name and other info into async storage
  await AsyncStorage.setItem('first_name', response.first_name);
  await AsyncStorage.setItem('last_name', response.last_name);
  await AsyncStorage.setItem('username', response.username);

  return true;
};
