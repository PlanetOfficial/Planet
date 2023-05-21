import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';
import { FGsAndInvites } from '../../interfaces/types';

export const getFGsAndInvites = async (): Promise<FGsAndInvites | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    FriendsURL + `/friends/groupsAndInvites?authtoken=${authToken}`,
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
