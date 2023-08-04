import React, {useState, useEffect, useMemo, createContext, useContext} from 'react';
import {Alert} from 'react-native';
import strings from '../constants/strings';
import {Coordinate} from '../utils/types';
import {fetchUserLocation} from '../utils/Misc';
import numbers from '../constants/numbers';
import { LocationContextType } from './ContextTypes';

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

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
  const [radius, setRadius] = useState<number>(numbers.defaultRadius);

  const initializeLocation = async () => {
    const result = await fetchUserLocation();
    if (result) {
      setLocation(result);
      setRadius(numbers.defaultRadius);
    } else {
      Alert.alert(strings.error.error, strings.error.locationPermission);
    }
  };

  const locationContext = useMemo(
    () => ({location, setLocation, radius, setRadius, initializeLocation}),
    [location, radius],
  );

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

const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('LocationContext is not set!');
  }
  return context;
};

export {useLocationContext, LocationStateProvider};
