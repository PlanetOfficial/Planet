import React, {useState, useEffect, useMemo} from 'react';
import {Alert} from 'react-native';
import strings from '../constants/strings';
import {Coordinate} from '../utils/types';
import LocationContext from './LocationContext';
import {fetchUserLocation} from '../utils/Misc';
import numbers from '../constants/numbers';

const LocationStateProvider = ({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) => {
  const [location, setLocation] = useState<Coordinate>({
    latitude: numbers.defaultLatitude,
    longitude: numbers.defaultLongitude,
  });
  const locationContext = useMemo(() => ({location, setLocation}), [location]);

  const initializeLocation = async () => {
    const result = await fetchUserLocation();
    if (result) {
      setLocation(result);
    } else {
      Alert.alert(strings.error.error, strings.error.locationPermission);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      initializeLocation();
    }
  }, [isLoggedIn]);

  return (
    <LocationContext.Provider value={locationContext}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationStateProvider;
