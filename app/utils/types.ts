export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  icon?: Image;
  count?: number;
}

export interface UserDetail {
  status: string;
  mutuals: UserInfo[];
  shared_events: Event[];
}

export interface MyInfo {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  icon?: Image;
  phone_number: string;
  age: string;
  gender: string;
}

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

export interface PoiDetail {
  description?: string;
  address?: string;
  phone?: string;
  photos?: string[];
  reviews?: Review[];
  hours?: string[];
  periods?: PlaceOpeningHoursPeriod[];
  url?: string;
  website?: string;
  attributes?: string[];
}

export interface PlaceOpeningHoursPeriod {
  open: PlaceOpeningHoursPeriodDetail;
  close: PlaceOpeningHoursPeriodDetail;
}

export interface PlaceOpeningHoursPeriodDetail {
  day: number;
  time: string;
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

export interface Event {
  id: number;
  name: string;
  datetime: string;
  members: UserInfo[];
  photo: string;
  vicinity: string;
}

export interface EventDetail {
  id: number;
  name: string;
  datetime: string;
  members: UserInfo[];
  destinations: Destination[];
}

export interface Destination {
  id: number;
  name: string;
  suggestions: Suggestion[];
  spin_history: Spin[];
}

export interface Suggestion {
  id: number;
  is_primary: boolean;
  poi: Poi;
  votes: UserInfo[];
}

export interface Spin {
  id: number;
  created_at: string;
  result: Suggestion;
  spinner: UserInfo;
}

export interface Image {
  path?: string;
  name?: string;
  size?: number;
  mime?: string;
  meta?: {
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

export interface Option {
  name: string;
  onPress: () => void;
  color: string;
  disabled?: boolean;
}

export interface NotificationSettings {
  notify_friend_request: boolean;
  notify_friend_request_accept: boolean;
  notify_event_invite: boolean;
  notify_new_suggestion: boolean;
  notify_set_primary: boolean;
}
