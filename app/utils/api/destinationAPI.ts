import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';

export const postDestination = async (
  event_id: number,
  poi_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/destination?event_id=${event_id}&poi_id=${poi_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const renameDestination = async (
  event_id: number,
  destination_id: number,
  name: string,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/destination/name?event_id=${event_id}&destination_id=${destination_id}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const removeDestination = async (
  event_id: number,
  destination_id: number,
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/destination?event_id=${event_id}&destination_id=${destination_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response.ok;
};

export const reorderDestinations = async (
  event_id: number,
  destination_ids: number[],
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EventAPIURL +
      `/destination/order?event_id=${event_id}&destination_ids=${JSON.stringify(
        destination_ids,
      )}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
