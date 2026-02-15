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
    // Generate product ID
    const lastProduct = await this.productModel
      .findOne()
      .sort({ createdAt: -1 })
      .exec();

    let nextNumber = 1;
    if (lastProduct && lastProduct.productId) {
      const lastNumber = parseInt(lastProduct.productId.replace('PROD-', ''));
      nextNumber = lastNumber + 1;
    }

    const productId = `PROD-${String(nextNumber).padStart(4, '0')}`;

    const createdProduct = new this.productModel({
      ...createProductDto,
      productId,
    });
    return createdProduct.save();
  }

  async findAll(
    search?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const query: any = { status: 'active' };

    // Add search filter if provided
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { distributor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Get total count for pagination
    const total = await this.productModel.countDocuments(query).exec();

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated products
    const products = await this.productModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      products,
      total,
      page,
      totalPages,
    };
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

