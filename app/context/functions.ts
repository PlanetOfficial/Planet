import { useContext } from "react";
import { getFriendsInfo } from "../utils/api/friendsAPI";
import FriendsContext from "./FriendsContext";
import { Alert } from "react-native";
import strings from "../constants/strings";

export const initializeFriendsInfo = async () => {
	const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {
    setRequests,
    setRequestsSent,
    setFriends,
    setSuggestions,
    setFriendGroups,
    setUsersIBlock,
    setUsersBlockingMe,
  } = friendsContext;

	const result = await getFriendsInfo();
	if (result) {
		setSuggestions(result.suggestions);
		setFriends(result.friends);
		setRequests(result.requests);
		setRequestsSent(result.requests_sent);
		setFriendGroups(result.friend_groups);
		setUsersIBlock(result.usersIBlock);
		setUsersBlockingMe(result.usersBlockingMe);
	} else {
		Alert.alert(strings.error.error, strings.error.loadFriendsList);
	}
};