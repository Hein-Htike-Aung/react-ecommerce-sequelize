import { setCache } from "./../utils/setCache";
import Subscriber from "../models/subscriber";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCache";
import SubscriberService from "../services/subscriber.service";

class SubscriberCache {
  // set subscriber
  static setSubscriber = async (subscriber: Subscriber) => {
    let existingSubscriberCache = await getCache<Subscriber[]>("subscribers");

    if (!existingSubscriberCache.length) {
      existingSubscriberCache = await this.restoreSubscriberList();
    }

    setCache("subscribers", [subscriber, ...existingSubscriberCache]);
  };

  // delete subscriber
  static deleteSubscriber = async (id: number) => {
    let existingSubscriberCache = await getCache<Subscriber[]>("subscribers");

    if (!existingSubscriberCache.length) {
      existingSubscriberCache = await this.restoreSubscriberList();
    }

    existingSubscriberCache = existingSubscriberCache.filter(
      (s) => s.id !== id
    );

    setCache("subscribers", existingSubscriberCache);
  };

  // get subscriber
  static getSubscriber = async (
    id: number,
    freshDataFn: () => Promise<null | Subscriber>
  ) => {
    return (await restoreCache<Subscriber, Subscriber | null>(
      `subscriber:${id}`,
      async () => freshDataFn()
    )) as Subscriber | null;
  };

  // restore subscriber list
  static restoreSubscriberList = async () => {
    return (await restoreCache(`subscribers`, async () =>
      SubscriberService.getAllSubscriberQuery()
    )) as Subscriber[];
  };
}

export default SubscriberCache;
