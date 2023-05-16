// import {CustomCallsURL} from '../APIConstants';

// export const unbookmark = async (
//   authToken: string,
//   placeId: number,
// ): Promise<boolean> => {
//   const response = await fetch(
//     CustomCallsURL + `/places/remove/${placeId}?authtoken=${authToken}`,
//     {
//       method: 'POST',
//     },
//   );

//   return response?.ok;
// };

import {CustomCallsURL} from '../APIConstants';

export const unbookmark = async (authToken: any, placeId: number) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    CustomCallsURL + `/unbookmark/${placeId}?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
