import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendAPIURL} from './APIConstants';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postFG = async (
  user_ids: number[],
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    FriendAPIURL +
      `/group?user_ids=${JSON.stringify(
        user_ids,
      )}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const editFG = async (
  id: number,
  user_ids: number[],
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    FriendAPIURL +
      `/group/${id}?user_ids=${JSON.stringify(
        user_ids,
      )}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const deleteFG = async (id: number): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    FriendAPIURL + `/group/${id}?authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response.ok;
};
