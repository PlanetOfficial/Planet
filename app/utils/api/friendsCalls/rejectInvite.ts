import {FriendsURL} from '../APIConstants';

export const rejectInvite = async (invite_id: number, token: any) => {
  const response = await fetch(
    FriendsURL +
      `/friends/rejectInvite?invite_id=${invite_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
