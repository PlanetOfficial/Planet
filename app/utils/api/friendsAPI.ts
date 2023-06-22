import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL} from './APIConstants';
import {UserInfo} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriends = async (): Promise<UserInfo[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(UserAPIURL + `/friend?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: UserInfo[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriendRequests = async (): Promise<UserInfo[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    UserAPIURL + `/friend/request?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: UserInfo[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriendRequestsSent = async (): Promise<UserInfo[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    UserAPIURL + `/friend/request/sent?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: UserInfo[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postFriendRequest = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/friend/request?requestee=${id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const deleteFriendRequest = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/friend/request?requestee=${id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const acceptFriendRequest = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/friend/accept/?requester=${id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const rejectFriendRequest = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/friend/reject/?requester=${id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const deleteFriend = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/friend?friend=${id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};
