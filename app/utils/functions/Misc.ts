import haversine from 'haversine-distance';

import {
  MarkerObject,
  Coordinate,
  Category,
  Place,
  Event,
  Region,
} from '../interfaces/types';
import {floats} from '../../constants/numbers';
import moment from 'moment';

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
  Given a place, return a string to be displayed on the PlaceCard.
*/
export const getPlaceCardString = (
  place: Place,
  displayCategory: boolean = true,
): string => {
  let result = '';
  if (place.category && displayCategory) {
    result += place.category.name + ' • ';
  }
  if (place.dates && place.dates.start) {
    result += moment(place.dates.start, 'YYYY-MM-DD').format('M/D/YYYY');
    if (place.dates.end) {
      result +=
        ' - ' +
        moment(place.dates.end, 'YYYY-MM-DD').format('M/D/YYYY') +
        ' • ';
    } else {
      result += ' • ';
    }
  }
  if (place.priceRanges && place.priceRanges.min) {
    result += '$' + place.priceRanges.min;
    if (place.priceRanges.max) {
      result += ' - ' + '$' + place.priceRanges.max + ' • ';
    } else {
      result += ' • ';
    }
  }
  if (place.price) {
    result += '$'.repeat(place.price) + ' • ';
  }
  if (place.rating && place.rating_count) {
    result += place.rating + '/5 (' + place.rating_count + ') • ';
  }
  return result.slice(0, -3);
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
      latitude: floats.defaultLatitude,
      longitude: floats.defaultLongitude,
      latitudeDelta: floats.defaultLatitudeDelta,
      longitudeDelta: floats.defaultLongitudeDelta,
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
export const getMarkerArray = (places: Place[]): MarkerObject[] => {
  let markers: MarkerObject[] = [];
  places?.forEach((place: Place) => {
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

// given an object, return true if it is a place, false if it is a category
// Note: a category cannot have a latitude so this is the way to tell a Place from a Category
export const isPlace = (
  destination: Place | Category,
): destination is Place => {
  return destination.hasOwnProperty('latitude');
};

// given an object, return true if it is a place, false if it is an event
// Note: an event cannot have a latitude so this is the way to tell a Place from an Event
export const isPlace2 = (item: Place | Event): item is Place => {
  return item.hasOwnProperty('latitude');
};
