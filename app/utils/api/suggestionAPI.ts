import EncryptedStorage from 'react-native-encrypted-storage';
import {EventAPIURL} from './APIConstants';

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
