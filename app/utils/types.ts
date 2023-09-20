export interface UserInfo {
  id: number;
  display_name: string;
  username: string;
  icon?: Image;
  count?: number;
}

export interface UserDetail {
  shared_events: Event[];
}

export interface MyInfo {
  id: number;
  display_name: string;
  username: string;
  icon?: Image;
  phone_number: string;
  birthday: string;
}

export interface FriendGroup {
  id: number;
  name: string;
  members: UserInfo[];
}

export interface Genre {
  id: number;
  name: string;
  alias: string;
  supplier: string;
  filter: Filter[];
  icon: Image;
  image: Image;
  categories: Category[];
  is_live_category: boolean;
}

export interface Category {
  id: number;
  name: string;
  alias: string;
  supplier: string;
  filter: Filter[];
  icon: Image;
  is_live_category: boolean;
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
  display_date: string;
  rank: number;
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
  date_and_time?: string;
  canceled?: boolean;
  labels?: string;
  phq_attendance?: number;
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
  completed: boolean;
}

export interface EventDetail {
  id: number;
  name: string;
  datetime: string;
  members: UserInfo[];
  destinations: Destination[];
}

export interface ChatInfo {
  getstream_user_token: string;
  channel_id: string;
  getstream_api_key: string;
  channel_type: string;
}

export interface Destination {
  id: number;
  name: string;
  idx: number;
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

export interface EventNotification {
  created_at: string;
  event: Event;
  body: string;
  screenToNavigate: 'EVENT' | '';
  photo: string;
  actor: UserInfo;
}

export interface Recommendation {
  places: Poi[];
  categories: string[];
}

export interface GoogleAutocompleteResult {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface RecommenderSurvey {
  questions: RecommenderSurveyQuestion[];
  cuisines: RecommenderSurveyCuisine[];
}

export interface RecommenderSurveyCuisine {
  id: number;
  name: string;
}

export interface RecommenderSurveyQuestion {
  id: number;
  prompt: string;
  yes: string;
  no: string;
  neutral: string;
}

export type RecommenderSurveyResponse = 'yes' | 'no' | 'neutral';

export type ExploreModes = 'create' | 'suggest' | 'add' | 'none';
export type ExploreModesWithInCreate =
  | 'create'
  | 'suggest'
  | 'add'
  | 'inCreate'
  | 'none';
