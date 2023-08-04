import { Coordinate, FriendGroup, Poi, UserInfo } from "../utils/types";

export type BookmarkContextType = {
  bookmarks: Poi[];
  setBookmarks: React.Dispatch<React.SetStateAction<Poi[]>>;
  initializeBookmarks: () => Promise<void>;
};

export type FriendsContextType = {
  suggestions: UserInfo[];
  setSuggestions: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  friends: UserInfo[];
  setFriends: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  requests: UserInfo[];
  setRequests: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  requestsSent: UserInfo[];
  setRequestsSent: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  friendGroups: FriendGroup[];
  setFriendGroups: React.Dispatch<React.SetStateAction<FriendGroup[]>>;
  usersIBlock: UserInfo[];
  setUsersIBlock: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  usersBlockingMe: UserInfo[];
  setUsersBlockingMe: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  initializeFriendsInfo: () => Promise<void>;
  refreshFriends: () => Promise<void>;
};

export type LocationContextType = {
  location: Coordinate;
  setLocation: React.Dispatch<React.SetStateAction<Coordinate>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  initializeLocation: () => Promise<void>;
};
