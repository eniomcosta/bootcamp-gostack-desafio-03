import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConf from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  if (token === 'undefined') {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConf.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
