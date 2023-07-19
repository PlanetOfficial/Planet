import {createContext} from 'react';
import {Coordinate} from '../utils/types';

type LocationContextType = {
  location: Coordinate;
  setLocation: React.Dispatch<React.SetStateAction<Coordinate>>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export default LocationContext;
