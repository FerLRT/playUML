import { imageModel } from "../models/image-model.js";

export class ImageController {
  static async getQuestionImage(req, res) {
    try {
      const questionId = req.params.id;

      const images = await imageModel.findAll({
        where: { question_id: questionId },
      });

      res.json(images);
    } catch (error) {
      console.error("Error getting question images:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }
}
