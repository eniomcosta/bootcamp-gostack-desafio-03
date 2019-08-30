import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import DateUtils from '../utils/DateUtils';

import File from '../models/File';
import Meetup from '../models/Meetup';

class MeetupService {
  static async validateStore(req) {
    const errors = [];

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

    await schema.validate(req.body, { abortEarly: false }).catch(err => {
      errors.push(...err.errors);
    });

    if (errors.length > 0) return errors;

    const { date, time, banner_id } = req.body;

    if (!(await File.findByPk(banner_id))) {
      errors.push('Banner image not exist');
    }

    if (!DateUtils.isValidDate(date)) {
      errors.push('Date format is invalid. Must be YYYY-MM-DD');
    }

    if (!DateUtils.isValidTime(time)) {
      errors.push('Time format is invalid. Must be HH:MM');
    }

    if (isBefore(parseISO(date), new Date())) {
      errors.push(
        'Meetup date must be at least the next day from the current date'
      );
    }

    return errors;
  }

  static async validateUpdate(req) {
    const errors = [];

    const schema = Yup.object().shape({
      title: Yup.string()
        .min(3)
        .max(255),
      description: Yup.string()
        .min(5)
        .max(255),
      place: Yup.string()
        .min(5)
        .max(255),
      date: Yup.date(),
      time: Yup.string(),
      banner_id: Yup.number(),
    });

    await schema.validate(req.body, { abortEarly: false }).catch(err => {
      errors.push(...err.errors);
    });

    if (errors.length > 0) return errors;

    /**
     * Check if the authenticated user is the meetup organizer
     */
    const meetup = await Meetup.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!meetup) {
      errors.push('Meetup not found');
      return errors;
    }

    if (isBefore(meetup.date, new Date())) {
      errors.push('Meetup already happened');
      return errors;
    }

    return errors;
  }
}

export default MeetupService;
