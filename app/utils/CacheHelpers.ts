import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

import {getUserInfo} from './api/authAPI';
import {getCategories} from './api/poiAPI';

/*
 * Data we cache:
 * - auth_token
 * - user_id
 * - display_name
 * - username
 * - phone_number
 * - age
 * - gender
 * - pfp_url
 *
 * - categories
 */

// caches categories
export const cacheCategories = async () => {
  const response = await getCategories();

  if (response?.ok) {
    await AsyncStorage.setItem('genres', JSON.stringify(await response.json()));
  } else {
    console.warn('Failed to cache categories');
  }
};

export const cacheUserInfo = async (authToken: string) => {
  // start with clear caches (for user storage)
  await clearCaches();

  // set auth token into encrypted storage
  await EncryptedStorage.setItem('auth_token', authToken);

  // stores other info
  return await cacheStorage(authToken);
};

export const updateCaches = async (authToken: string) => {
  await cacheStorage(authToken);
};

export const clearCaches = async () => {
  if (await EncryptedStorage.getItem('auth_token')) {
    await EncryptedStorage.removeItem('auth_token');
  }

  if (await EncryptedStorage.getItem('user_id')) {
    await EncryptedStorage.removeItem('user_id');
  }

  if (await AsyncStorage.getItem('display_name')) {
    AsyncStorage.removeItem('display_name');
  }

  if (await AsyncStorage.getItem('username')) {
    AsyncStorage.removeItem('username');
  }

  if (await AsyncStorage.getItem('phone_number')) {
    AsyncStorage.removeItem('phone_number');
  }

  if (await AsyncStorage.getItem('birthday')) {
    AsyncStorage.removeItem('birthday');
  }

  if (await AsyncStorage.getItem('pfp_url')) {
    AsyncStorage.removeItem('pfp_url');
  }
};

const cacheStorage = async (authToken: string) => {
  const response = await getUserInfo(authToken);

  if (response === undefined) {
    return false;
  }

  await EncryptedStorage.setItem('user_id', response.id.toString());

  // set name and other info into async storage
  await AsyncStorage.setItem('display_name', response.display_name);
  await AsyncStorage.setItem('username', response.username);
  await AsyncStorage.setItem('phone_number', response.phone_number);
  await AsyncStorage.setItem('birthday', response.birthday);

  if (response?.icon?.url) {
    await AsyncStorage.setItem('pfp_url', response.icon.url);
  }

  return true;
};
