import {DBOpsURL} from '../APIConstants';

export const createGroup = async (
  name: String,
  invitee_emails: Array<String>,
  authToken: any,
) => {
  

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    DBOpsURL +
      `/friends/createGroup?${emails_string}&name=${name}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
