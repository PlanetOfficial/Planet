import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

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
    FriendsURL +
      `/friends/editGroup?${emails_string}&name=${name}&group_id=${id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
