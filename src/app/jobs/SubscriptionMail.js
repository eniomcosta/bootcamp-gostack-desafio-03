import { format } from 'date-fns';
import en from 'date-fns/locale/en-US';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  handle({ data }) {
    const { subscriber, meetup } = data;

    Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Subscription to ${meetup.title}`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        meetup: meetup.title,
        user: subscriber.name,
        date: format(new Date(), "MMMM dd'th at' H:mm", {
          locale: en,
        }),
      },
    });
  }
}

export default new SubscriptionMail();
