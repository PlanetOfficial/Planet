import {
  Event,
  Coordinate,
  Category,
  Poi as PoiType,
  UserInfo,
  Destination,
  Genre,
  ExploreModes,
  ExploreModesWithInCreate,
} from '../../utils/types';

type RootStackParamList = {
  TabStack: undefined;

  ViewHistory: {
    viewHistory: PoiType[];
    location: Coordinate;
  };

  SearchCategory: {
    mode: ExploreModes;
    myLocation: Coordinate;
    category: Category;
  };
  SearchMap: {
    mode: ExploreModes;
    myLocation: Coordinate;
    category: Category;
  };
  ModeExplore: {
    mode: ExploreModes;
  };
  AllCategories: {
    location: Coordinate;
    mode: ExploreModes;
    genres: Genre[];
  };

  Poi: {
    mode: ExploreModesWithInCreate;
    place_id: string | undefined;
    poi: PoiType | undefined;
    category: string | undefined;
  };

  Friends: undefined;
  CreateFG: undefined;
  AddFriend: {
    members: UserInfo[];
    event_id: number | undefined;
  };
  Requests: undefined;
  User: {
    user: UserInfo;
  };

  BlockedUsers: undefined;
  AccountSettings: undefined;
  LocationsSettings: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  ProfileSettings: undefined;
  Settings: undefined;

  Create:
    | {
        members: UserInfo[] | undefined;
        destination: PoiType | undefined;
        category: string | undefined;
        destinations: PoiType[] | undefined;
        names: string[] | undefined;
      }
    | undefined;

  Event: {
    event: Event;
    destination: PoiType;
  };
  EventSettings: {
    event: Event;
    destination: Destination;
    category: string | undefined;
  };
  Roulette: {
    destination: Destination;
    eventId: number;
  };
  SpinHistory: {
    destination: Destination;
  };
  Notifications: undefined;

  Welcome: undefined;
  Login: undefined;
  SignUpName: undefined;
  SignUpBirthday: {
    displayName: string;
  };
  SignUpCreds: {
    displayName: string;
    birthday: string;
  };
  SignUpPhone: {
    authToken: string;
  };
  SignUpVerify: {
    authToken: string;
  };
  ResetPwd: {
    authToken: string;
  };
  ForgotPwd: undefined;
  ForgotPwdVerify: {
    username: string;
  };
};

export default RootStackParamList;
