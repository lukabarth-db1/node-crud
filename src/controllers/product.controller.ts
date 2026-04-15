import { Request, Response } from 'express';
import productService from "../services/product.service"
import exchangeRateService from "../services/exchange-rate.service";

const findAll = async (req: Request, res: Response): Promise<void> => {
  const products = await productService.findAll();
  res.status(200).json(products);
};

const findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const product = await productService.findById(req.params.id);
  res.status(200).json(product);
};

const create = async (req: Request, res: Response): Promise<void> => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
};

const update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const product = await productService.update(req.params.id, req.body);
  res.status(200).json(product);
};

const remove = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  await productService.remove(req.params.id);
  res.status(204).send();
};

const getPrice = async (req: Request<{ id: string }, {}, {}, { currency?: string }>, res: Response): Promise<void> => {
  const { currency = 'USD' } = req.query;
  const product = await productService.findById(req.params.id);
  const convertedPrice = await exchangeRateService.convert(product.price, currency);

  res.status(200).json({
    productId: product._id,
    name: product.name,
    originalPrice: product.price,
    currency: currency.toUpperCase(),
    convertedPrice,
  });
};

export default { findAll, findById, create, update, remove, getPrice };
