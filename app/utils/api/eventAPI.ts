import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';
import {Event, EventDetail} from '../types';

export const getEvents = async (): Promise<Event[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

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

export const getEvent = async (id: number): Promise<EventDetail | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

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

export const postEvent = async (
  poi_ids: number[],
  names: string[],
  name: string,
  datetime: string,
  members: number[],
): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

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
