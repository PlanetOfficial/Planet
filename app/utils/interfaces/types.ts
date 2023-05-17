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

export interface CustomPlace {
  name: string;
  latitude: number;
  longitude: number;
  formatted_address?: string | undefined;
}

export interface Category {
  id: number;
  name: string;
  alias: string;
  genre_id: number;
  filters?: Filter[];
  icon: ImageSourcePropType;
  subcategories?: Subcategory[];
  options?: Place[];
}

export interface Subcategory {
  id: number;
  title: string;
  alias: string;
}

export interface Filter {
  name: string;
  options: string[];
  values: (number | string)[];
  text: string;
  defaultIdx: number | number[];
}

export interface Genre {
  id: number;
  name: string;
  image: ImageSourcePropType;
  categories: Category[];
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
  latitude: number;
  longitude: number;
  name: string;
  priceRanges: {
    min: number;
    max: number;
    currency: string;
    type: string;
  }[];
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
  suggester: number;
  suggester_info: {
    name: string;
    self: boolean;
  };
}

export interface FriendGroup {
  id: number;
  user_id: number;
  group: Group;
  group_member: GroupMember[];
}

export interface GroupMember {
  user: {
    name: string;
    email: string;
  };
  group_id: number;
  id: number;
  user_id: number;
}

export interface Group {
  id: number;
  name: string;
  owner: number;
}

export interface Invitation {
  id: number;
  group: Group;
  inviter: {
    name: string;
  };
}

export interface FGReaction {
  created_at: number;
  group_event_place_id: number;
  id: number;
  user: {
    id: number;
    name: string;
  };
}

export interface FGPlace {
  id: number;
  name: string;
  image_url: string;
  group_event_id: number;
  group_event_place_id: number;
  place_id: number;
  place: Place;
  category_name: string;
  likes: FGReaction[];
  dislikes: FGReaction[];
}

export interface PlaceDetail {
  additionalInfo: string;
  address: string;
  dates: any;
  description: string;
  hours: {
    day: number;
    end: string;
    is_overnight: boolean;
    start: string;
  }[];
  name: string;
  phone: string;
  photos: string[];
  place_name: string;
  price: string;
  rating: number;
  review_count: number;
  url: string;
}
