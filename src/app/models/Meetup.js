import Sequelize, { Model } from 'sequelize';
import { isBefore, parseISO } from 'date-fns';
import * as Yup from 'yup';
import DateUtils from '../utils/DateUtils';

import File from './File';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        place: Sequelize.STRING,
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'organizer' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
  }

  static async validate(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string()
        .min(3)
        .max(255)
        .required('Title is required'),
      description: Yup.string()
        .min(5)
        .max(255)
        .required('Description is required'),
      place: Yup.string()
        .min(5)
        .max(255)
        .required('Place is required'),
      date: Yup.date().required('Date is required'),
      time: Yup.string().required('Time is required'),
      banner_id: Yup.number().required('Banner is required'),
    });

    const { date, time, banner_id } = req.body;

    await schema.validate(req.body, { abortEarly: false }).catch(err => {
      return res.status(412).json(err.errors);
    });

    if (!(await File.findByPk(banner_id))) {
      return res.status(412).json({ error: 'Banner image not exist' });
    }

    if (!DateUtils.isValidDate(date)) {
      return res
        .status(412)
        .json({ error: 'Date format is invalid. Must be YYYY-MM-DD' });
    }

    if (!DateUtils.isValidTime(time)) {
      return res
        .status(412)
        .json({ error: 'Time format is invalid. Must be HH:MM' });
    }

    if (isBefore(parseISO(date), new Date())) {
      return res.status(412).json({
        error:
          'Meetup date must be at least the next day from the current date',
      });
    }

    return true;
  }
}

export default Meetup;
