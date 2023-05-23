import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';
import {Place} from '../../interfaces/types';

export const getFGEventPlaces = async (
  group_event_id: number,
): Promise<Place[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL +
      `/friends/fgEventPlaces?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};
