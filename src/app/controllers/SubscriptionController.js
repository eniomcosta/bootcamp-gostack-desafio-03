import SubscriptionService from '../services/SubscriptionService';
import Subscription from '../models/Subscription';

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

    return res.json(subscription);
  }
}

export default new SubscriptionController();
