import {ImageSourcePropType} from 'react-native';

export interface Place {
  category_id: number;
  category_name: string;
  created_at: number;
  id: number;
  image_url?: string;
  latitude: number;
  longitude: number;
  name: string;
  place_id: string;
  subcategory_id?: number;
  supplier: string;
}

export interface Category {
  id: number;
  name: string;
  icon: ImageSourcePropType;
  subcategories?: Subcategory[];
  options?: Place[];
}

export interface Subcategory {
  id: number;
  title: string;
}

export interface Genre {
  id: number;
  name: string;
  image: ImageSourcePropType;
  categories: Category[];
  filters?: {
    name: string;
    options: string[];
    values: number[];
    text: string;
    defaultIdx: number;
  }[];
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MarkerObject {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface WeekDay {
  day: string;
  hours: string[];
}

export interface LiveEvent {
  category: string;
  date: string;
  id: number;
  image_url: string;
  latitude: string;
  longitude: string;
  name: string;
  price: number;
  rating: number;
}

export interface LiveEvents {
  [categoryIndex: number]: LiveEvent[];
}

export interface Event {
  date: string;
  id: number;
  name: string;
  places: {
    created_at: number;
    event_id: number;
    id: number;
    place: Place;
    place_id: number;
  }[];
}
