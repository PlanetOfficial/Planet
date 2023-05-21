import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendsURL} from '../APIConstants';

export const createGroup = async (
  name: String,
  invitee_emails: Array<String>,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    FriendsURL +
      `/friends/createGroup?${emails_string}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
