import EncryptedStorage from 'react-native-encrypted-storage';
import {EndPointsURL} from './APIConstants';
import {Place} from '../interfaces/types';

export const getBookmarks = async (): Promise<Place[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(EndPointsURL + `/place?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: Place[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const postBookmark = async (placeId: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL + `/place/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const deleteBookmark = async (placeId: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL + `/place/${placeId}?authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};
