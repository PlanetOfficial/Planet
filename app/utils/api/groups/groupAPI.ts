import EncryptedStorage from 'react-native-encrypted-storage';
import {GroupURL} from '../APIConstants';
import { FriendGroup } from '../../interfaces/types';

export const postGroup = async (
  name: string,
  invitee_emails: string[],
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    GroupURL +
      `/group?${emails_string}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const getGroups = async (): Promise<FriendGroup[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL + `/group?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson : FriendGroup[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const leaveGroup = async (group_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL +
      `/group?group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};

export const editGroup = async (
  name: string,
  invitee_emails: string[],
  id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    GroupURL +
      `/group/${id}?${emails_string}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
