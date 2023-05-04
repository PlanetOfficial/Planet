import {DBOpsURL} from '../APIConstants';

export const createGroup = async (
  name: String,
  invitee_emails: Array<String>,
) => {
  // TODO: filter inputs**

  let emails_string = '';

  invitee_emails.forEach(item => {
    emails_string += `invitee_emails[]=${item}&`;
  });

  const response = await fetch(
    DBOpsURL +
      `/createGroup?${emails_string}&name=${name}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
