import {DBOpsURL} from '../APIConstants';

export const rejectInvite = async (
  group_id: number,
) => {
  // TODO: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/rejectInvite?group_id=${group_id}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
