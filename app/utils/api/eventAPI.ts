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

  const response = await fetch(EventAPIURL + `/event?authtoken=${authToken}`, {
    method: 'GET',
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
    EventAPIURL + `/event/${id}?authtoken=${authToken}`,
    {
      method: 'GET',
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
      `/event?poi_ids=${JSON.stringify(poi_ids)}&names=${JSON.stringify(
        names,
      )}&name=${name}&datetime=${datetime}&members=${JSON.stringify(
        members,
      )}&authtoken=${authToken}`,
    {
      method: 'POST',
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
      `/event/name?event_id=${event_id}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
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
      `/event/datetime?event_id=${event_id}&datetime=${datetime}&authtoken=${authToken}`,
    {
      method: 'POST',
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
    EventAPIURL + `/member?event_id=${event_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
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
      `/member?event_id=${event_id}&user_ids=${JSON.stringify(
        user_ids,
      )}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
