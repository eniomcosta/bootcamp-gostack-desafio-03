import SubscriptionService from '../services/SubscriptionService';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async store(req, res) {
    const errors = await SubscriptionService.validateStore(req);

    if (errors.length > 0) {
      return res.status(412).json({ error: errors });
    }

    const subscription = await Subscription.create({
      meetup_id: req.body.meetup,
      user_id: req.userId,
    });

    const selectedMeetup = await Meetup.findByPk(req.body.meetup, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const subscriber = await User.findByPk(req.userId);

    Queue.add(SubscriptionMail.key, {
      meetup: selectedMeetup,
      subscriber,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
