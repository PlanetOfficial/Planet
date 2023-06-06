export interface Genre {
  id: number;
  name: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  alias: string;
  supplier: string;
  filter: Filter[];
  icon: Image;
}

export interface Poi {
  id: number;
  supplier: string;
  name: string;
  photo: string;
  place_id: string;
  latitude: number;
  longitude: number;
  vicinity: string;
  price: number;
  rating: number;
  rating_count: number;
  category_name: string;
}

export interface Image {
  path: string;
  name: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

//////

export interface Event {
  id: number;
  name: string;
  date: string;
  places: Poi[];
}

export interface GroupEvent {
  id: number;
  name: string;
  date: string;
  destinations: GroupPlace[];
  suggester: User;
}

export interface GroupPlace {
  id: number;
  name: string;
  places: Poi[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  self?: boolean;
}

export interface CustomPlace {
  name: string;
  latitude: number;
  longitude: number;
  place_id: string | null;
}

export interface PlaceDetail {
  description: string;
  address: string;
  phone: string;
  photos: string[];
  reviews: Review[];
  hours: string[];
  url: string;
  website: string;
  attributes: string[];
}

export interface Review {
  text: string;
  time: number;
  rating: number;
  language: string;
  author_url: string;
  translated: boolean;
  author_name: string;
  original_language: string;
  profile_photo_url: string;
  relative_time_description: string;
}

export interface Filter {
  name: string;
  options: string[];
  multi: boolean;
  defaultIdx: number;
}

export interface MarkerObject {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Group {
  id: number;
  name: string;
  group_member: GroupMember[];
}

export interface GroupMember {
  id: number;
  user: User;
}

export interface Invite {
  id: number;
  group: Group;
  inviter: User;
}
