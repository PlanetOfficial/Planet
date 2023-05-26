import EncryptedStorage from 'react-native-encrypted-storage';
import {GroupURL} from '../APIConstants';
import {GroupEvent, GroupPlace} from '../../interfaces/types';

export const getGroupEvents = async (
  group_id: number,
): Promise<GroupEvent[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL + `/event?group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: GroupEvent[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const getGroupEvent = async (
  group_event_id: number,
): Promise<GroupPlace[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL + `/event/${group_event_id}?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: GroupPlace[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const postGroupEvent = async (
  user_event_id: number,
  group_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL +
      `/event?user_event_id=${user_event_id}&group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};

export const deleteGroupEvent = async (
  group_event_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL + `/event?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response?.ok;
};

export const forkGroupEvent = async (
  group_event_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');
  const response = await fetch(
    GroupURL +
      `/event/fork?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
