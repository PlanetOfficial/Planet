import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

export const leaveGroup = async (group_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL +
      `/friends/leaveGroup?group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
