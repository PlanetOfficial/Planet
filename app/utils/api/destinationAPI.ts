import {EndPointsURL} from './APIConstants';
import {Place, PlaceDetail} from '../interfaces/types';

export const getDestinations = async (
  category_id: number,
  radius: number,
  latitude: number,
  longitude: number,
  filters: any,
  subcategory_id?: number,
): Promise<Place[] | null> => {
  const response = await fetch(
    EndPointsURL +
      `/destination?category_id=${category_id}radius=${radius}&latitude=${latitude}&longitude=${longitude}&filters:${JSON.stringify(
        filters,
      )}&subcategory_id=${subcategory_id}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Place[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const getDestination = async (
  placeId: string,
): Promise<PlaceDetail | null> => {
  const response = await fetch(EndPointsURL + `/destination/${placeId}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson: PlaceDetail = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const postDestination = async (
  name: String,
  latitude: number,
  longitude: number,
  details: any,
): Promise<Place | null> => {
  const response = await fetch(
    EndPointsURL +
      `/destination?name=${name}&latitude=${latitude}&longitude=${longitude}&details=${JSON.stringify(details)}`,
    {
      method: 'POST',
    },
  );

  if (response?.ok) {
    const myJson: Place = await response.json();
    return myJson;
  } else {
    return null;
  }
};
