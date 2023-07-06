import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {Event, EventDetail} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getEvents = async (): Promise<Event[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(EventAPIURL + `/event`, {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    }
  });

  if (response?.ok) {
    const myJson: Event[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getEvent = async (id: number): Promise<EventDetail | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    EventAPIURL + `/event/${id}`,
    {
      method: 'GET',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      }
    },
  );

  if (response?.ok) {
    const myJson: EventDetail = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postEvent = async (
  poi_ids: number[],
  names: string[],
  name: string,
  datetime: string,
  members: number[],
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    EventAPIURL +
      `/event`,
    {
      method: 'POST',
      body: JSON.stringify({poi_ids, names, name, datetime, members}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const editName = async (
  event_id: number,
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    EventAPIURL +
      `/event/name`,
    {
      method: 'POST',
      body: JSON.stringify({event_id, name}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const editDatetime = async (
  event_id: number,
  datetime: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    EventAPIURL +
      `/event/datetime`,
    {
      method: 'POST',
      body: JSON.stringify({event_id, datetime}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const leaveEvent = async (event_id: number): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    EventAPIURL + `/member`,
    {
      method: 'DELETE',
      body: JSON.stringify({event_id}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const inviteToEvent = async (
  event_id: number,
  user_ids: number[],
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    EventAPIURL +
      `/member`,
    {
      method: 'POST',
      body: JSON.stringify({event_id, user_ids}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};
