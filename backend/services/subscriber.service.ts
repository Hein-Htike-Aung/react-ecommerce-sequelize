import Subscriber from "../models/subscriber";

class SubscriberService {

  // get all subscriber query
  static getAllSubscriberQuery = async () =>
    await Subscriber.findAll({ order: [["created_at", "DESC"]], raw: true });
}

export default SubscriberService;
