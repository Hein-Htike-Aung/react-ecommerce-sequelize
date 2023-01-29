import NewLetterCache from "../cache/newLetter.cache";
import NewLetter from "../models/newletter";

class NewLetterService {
  // get new letter
  static getNewLetter = async (id: number) => {
    const newLetter = await NewLetterCache.getNewLetter(id, async () => {
      const newLetter = await NewLetter.findByPk(id);

      if (newLetter === null) return null;

      return newLetter;
    });

    return newLetter;
  };

  // get all new letter Query
  static getAllNewLetterQuery = async () =>
    await NewLetter.findAll({ order: [["created_at", "DESC"]], raw: true });
}

export default NewLetterService;
