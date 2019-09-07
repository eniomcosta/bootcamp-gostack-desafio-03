import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import DateUtils from '../utils/DateUtils';

import MeetupService from '../services/MeetupService';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
    });

    return res.json(meetups);
  }

  async findByDate(req, res) {
    const { date, page = 1, pageSize = 10 } = req.query;

    if (!DateUtils.isValidDate(date)) {
      return res
        .status(412)
        .json('Date format is invalid. Must be YYYY-MM-DD.');
    }

    const meetups = await Meetup.findAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: ['date'],
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const errors = await MeetupService.validateStore(req);

    if (errors.length > 0) {
      res.status(412).json({ error: errors });
    }

    const { title, description, place, date, time, banner_id } = req.body;

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

  async update(req, res) {
    const errors = await MeetupService.validateUpdate(req);

    if (errors.length > 0) {
      res.status(412).json({ error: errors });
    }

    const meetupToUpdate = await Meetup.findByPk(req.params.id);

    const meetup = await meetupToUpdate.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const errors = await MeetupService.validateDelete(req);

    if (errors.length > 0) {
      return res.status(412).json({ error: errors });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    await meetup.destroy();

    return res.json();
  }
}

export default new MeetupController();
