import { Router } from "express";
import productController from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", productController.findAll);
productRouter.get("/:id", productController.findById);
productRouter.post("/", productController.create);
productRouter.put("/:id", productController.update);
productRouter.delete("/:id", productController.remove);

export default productRouter;
