import {CustomCallsURL} from '../APIConstants';

export const setBookmark = async (authToken: any, placeId: number) => {
  // TODO: filter inputs**

  const response = await fetch(
    CustomCallsURL + `/bookmark/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
