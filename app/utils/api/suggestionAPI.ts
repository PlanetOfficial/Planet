import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {Spin} from '../types';

export const postSuggestion = async (
  event_id: number,
  destination_id: number,
  poi_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/suggestion?event_id=${event_id}&destination_id=${destination_id}&poi_id=${poi_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const removeSuggestion = async (
  event_id: number,
  destination_id: number,
  poi_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/suggestion?event_id=${event_id}&destination_id=${destination_id}&poi_id=${poi_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response.ok;
};

export const makePrimary = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/suggestion/primary?event_id=${event_id}&destination_id=${destination_id}&suggestion_id=${suggestion_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const spinRoulette = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Spin | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

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

export const vote = async (
  event_id: number,
  destination_id: number,
  suggestion_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/suggestion/vote?event_id=${event_id}&destination_id=${destination_id}&suggestion_id=${suggestion_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
