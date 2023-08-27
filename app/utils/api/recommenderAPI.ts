import {RecommenderAPIURL} from './APIConstants';
import {Recommendation} from '../types';
import EncryptedStorage from 'react-native-encrypted-storage';
import {requestAndValidate} from './authAPI';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getRecommendations = async (
  latitude: number,
  longitude: number,
): Promise<Recommendation[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      RecommenderAPIURL +
        `/recommendation?latitude=${latitude}&longitude=${longitude}`,
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
