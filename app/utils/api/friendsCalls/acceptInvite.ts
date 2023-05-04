import {DBOpsURL} from '../APIConstants';

export const acceptInvite = async (
  group_id: number,
) => {
  // TODO: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/acceptInvite?group_id=${group_id}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
