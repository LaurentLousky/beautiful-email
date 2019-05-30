const key = 'live_37799cabe28a0d0f18181a9b374fa4cc7be828511fb294ce2af7cca624660fc9';


/** Checks that an email is real and deliverable using Kickbox's API

   @param {string} email, email to validate
   @returns {string} error, error message from the Kickbox API or '' if no error
*/
export const validateDeliverability = async email => {
  let error = '';
  try {
    const response = await fetch(`https://api.kickbox.com/v2/verify?email=${email}&apikey=${key}`);
    const json = await response.json();
    error = handleResponse(json);
  } catch (err) {
    console.log(err);
    error = 'Network error! Please try again later';
  } finally {
    return error;
  }
};


/** Handles email validation API response & potential errors

   @param json, json response from Kickbox's API
   @returns error, simplified error message from the Kickbox API
*/
const handleResponse = json => {
  const { result, reason, did_you_mean, success } = json;
  let error = '';
  if (success) {
    if (result != 'deliverable') {
      switch (reason) {
        case 'invalid_email':
          error = 'Invalid email';
          break;
        case 'invalid_domain':
          error = 'Invalid domain name';
          break;
        case 'rejected_email':
          error = 'Email does not exist!';
          break;
        case 'low_quality':
          error = 'Email connection unsecure';
          break;
        case 'low_deliverability':
          error = 'Email connection unsecure';
          break;
        default:
          error = "We can't verify this email";
      }
      if (did_you_mean) error = `Did you mean ${did_you_mean}?`;
    }
  } else error = 'Network error! Please try again later';
  return error;
};
