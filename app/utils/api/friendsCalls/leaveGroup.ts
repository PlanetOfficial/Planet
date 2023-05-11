import {DBOpsURL} from '../APIConstants';

export const leaveGroup = async (group_id: number, authToken: any) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/friends/leaveGroup?group_id=${group_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
