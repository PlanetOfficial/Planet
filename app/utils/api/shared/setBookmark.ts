import {CustomCallsURL} from '../APIConstants';

export const setBookmark = async (
  authToken: string,
  placeId: number,
): Promise<boolean> => {
  const response = await fetch(
    CustomCallsURL + `/places/add/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
