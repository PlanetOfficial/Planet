import haversine from 'haversine-distance';

import {MarkerObject} from '../interfaces/MarkerObject';
import {coordinate} from '../interfaces/coordinate';
import misc from '../../constants/misc';

/*
  Given a point and the longitudeDelta, calculate the radius of the circle (the
  point is the center of the circle)
*/
export const calculateRadius = (point1: coordinate, longitudeDelta: number) => {
  const point2 = {
    latitude: point1.latitude,
    longitude: point1.longitude + longitudeDelta / 2,
  };
  const distance = getDistanceFromCoordinates(point1, point2);

  return (6 / 7) * distance;
};

/*
  Calculates the distance in meters given two points in terms of latitude
  and longitude.
*/
export const getDistanceFromCoordinates = (
  point1: coordinate,
  point2: coordinate,
) => {
  return haversine(point1, point2);
};

export const getRegionForCoordinates = (points: Array<MarkerObject>) => {
  // find the minimum and maximum latitude and longitude coordinates
  const latitudes = points.map(point => point.latitude);
  const longitudes = points.map(point => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  // calculate the center and delta values for the region
  const centerLat = (maxLat + minLat) / 2;
  const centerLng = (maxLng + minLng) / 2;
  let latDelta = (maxLat - minLat) * 1.2; // add a bit of padding
  let lngDelta = (maxLng - minLng) * 1.2;

  if (latDelta === 0) {
    latDelta = 0.0922; // set a default delta
  }

  if (lngDelta === 0) {
    lngDelta = 0.0421;
  }

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

/* O(n) algorithm to filter objects and return objects in the array with
   unique IDs
*/
export const filterToUniqueIds = (arr: Array<any>) => {
  const uniqueObj: any = {};
  arr?.forEach(item => {
    if (item?.id && !uniqueObj[item.id]) {
      uniqueObj[item.id] = item;
    }
  });

  return Object.values(uniqueObj).reverse();
};

/*
  Give an array where each element is another array, fetches images
  from all of this data
*/
export const getImagesFromURLs = (places: Array<any>) => {
  let images: any = [];
  if (places && places?.length !== 0) {
    places.forEach(item => {
      if (item?.images && item?.images?.length !== 0) {
        images.push(
          item?.images[0]?.prefix + misc.imageSize + item?.images[0]?.suffix,
        );
      }
    });
  }

  return images;
};
