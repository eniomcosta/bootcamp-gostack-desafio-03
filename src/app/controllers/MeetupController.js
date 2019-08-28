import DateUtils from '../utils/DateUtils';

import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    await Meetup.validate(req, res);

    // const { title, description, place, date, time, banner_id } = req.body;

    // const parsedDate = DateUtils.parseDateAndTimeToDate(date, time);

    // const meetup = await Meetup.create({
    //   title,
    //   description,
    //   place,
    //   date: parsedDate,
    //   banner_id,
    //   user_id: req.userId,
    // });

    // return res.json(meetup);
  }
}

export default new MeetupController();
