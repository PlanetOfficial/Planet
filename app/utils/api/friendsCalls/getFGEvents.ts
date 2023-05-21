import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';
import {Event} from '../../interfaces/types';

export const getFGEvents = async (
  group_id: number,
): Promise<Event[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL +
      `/friends/fgEvents?group_id=${group_id}&authtoken=${authToken}`,
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
