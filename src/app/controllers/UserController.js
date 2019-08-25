import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(3)
        .required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')])
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(412).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(412).json({ error: 'E-mail already in use' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const userExists = await User.findByPk(req.params.id);

    if (!userExists) {
      return res.status(400).json({ error: 'User not found' });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string()
        .min(3)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      password: Yup.string().min(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(412).json({ error: 'Validation fails' });
    }

    if (req.body.email) {
      const emailExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already in use' });
      }
    }

    if (
      req.body.password &&
      !(await userExists.checkPassword(req.body.oldPassword))
    ) {
      return res.status(400).json({ error: 'Old Password does not match' });
    }

    const userUpdated = await userExists.update(req.body);

    return res.json(userUpdated);
  }

  async findAll(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }
}

export default new UserController();
