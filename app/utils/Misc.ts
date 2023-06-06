import haversine from 'haversine-distance';

import {Coordinate} from './types';

/*
  Given a point and the longitudeDelta, calculate the radius of the circle (the
  point is the center of the circle)
*/
export const calculateRadius = (point1: Coordinate, longitudeDelta: number) => {
  const point2 = {
    latitude: point1.latitude,
    longitude: point1.longitude + longitudeDelta / 2,
  };
  const distance = getDistanceFromCoordinates(point1, point2);

  return (6 / 7) * distance;
};

/*
  Given a point and a radius, calculate the bounding box of the view.
*/
export const getRegionFromPointAndDistance = (
  point: Coordinate,
  distance: number,
) => {
  const earthRadius = 6378137; // Radius of the Earth in meters
  const angularDistance = ((7 / 6) * distance) / earthRadius;
  const newLongitude =
    point.longitude +
    (angularDistance * 180) /
      Math.PI /
      Math.cos((point.latitude * Math.PI) / 180);

  const newDelta = (newLongitude - point.longitude) * 2;

  return {
    latitude: point.latitude,
    longitude: point.longitude,
    latitudeDelta: newDelta,
    longitudeDelta: newDelta,
  };
};

/*
  Calculates the distance in meters given two points in terms of latitude
  and longitude.
*/
export const getDistanceFromCoordinates = (
  point1: Coordinate,
  point2: Coordinate,
) => {
  return haversine(point1, point2);
};
