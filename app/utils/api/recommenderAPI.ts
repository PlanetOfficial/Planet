import {RecommenderAPIURL} from './APIConstants';
import {Recommendation, RecommenderSurvey} from '../types';
import EncryptedStorage from 'react-native-encrypted-storage';
import {requestAndValidate} from './authAPI';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getRecommendations = async (
  latitude: number,
  longitude: number,
  reload: boolean,
): Promise<Recommendation[] | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      RecommenderAPIURL +
        `/recommendation?latitude=${latitude}&longitude=${longitude}` +
        (reload ? `&time=${new Date()}` : ''),
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

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getRecommenderSurvey =
  async (): Promise<RecommenderSurvey | null> => {
    const authToken = await EncryptedStorage.getItem('auth_token');

    if (!authToken) {
      return null;
    }

    const request = async (authtoken: string) => {
      const response = await fetch(RecommenderAPIURL + '/initialize', {
        method: 'GET',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      });

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

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const postRecommenderSurvey = async (
  answers: Map<number, string>,
  cuisines: number[],
): Promise<boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  // convert answers to object
  const answersObj: {[key: number]: string} = {};
  answers.forEach((value, key) => {
    answersObj[key] = value;
  });

  const request = async (authtoken: string) => {
    const response = await fetch(RecommenderAPIURL + '/initialize', {
      method: 'POST',
      headers: {
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: answersObj,
        cuisines: cuisines,
      }),
    });

    return response;
  };

  const response = await requestAndValidate(authToken, request);

  if (response?.ok) {
    return true;
  } else {
    return false;
  }
};
