import {EndPointsURL} from '../APIConstants';
import {Place} from '../../interfaces/types';

export const getBookmarks = async (authToken: string): Promise<Place[]> => {
  const response = await fetch(
    EndPointsURL + `/places?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Place[] = await response.json();
    return myJson;
  } else {
    return [];
  }
};
