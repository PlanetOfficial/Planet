import EncryptedStorage from 'react-native-encrypted-storage';
import {PoiAPIURL} from './APIConstants';
import {Poi} from '../types';

export const getBookmarks = async (): Promise<Poi[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

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

export const bookmark = async (poi: Poi): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    PoiAPIURL + `/bookmark/${poi.id}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
