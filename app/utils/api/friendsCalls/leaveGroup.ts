import {FriendsURL} from '../APIConstants';

export const leaveGroup = async (group_id: number, authToken: any) => {
  const response = await fetch(
    FriendsURL +
      `/friends/leaveGroup?group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
