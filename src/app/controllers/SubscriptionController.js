import SubscriptionService from '../services/SubscriptionService';

class SubscriptionController {
  async store(req, res) {
    const errors = await SubscriptionService.validateStore(req);

    if (errors.length > 0) {
      return res.status(412).json({ error: errors });
    }

    return res.json();
  }
}

export default new SubscriptionController();
