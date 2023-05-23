import {EndPointsURL} from './APIConstants';
import {Category, Genre} from '../interfaces/types';

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

export const getLiveCategories = async (): Promise<Category[] | null> => {
  const response = await fetch(EndPointsURL + '/genre?live=true', {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: Category[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};
