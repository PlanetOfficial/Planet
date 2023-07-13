import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {Spin} from '../types';
import {refreshAuthtoken} from './authAPI';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postSuggestion = async (
  event_id: number,
  destination_id: number,
  poi_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/suggestion', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_id, poi_id}),
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
export const removeSuggestion = async (
  event_id: number,
  destination_id: number,
  poi_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/suggestion', {
      method: 'DELETE',
      body: JSON.stringify({event_id, destination_id, poi_id}),
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
export const makePrimary = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/suggestion/primary', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_id, suggestion_id}),
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
export const spinRoulette = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Spin | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/suggestion/spin', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_id, suggestion_id}),
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

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const vote = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(EventAPIURL + '/suggestion/vote', {
      method: 'POST',
      body: JSON.stringify({event_id, destination_id, suggestion_id}),
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
