import {PoiAPIURL} from '../APIConstants';
import {Category, Place} from '../../interfaces/types';

export const getPois = async (
  category: Category,
  radius: number,
  latitude: number,
  longitude: number,
  filters?: {[key: string]: string | string[]},
): Promise<Place[] | null> => {
  const response = await fetch(
    PoiAPIURL +
      `/poi?category=${JSON.stringify(
        category,
      )}&radius=${radius}&latitude=${latitude}&longitude=${longitude}&filters=${JSON.stringify(
        filters,
      )}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson: Place[] = await response.json();
    return myJson;
  } else {
    return null;
  }
};

// export const getDestination = async (
//   placeId: string,
//   supplier: string,
// ): Promise<PlaceDetail | null> => {
//   const response = await fetch(
//     EndPointsURL + `/destination/${placeId}?supplier=${supplier}`,
//     {
//       method: 'GET',
//     },
//   );

//   if (response?.ok) {
//     const myJson: PlaceDetail = await response.json();
//     return myJson;
//   } else {
//     return null;
//   }
// };

// export const postDestination = async (
//   name: string,
//   latitude: number,
//   longitude: number,
//   place_id: string | null,
// ): Promise<Place | null> => {
//   const response = await fetch(
//     EndPointsURL +
//       `/destination?name=${name}&latitude=${latitude}&longitude=${longitude}&place_id=${place_id}`,
//     {
//       method: 'POST',
//     },
//   );

//   if (response?.ok) {
//     const myJson: Place = await response.json();
//     return myJson;
//   } else {
//     return null;
//   }
// };
