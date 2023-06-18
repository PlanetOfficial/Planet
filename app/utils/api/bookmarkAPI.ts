import EncryptedStorage from 'react-native-encrypted-storage';
import {PoiAPIURL} from './APIConstants';
import {Poi} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getBookmarks = async (): Promise<Poi[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(PoiAPIURL + `/bookmark?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: Poi[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const bookmark = async (poi: Poi): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    PoiAPIURL + `/bookmark/${poi.id}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
