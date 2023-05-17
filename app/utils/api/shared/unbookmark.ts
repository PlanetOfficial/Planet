import {EndPointsURL} from '../APIConstants';

export const unbookmark = async (
  authToken: string,
  placeId: number,
): Promise<boolean> => {
  const response = await fetch(
    EndPointsURL + `/places/remove?place_id=${placeId}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
