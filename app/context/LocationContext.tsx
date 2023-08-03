import {createContext, useContext} from 'react';
import {Coordinate} from '../utils/types';

type LocationContextType = {
  location: Coordinate;
  setLocation: React.Dispatch<React.SetStateAction<Coordinate>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('LocationContext is not set!');
  }
  return context;
};

export {useLocationContext, LocationContext};
