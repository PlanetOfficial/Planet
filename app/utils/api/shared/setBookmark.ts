import {EndPointsURL} from '../APIConstants';

export const setBookmark = async (
  authToken: string,
  placeId: number,
): Promise<boolean> => {
  const response = await fetch(
    EndPointsURL + `/places/add?place_id=${placeId}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
