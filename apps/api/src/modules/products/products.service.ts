import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ERROR_MESSAGES } from '../../utils/constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ status: 'active' }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
    }
    return product;
  }

  async update(id: string, updateProductDto: CreateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    ).exec();
    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
    }
  }

  async toggleStatus(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(id));
    }
    product.status = product.status === 'active' ? 'inactive' : 'active';
    return await product.save();
  }
}

