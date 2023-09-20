import {useState} from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  Animated,
  Share,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
} from '@react-navigation/stack';

import haversine from 'haversine-distance';

import numbers from '../constants/numbers';
import strings from '../constants/strings';

import {Coordinate, Poi} from './types';

import {bookmark} from './api/bookmarkAPI';

export const getRegionFromPoints = (points: Coordinate[]) => {
  const minLat = Math.min(...points.map(point => point.latitude));
  const maxLat = Math.max(...points.map(point => point.latitude));
  const minLong = Math.min(...points.map(point => point.longitude));
  const maxLong = Math.max(...points.map(point => point.longitude));

  const midLat = (minLat + maxLat) / 2;
  const midLong = (minLong + maxLong) / 2;

  const deltaLat = maxLat - minLat;
  const deltaLong = maxLong - minLong;

  const delta = (Math.max(deltaLat, deltaLong) * 6) / 5;

  return {
    latitude: midLat,
    longitude: midLong,
    latitudeDelta: delta,
    longitudeDelta: delta,
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
    Geolocation.requestAuthorization(
      () => {},
      error => {
        console.warn(error);
        Alert.alert(
          strings.error.locationPermission,
          strings.error.locationPermissionInfo,
        );
      },
    );
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          strings.error.locationPermission,
          strings.error.locationPermissionInfo,
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
  return new Promise(res => {
    Geolocation.getCurrentPosition(
      position =>
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      _ => {
        res({
          latitude: 0,
          longitude: 0,
        });
      },
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

  if (poi.display_date) {
    poiString += poi.display_date;
  }

  return poiString;
};

export const isLocationOffset = (a: Coordinate, b: Coordinate): boolean => {
  return (
    Math.abs(a.latitude - b.latitude) > numbers.locationOffThreshold ||
    Math.abs(a.longitude - b.longitude) > numbers.locationOffThreshold
  );
};

export function useLoadingState() {
  const [loading, setLoading] = useState<boolean>(false);

  const withLoading = async (callback: () => Promise<void>) => {
    try {
      setLoading(true);
      await callback();
    } finally {
      setLoading(false);
    }
  };

  return [loading, withLoading] as const;
}

export const formatDisplayInitials = (name: string) => {
  let letters = name ? name[0].toUpperCase() : '';
  if (name.split(' ').length > 1) {
    letters += name.split(' ')[1][0].toUpperCase();
  } else if (name.length > 1) {
    letters += name[1].toUpperCase();
  }
  return letters;
};

export const shareApp = async (setShared?: (shared: boolean) => void) => {
  const result = await Share.share({
    message:
      strings.main.shareMessage +
      (Platform.OS === 'android' ? '\n' + strings.main.downloadUrl : ''),
    url: strings.main.downloadUrl,
  });
  if (result.action === Share.sharedAction && setShared) {
    setShared(true);
  }
};

export const verticalAnimation = ({
  current,
  inverted,
  layouts: {screen},
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const translateFocused = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  );

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: 'clamp',
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        {translateY: translateFocused},
        // Translation for the animation of the card in back
        {translateY: 0},
      ],
    },
    overlayStyle: {opacity: overlayOpacity},
    shadowStyle: {shadowOpacity},
  };
};
