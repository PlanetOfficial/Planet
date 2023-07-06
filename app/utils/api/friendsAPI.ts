import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendAPIURL} from './APIConstants';
import {FriendGroup, UserDetail, UserInfo} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getFriend = async (id: number): Promise<UserDetail | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(FriendAPIURL + `/friend/${id}`, {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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
export const getFriendsInfo = async (): Promise<{
  suggestions: UserInfo[];
  requests: UserInfo[];
  requests_sent: UserInfo[];
  friends: UserInfo[];
  friendgroups: FriendGroup[];
} | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(FriendAPIURL + '/friends', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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
export const getFriends = async (): Promise<{
  friends: UserInfo[];
  friendgroups: FriendGroup[];
} | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(FriendAPIURL + '/friend', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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
export const getFriendRequests = async (): Promise<{
  requests: UserInfo[];
  requests_sent: UserInfo[];
} | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(FriendAPIURL + '/request', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/request', {
    method: 'POST',
    body: JSON.stringify({requestee: id}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/request', {
    method: 'DELETE',
    body: JSON.stringify({requestee: id}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/request/accept', {
    method: 'POST',
    body: JSON.stringify({requester: id}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/request/reject', {
    method: 'DELETE',
    body: JSON.stringify({requester: id}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/friend', {
    method: 'DELETE',
    body: JSON.stringify({friend: id}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const response = await fetch(FriendAPIURL + '/suggestion', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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
