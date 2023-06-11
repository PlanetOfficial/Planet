import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';

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
      `/event?poi_ids=${JSON.stringify(
        poi_ids,
      )}&names=${JSON.stringify(names)}&name=${name}&datetime=${datetime}&members=${JSON.stringify(
        members,
      )}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
