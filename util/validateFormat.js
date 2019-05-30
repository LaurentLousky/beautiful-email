/**
 *
 * @param {string} email to validate
 *
 * @returns {object}
 * {
 *  error: String
 *  validFormat: boolean
 * }
 */
export const validateFormat = email => {
  // Email name is there ex: "bob" in bob@gmail.com
  const containsName = /^\S+@/;

  // Email contains spaces
  const containsSpaces = /\s/g;

  // Email has exactly one @
  const containsAtSign = 2 === email.split('@').length;

  // Email ends with a domain name
  const containsDomain = /@(\S+\.\S{2,})+$/;

  // Entire email is valid
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let error = '';
  let validFormat = false;

  if (containsSpaces.test(email)) 
    error = 'Email cannot contain white space';

  else if (!containsAtSign) 
    error = 'Email must contain one @';

  else if (!containsName.test(email)) 
    error = 'Email name cannot be blank';

  else if (!containsDomain.test(email))
    error = 'Email must end with a domain. ex: gmail.com';

  else if (!validEmail.test(email)) 
    error = 'Invalid email';
    
  else validFormat = true;

  return { error, validFormat };
};
