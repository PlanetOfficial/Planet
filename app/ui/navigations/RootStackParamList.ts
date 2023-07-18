import {
  Event,
  Coordinate,
  Category,
  Poi as PoiType,
  UserInfo,
  Destination,
} from '../../utils/types';

type RootStackParamList = {
  TabStack: undefined;
  SearchCategory: {
    mode: 'create' | 'suggest' | 'add' | 'none';
    location: Coordinate;
    radius: number;
    category: Category;
  };
  SearchMap: {
    mode: 'create' | 'suggest' | 'add' | 'none';
    location: Coordinate;
    radius: number;
    category: Category;
  };
  Poi: {
    mode: 'create' | 'suggest' | 'add' | 'none';
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
  Mutuals: {
    mutuals: UserInfo[];
  };
  User: {
    user: UserInfo;
  };
  ViewHistory: {
    viewHistory: PoiType[];
    location: Coordinate;
  };
  Settings: undefined;
  AccountSettings: undefined;
  ContactUs: undefined;
  LocationsSettings: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  ProfileSettings: undefined;
  Create:
    | {
        members: UserInfo[] | undefined;
        destination: PoiType | undefined;
        category: string | undefined;
      }
    | undefined;
  ModeSearch: {
    mode: 'create' | 'suggest' | 'add' | 'none';
  };
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
  Login: undefined;
  SignUpName: undefined;
  SignUpCreds: {
    firstName: string;
    lastName: string;
  };
  SignUpPhone: {
    authToken: string;
  };
  VerifyPhone: {
    authToken: string;
  };
  SignUpInfo: {
    authToken: string;
  };
  SignUpVerify: {
    authToken: string;
  };
  ForgotPasswordVerify: {
    username: string;
  };
  ResetPassword: {
    authToken: string;
  };
  ForgotPassword: undefined;
};

export default RootStackParamList;
