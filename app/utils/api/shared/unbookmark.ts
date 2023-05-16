import {CustomCallsURL} from '../APIConstants';

export const unbookmark = async (authToken: string, placeId: number): Promise<boolean> => {
  const response = await fetch(
    CustomCallsURL + `/places/remove/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
