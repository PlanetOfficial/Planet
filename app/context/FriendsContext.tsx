import {createContext} from 'react';
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
};

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export default FriendsContext;
