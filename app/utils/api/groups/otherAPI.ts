import EncryptedStorage from 'react-native-encrypted-storage';
import {GroupURL} from '../APIConstants';

export const postAlternative = async (
  place_id: number,
  group_destination_id: number,
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  const response = await fetch(
    GroupURL +
      `/alternative?place_id=${place_id}&group_destination_id=${group_destination_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
