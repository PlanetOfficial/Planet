import {EndPointsURL} from './APIConstants';
import {Genre} from '../interfaces/types';

export const getGenres = async (): Promise<Genre[] | null> => {
  const response = await fetch(EndPointsURL + '/genre', {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: Genre[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};
