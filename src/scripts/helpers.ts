import * as crypto from 'crypto';

export const hash = async (phrase, secret, length = 64) => {
  const hashResult = await crypto
    .scryptSync(phrase, secret, length)
    .toString('hex');
  return hashResult;
};
