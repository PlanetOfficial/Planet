import {PoiAPIURL} from './APIConstants';
import {Category, Poi, PoiDetail} from '../types';

export const getPois = async (
  category: Category,
  radius: number,
  latitude: number,
  longitude: number,
  filters?: {[key: string]: string | string[]},
): Promise<Poi[] | null> => {
  // round latitude and longitude to nearest ~100m ish so that we get similar results between calls,
  // which minimizes calls to google
  latitude = Math.round(latitude * 1000) / 1000;
  longitude = Math.round(longitude * 1000) / 1000;

  const response = await fetch(
    PoiAPIURL +
      `/poi?category=${JSON.stringify(
        category,
      )}&radius=${radius}&latitude=${latitude}&longitude=${longitude}&filters=${JSON.stringify(
        filters,
      )}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Poi[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const getPoi = async (
  place_id: string,
  supplier: string,
): Promise<PoiDetail | null> => {
  const response = await fetch(
    PoiAPIURL + `/poi/${place_id}?supplier=${supplier}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const postPoi = async (
  place_id: string,
): Promise<{poi: Poi; poiDetail: PoiDetail} | null> => {
  const response = await fetch(PoiAPIURL + '/poi', {
    method: 'POST',
    body: JSON.stringify({place_id}),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};
