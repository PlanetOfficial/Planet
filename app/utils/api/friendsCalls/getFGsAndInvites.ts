import {FriendsURL} from '../APIConstants';

export const getFGsAndInvites = async (authToken: any) => {
  const response = await fetch(
    FriendsURL + `/friends/groupsAndInvites?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return {};
  }
};
