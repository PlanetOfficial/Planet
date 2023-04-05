import {CustomCallsURL} from '../APIConstants';

export const unbookmark = async (authToken: any, placeId: number) => {
  // TODO: filter inputs**

  const response = await fetch(
    CustomCallsURL + `/unbookmark/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
