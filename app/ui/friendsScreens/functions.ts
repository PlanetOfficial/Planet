import { useContext } from "react";
import { Alert } from "react-native";
import strings from "../../constants/strings";
import FriendsContext from "../../context/FriendsContext";
import { getFriends } from "../../utils/api/friendsAPI";

export const loadFriends = async () => {
  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }

  const {
    setFriends,
    setFriendGroups,
    setUsersIBlock,
    setUsersBlockingMe,
    setRequests,
    setRequestsSent,
  } = friendsContext;

  const response = await getFriends();

  if (response) {
    setFriends(response.friends);
    setFriendGroups(response.friend_groups);
    setUsersIBlock(response.usersIBlock);
    setUsersBlockingMe(response.usersBlockingMe);
    setRequests(response.requests);
    setRequestsSent(response.requests_sent);
  } else {
    Alert.alert(strings.error.error, strings.error.loadFriendsList);
  }
};