import {createContext, useContext} from 'react';
import {FriendGroup, UserInfo} from '../utils/types';

type FriendsContextType = {
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
};

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

const useFriendsContext = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('FriendsContext is not set!');
  }
  return context;
};

export {useFriendsContext, FriendsContext};
