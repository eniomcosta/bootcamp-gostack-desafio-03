import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConf from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation error' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(400).json({ error: 'User e-mail not found' });
    }

    if (!(await user.checkPassword(req.body.password))) {
      res.status(400).json({ error: 'Password incorrect' });
    }

    const { id, name, email } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConf.secret, {
        expiresIn: authConf.expiresIn,
      }),
    });
  }
}

export default new SessionController();
