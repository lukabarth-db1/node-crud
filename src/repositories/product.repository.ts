import Product, { IProduct } from "../models/product.model";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

const findAll = async (): Promise<IProduct[]> => {
  return Product.find();
};

const findById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id);
};

const create = async (data: CreateProductDto): Promise<IProduct> => {
  return Product.create(data);
};

const update = async (id: string, data: UpdateProductDto): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

const remove = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};

export default { findAll, findById, create, update, remove };