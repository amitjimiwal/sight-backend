import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
const generateAuthToken = (id: number) => {
  return jwt.sign({ _id: id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

const decodeAuthToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};
export { generateAuthToken, decodeAuthToken };