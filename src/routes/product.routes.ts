import { Router } from "express";
import productController from "../controllers/product.controller";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import validate from "../middlewares/validate.middleware";

const productRouter = Router();

productRouter.get("/", productController.findAll);
productRouter.get("/:id/price", productController.getPrice);
productRouter.get("/:id", productController.findById);
productRouter.post("/",  validate(createProductSchema), productController.create);
productRouter.put("/:id", validate(updateProductSchema), productController.update);
productRouter.delete("/:id", productController.remove);

export default productRouter;
