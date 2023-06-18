import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {Spin} from '../types';

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

  const response = await fetch(
    EventAPIURL +
      `/suggestion?event_id=${event_id}&destination_id=${destination_id}&poi_id=${poi_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

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

  const response = await fetch(
    EventAPIURL +
      `/suggestion?event_id=${event_id}&destination_id=${destination_id}&poi_id=${poi_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

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

  const response = await fetch(
    EventAPIURL +
      `/suggestion/primary?event_id=${event_id}&destination_id=${destination_id}&suggestion_id=${suggestion_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

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

  const response = await fetch(
    EventAPIURL +
      `/suggestion/spin?event_id=${event_id}&destination_id=${destination_id}&suggestion_id=${suggestion_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

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

  const response = await fetch(
    EventAPIURL +
      `/suggestion/vote?event_id=${event_id}&destination_id=${destination_id}&suggestion_id=${suggestion_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
