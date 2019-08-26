import * as Yup from 'yup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      description: Yup.string()
        .max(255)
        .required('Description is required'),
    });

    await schema.validate(req.body).catch(err => {
      return res.status(412).json(err.errors);
    });

    return res.json();
  }
}

export default new MeetupController();
