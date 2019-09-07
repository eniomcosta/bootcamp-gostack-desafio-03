import SubscriptionService from '../services/SubscriptionService';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Mail from '../../lib/Mail';

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

    await Mail.sendMail({
      to: `${selectedMeetup.organizer.name} <${selectedMeetup.organizer.email}>`,
      subject: `Subscription to ${selectedMeetup.title}`,
      text: 'A subscription has been made to a the meetup',
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
