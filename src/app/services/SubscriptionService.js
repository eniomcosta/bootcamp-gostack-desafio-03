import Op from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionService {
  async validateStore(req) {
    const errors = [];

    if (!req.body.id) {
      return ['Meetup not informed'];
    }

    const meetup = await Meetup.findOne({
      where: {
        id: req.body.id,
        user_id: {
          [Op.not]: req.userId,
        },
      },
    });

    if (!meetup) {
      return ['Meetup not found'];
    }

    const alreadySubscribbed = await Subscription.findOne({
      where: {
        meetup_id: req.body.id,
        user_id: req.userId,
      },
    });

    if (!alreadySubscribbed) {
      return ['User already subscribbed to this meetup'];
    }

    return errors;
  }
}

export default SubscriptionService;
