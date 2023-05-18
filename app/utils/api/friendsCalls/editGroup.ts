import {DBOpsURL} from '../APIConstants';

export const editGroup = async (
  name: String,
  invitee_emails: Array<String>,
  id: number,
  authToken: any,
) => {
  

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    DBOpsURL +
      `/friends/editGroup?${emails_string}&name=${name}&group_id=${id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
