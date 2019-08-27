import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import DateUtils from '../utils/DateUtils';

import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
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

    const { title, description, place, date, time, banner_id } = req.body;

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

    const parsedDate = DateUtils.parseDateAndTimeToDate(date, time);

    const meetup = await Meetup.create({
      title,
      description,
      place,
      date: parsedDate,
      banner_id,
      user_id: req.userId,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
