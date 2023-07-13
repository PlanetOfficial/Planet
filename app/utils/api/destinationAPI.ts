import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {refreshAuthtoken} from './authAPI';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postDestination = async (
  event_id: number,
  poi_id: number,
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/destination', {
      method: 'POST',
      body: JSON.stringify({event_id, poi_id, name}),
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
      await EncryptedStorage.setItem('auth_token', authToken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const renameDestination = async (
  event_id: number,
  destination_id: number,
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/destination/name', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_id, name}),
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
      await EncryptedStorage.setItem('auth_token', authToken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const removeDestination = async (
  event_id: number,
  destination_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/destination', {
      method: 'DELETE',
      body: JSON.stringify({event_id, destination_id}),
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
      await EncryptedStorage.setItem('auth_token', authToken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const reorderDestinations = async (
  event_id: number,
  destination_ids: number[],
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/destination/order', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_ids}),
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
      await EncryptedStorage.setItem('auth_token', authToken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};
