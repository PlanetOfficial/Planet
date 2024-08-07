import {PoiAPIURL, XanoAPIKey} from './APIConstants';

import numbers from '../../constants/numbers';

import {Category, GoogleAutocompleteResult, Poi, PoiDetail} from '../types';

import EncryptedStorage from 'react-native-encrypted-storage';
import {requestAndValidate} from './authAPI';

export const getPois = async (
  category: Category,
  latitude: number,
  longitude: number,
  filters?: {[key: string]: string | string[]},
): Promise<Poi[] | null> => {
  // rounding the latitude and longitude for caching purposes
  // note that by adding half of the offset, we round the values to nearest multiple of locationOffThreshold instead of truncating
  const offset = numbers.locationOffThreshold * 2;
  latitude =
    Math.floor(latitude / offset) * offset + numbers.locationOffThreshold;
  longitude =
    Math.floor(longitude / offset) * offset + numbers.locationOffThreshold;

  const shouldResetAPICache =
    (filters && filters['Open Now']) || category.is_live_category;
  const response = await fetch(
    PoiAPIURL +
      `/poi?category=${JSON.stringify(category)}&latitude=${latitude.toFixed(
        5,
      )}&longitude=${longitude.toFixed(5)}&filters=${JSON.stringify(filters)}` +
      (shouldResetAPICache ? `&time=${new Date()}` : ''),
    {
      method: 'GET',
      headers: {
        Authorization: XanoAPIKey,
      },
    },
  );

  if (response?.ok) {
    const myJson: Poi[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getPoi = async (
  place_id: string,
  supplier: string,
): Promise<PoiDetail | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      PoiAPIURL + `/poi/${place_id}?supplier=${supplier}`,
      {
        method: 'GET',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  const response = await requestAndValidate(authToken, request);

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
      Authorization: XanoAPIKey,
    },
  });

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const getCategories = async (): Promise<Response> => {
  const response = await fetch(PoiAPIURL + '/category', {
    method: 'GET',
    headers: {
      Authorization: XanoAPIKey,
    },
  });

  return response;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getSuggestedPoiSections = async (
  latitude: number,
  longitude: number,
): Promise<{[key: string]: Poi[]} | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      PoiAPIURL + `/poiSections?latitude=${latitude}&longitude=${longitude}`,
      {
        method: 'GET',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  const response = await requestAndValidate(authToken, request);

  if (response?.ok) {
    const myJson: {[key: string]: Poi[]} = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const autocompleteSearch = async (
  query: string,
  latitude: number,
  longitude: number,
): Promise<(Category | GoogleAutocompleteResult)[] | null> => {
  const response = await fetch(
    PoiAPIURL +
      `/autocomplete/search?query=${query}&latitude=${latitude}&longitude=${longitude}`,
    {
      method: 'GET',
      headers: {
        Authorization: XanoAPIKey,
      },
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const autocompleteLocality = async (
  query: string,
  latitude: number,
  longitude: number,
): Promise<GoogleAutocompleteResult[] | null> => {
  const response = await fetch(
    PoiAPIURL +
      `/autocomplete/locality?query=${query}&latitude=${latitude}&longitude=${longitude}`,
    {
      method: 'GET',
      headers: {
        Authorization: XanoAPIKey,
      },
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};

export const autocompleteLocalityLatLng = async (
  place_id: string,
): Promise<{
  lat: number;
  lng: number;
} | null> => {
  const response = await fetch(
    PoiAPIURL + `/autocomplete/localityLatLng?place_id=${place_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: XanoAPIKey,
      },
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return null;
  }
};
