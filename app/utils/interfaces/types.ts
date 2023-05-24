export interface Genre {
  id: number;
  name: string;
  image: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  filters: Filter[];
  subcategories: Subcategory[];
  options?: Place[];
}

export interface Subcategory {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  places: Place[];
}

export interface GroupEvent {
  id: number;
  name: string;
  date: string;
  destinations: GroupPlace[];
  suggester: {
    id: number;
    name: string;
    self: boolean;
  };
}

export interface Place {
  id: number;
  supplier: string;
  name: string;
  photo: string;
  place_id: string;
  latitude: number;
  longitude: number;
  dates: {
    start: string | null;
    end: string | null;
  } | null;
  priceRanges: {
    min: number | null;
    max: number | null;
  } | null;
  price: number | null;
  rating: number | null;
  rating_count: number | null;
  category: {
    id: number;
    name: string;
  };
  group_place_id?: number;
  votes: Vote[];
}

export interface GroupPlace {
  id: number;
  name: string;
  places: Place[];
}

export interface Vote {
  name: string;
  email: string;
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

export interface Group {
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

export interface Invite {
  id: number;
  group: Group;
  inviter: {
    name: string;
  };
}
