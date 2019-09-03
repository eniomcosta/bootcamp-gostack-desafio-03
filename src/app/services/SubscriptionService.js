import { Op } from 'sequelize';
import { startOfHour, endOfHour } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionService {
  static async validateStore(req) {
    const errors = [];

    if (!req.body.meetup) {
      return ['Meetup not informed'];
    }

    const meetup = await Meetup.findOne({
      where: {
        id: req.body.meetup,
        user_id: {
          [Op.ne]: req.userId,
        },
      },
    });

    if (!meetup) {
      return ['Meetup not found'];
    }

    const alreadySubscribbed = await Subscription.findOne({
      where: {
        meetup_id: req.body.meetup,
        user_id: req.userId,
      },
    });

    if (alreadySubscribbed) {
      return ['User already subscribbed to this meetup'];
    }

    const meetupSameHour = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: {
        model: Meetup,
        as: 'meetup',
        where: {
          date: {
            [Op.between]: [startOfHour(meetup.date), endOfHour(meetup.date)],
          },
        },
      },
    });

    if (meetupSameHour.length > 0) {
      return [
        "You can't subscribe two or more meetups that happens at the same hour",
      ];
    }

    return errors;
  }
}

export default SubscriptionService;
