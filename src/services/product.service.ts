import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import { IProduct } from "../models/product.model";
import productRepository from "../repositories/product.repository";

const findAll = async (): Promise<IProduct[]> => {
  return productRepository.findAll();
};

const findById = async (id: string): Promise<IProduct> => {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const create = async (data: CreateProductDto): Promise<IProduct> => {
  return productRepository.create(data);
};

const update = async (id: string, data: UpdateProductDto): Promise<IProduct> => {
  const product = await productRepository.update(id, data);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const remove = async (id: string): Promise<void> => {
  const product = await productRepository.remove(id);

  if (!product) {
    throw new Error("Product not found");
  }
};

export default { findAll, findById, create, update, remove };
