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
  likes?: FGReaction[];
  dislikes?: FGReaction[];
  group_place_id?: number;
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
  reviews: any[];
  hours: any[];
  url: string;
  website: string;
  attributes: string[];
}

export interface Filter {
  name: string;
  options: string[];
  values: (number | string)[];
  text: string;
  defaultIdx: number | number[];
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

export interface FGsAndInvites {
  friendsGroups: FriendGroup[];
  invitations: Invitation[];
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
  id: number;
  user: {
    id: number;
    name: string;
  };
}

// export interface FGPlace {
//   id: number;
//   name: string;
//   image_url: string;
//   group_event_id: number;
//   group_event_place_id: number;
//   place_id: number;
//   place: Place;
//   category_name: string;
//   likes: FGReaction[];
//   dislikes: FGReaction[];
// }
