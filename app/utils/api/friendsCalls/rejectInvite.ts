import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

export const rejectInvite = async (invite_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL +
      `/friends/rejectInvite?invite_id=${invite_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
