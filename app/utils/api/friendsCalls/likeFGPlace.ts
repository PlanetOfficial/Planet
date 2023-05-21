import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

export const likeFGPlace = async (
  group_event_place_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');
  const response = await fetch(
    FriendsURL +
      `/friends/likePlace?group_event_place_id=${group_event_place_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
