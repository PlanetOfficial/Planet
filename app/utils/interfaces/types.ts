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
