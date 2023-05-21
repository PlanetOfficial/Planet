import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

export const removeEvent = async (group_event_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL +
      `/friends/removeEvent?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
