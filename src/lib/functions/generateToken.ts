import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config.js';
const generateAuthToken = (id: number) => {
  return jwt.sign({ _id: id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

const decodeAuthToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};
const generateEmailVerificationToken = (email: string) => {
  return jwt.sign({ email: email }, config.emailVerificationSecret, {
    expiresIn: '30d',
  });
}
const decodeEmailVerificationToken = (token: string) => {
  return jwt.verify(token, config.emailVerificationSecret) as JwtPayload;
}
export { generateAuthToken, decodeAuthToken,generateEmailVerificationToken,decodeEmailVerificationToken };