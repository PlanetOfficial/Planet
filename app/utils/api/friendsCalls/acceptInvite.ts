import {DBOpsURL} from '../APIConstants';

export const acceptInvite = async (invite_id: number, token: any) => {
  // TODO: filter inputs**

  const response = await fetch(
    DBOpsURL + `/friends/acceptInvite?invite_id=${invite_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
