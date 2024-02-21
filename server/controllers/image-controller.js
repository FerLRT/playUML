import { imageModel } from "../models/image-model.js";

export class ImageController {
  static async getQuestionImage(req, res) {
    try {
      const questionId = req.params.id;

      const images = await imageModel.findAll({
        where: { question_id: questionId },
      });

      const imagesWithBase64Data = images.map((image) => {
        if (image.image_data !== null) {
          // Convertir image_data a base64
          image.image_data = Buffer.from(image.image_data, "binary").toString(
            "base64"
          );
        }
        return image;
      });

      res.json(imagesWithBase64Data);
    } catch (error) {
      console.error("Error getting question images:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }
}
