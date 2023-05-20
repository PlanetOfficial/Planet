import {FriendsURL} from '../APIConstants';

export const acceptInvite = async (invite_id: number, token: any) => {
  const response = await fetch(
    FriendsURL +
      `/friends/acceptInvite?invite_id=${invite_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
