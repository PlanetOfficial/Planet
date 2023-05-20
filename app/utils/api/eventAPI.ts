import EncryptedStorage from 'react-native-encrypted-storage';
import {EndPointsURL} from './APIConstants';
import {Event} from '../interfaces/types';

export const getEvents = async (): Promise<Event[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL + `/event?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Event[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const postEvent = async (
  name: string,
  place_ids: number[],
  date: string,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL +
      `/event?name=${name}&date=${date}&place_ids=${JSON.stringify(
        place_ids,
      )}&authToken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const editEvent = async (
  name: string,
  date: string,
  place_ids: number[],
  event_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL +
      `/event/${event_id}?name=${name}&date=${date}&place_ids=${JSON.stringify(
        place_ids,
      )}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const deleteEvent = async (event_id: number): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    EndPointsURL + `/event/${event_id}?authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};
