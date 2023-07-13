import EncryptedStorage from 'react-native-encrypted-storage';
import {FriendAPIURL} from './APIConstants';
import {refreshAuthtoken} from './authAPI';

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

  const request = async (authtoken: string) => {
    const response = await fetch(FriendAPIURL + '/group', {
      method: 'POST',
      body: JSON.stringify({user_ids, name}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      response = await request(refreshedAuthtoken);
    }
  }

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

  const request = async (authtoken: string) => {
    const response = await fetch(FriendAPIURL + `/group/${id}`, {
      method: 'POST',
      body: JSON.stringify({user_ids, name}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      response = await request(refreshedAuthtoken);
    }
  }

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

  const request = async (authtoken: string) => {
    const response = await fetch(FriendAPIURL + `/group/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const reorderFG = async (fg_ids: number[]): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(FriendAPIURL + '/groups/reorder', {
      method: 'POST',
      body: JSON.stringify({friend_group_ids: fg_ids}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};
