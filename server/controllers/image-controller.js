import { imageModel } from "../models/image-model.js";

export class ImageController {
  static getQuestionImage(req, res) {
    const questionId = req.params.id;

    imageModel
      .findAll({ where: { question_id: questionId } })
      .then(async (images) => {
        const imagesWithBase64Data = await Promise.all(
          images.map(async (image) => {
            if (image.image_data !== null) {
              // Convertir answer_image a base64
              image.image_data = Buffer.from(image.image_data).toString(
                "base64"
              );
            }

            return image;
          })
        );

        res.json(imagesWithBase64Data);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }
}
