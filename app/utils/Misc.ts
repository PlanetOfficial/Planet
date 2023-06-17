import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import haversine from 'haversine-distance';

import {Coordinate, Poi} from './types';

import {bookmark} from './api/bookmarkAPI';
import strings from '../constants/strings';

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

/*
  Retrieves the user's current location based on their device's GPS.
*/
export const fetchUserLocation = async (): Promise<Coordinate> => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(strings.error.error, strings.error.locationPermission);
      }
    } catch (err) {
      console.warn(err);
    }
  }
  return new Promise(res => {
    Geolocation.getCurrentPosition(position =>
      res({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    );
  });
};

/*
  Bookmark/unbookmark a POI: sends API request, update local state, and update AsyncStorage.
*/
export const handleBookmark = async (
  poi: Poi,
  bookmarks: Poi[],
  setBookmarks: (pois: Poi[]) => void,
) => {
  const response = await bookmark(poi);
  if (response) {
    const _bookmarks = [...bookmarks];
    const idx = _bookmarks.findIndex(_bookmark => _bookmark.id === poi.id);
    if (idx === -1) {
      _bookmarks.unshift(poi);
    } else {
      _bookmarks.splice(idx, 1);
    }
    setBookmarks(_bookmarks);
    AsyncStorage.setItem('bookmarks', JSON.stringify(_bookmarks));
  } else {
    Alert.alert(strings.error.error, strings.error.updateBookmarks);
  }
};

export const getInfoString = (poi: Poi): string => {
  let poiString: string = '';

  if (poi.rating && poi.rating_count) {
    poiString += `★ ${poi.rating}  (${
      poi.rating_count > 1000
        ? (poi.rating_count / 1000).toFixed(0) + 'k'
        : poi.rating_count
    })`;
  }

  if (poi.rating && poi.rating_count && poi.price) {
    poiString += '・';
  }

  if (poi.price) {
    poiString += '$'.repeat(poi.price);
  }

  return poiString;
};
