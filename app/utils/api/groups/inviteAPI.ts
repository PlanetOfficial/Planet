import EncryptedStorage from 'react-native-encrypted-storage';
import {GroupURL} from '../APIConstants';
import {Invite} from '../../interfaces/types';

export const getInvites = async (): Promise<Invite[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL + `/invite?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Invite[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const acceptInvite = async (invite_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL +
      `/invite/accept?invite_id=${invite_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const rejectInvite = async (invite_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL +
      `/invite/reject?invite_id=${invite_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
