import haversine from 'haversine-distance';

import {MarkerObject, Coordinate, Poi, Region} from '../interfaces/types';
import {defaultParams} from '../../constants/numbers';

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

export const getRegionForCoordinates = (points: MarkerObject[]): Region => {
  if (!points || points?.length === 0) {
    return {
      latitude: defaultParams.defaultLatitude,
      longitude: defaultParams.defaultLongitude,
      latitudeDelta: defaultParams.defaultLatitudeDelta,
      longitudeDelta: defaultParams.defaultLongitudeDelta,
    };
  }

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
  let latDelta = (maxLat - minLat) * 1.9; // add a bit of padding
  let lngDelta = (maxLng - minLng) * 1.9;

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

/*
  Given an array of destinations, filter that array into an array of
  MarkerObjects.
*/
export const getMarkerArray = (places: Poi[]): MarkerObject[] => {
  let markers: MarkerObject[] = [];
  places?.forEach((place: Poi) => {
    if (place && place?.name && place?.latitude && place?.longitude) {
      const markerObject = {
        name: place?.name,
        latitude: place?.latitude,
        longitude: place?.longitude,
      };

      markers.push(markerObject);
    }
  });
  return markers;
};

/*
  Given an array of destinations, return latitude and longitude of the
  average of all of the destinations.
*/
export const getAveragePoint = (places: MarkerObject[]): Coordinate => {
  let latSum = 0;
  let lngSum = 0;
  let count = 0;
  places?.forEach((place: MarkerObject) => {
    if (place && place?.latitude && place?.longitude) {
      latSum += place?.latitude;
      lngSum += place?.longitude;
      count += 1;
    }
  });
  return {
    latitude: latSum / count,
    longitude: lngSum / count,
  };
};
