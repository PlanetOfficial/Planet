import {createContext} from 'react';
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

export default LocationContext;
