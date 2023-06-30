import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendAPIURL} from './APIConstants';
import {UserDetail, UserInfo} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriend = async (id: number): Promise<UserDetail | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    FriendAPIURL + `/friend/${id}?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: UserDetail = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriends = async () => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    FriendAPIURL + `/friends?authtoken=${authToken}`,
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

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postFriendRequest = async (id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    FriendAPIURL + `/request?requestee=${id}&authtoken=${authToken}`,
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
    FriendAPIURL + `/request?requestee=${id}&authtoken=${authToken}`,
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
    FriendAPIURL + `/request/accept?requester=${id}&authtoken=${authToken}`,
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
    FriendAPIURL + `/request/reject?requester=${id}&authtoken=${authToken}`,
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
    FriendAPIURL + `/friend?friend=${id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getSuggestions = async (): Promise<UserInfo[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    FriendAPIURL + `/suggestion?authtoken=${authToken}`,
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

export const searchUsers = async (text: string): Promise<UserInfo[] | null> => {
  const response = await fetch(FriendAPIURL + `/search?query=${text}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: UserInfo[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};
