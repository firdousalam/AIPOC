import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './sales.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private inventoryService: InventoryService,
  ) { }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Check stock availability for all items
    for (const item of createSaleDto.items) {
      const stockCheck = await this.inventoryService.checkStock(item.productId, item.quantity);
      if (!stockCheck.available) {
        throw new BadRequestException(
          `Insufficient stock for ${item.productName}. Available: ${stockCheck.currentStock}, Required: ${item.quantity}`
        );
      }
    }

    // Deduct stock for all items
    for (const item of createSaleDto.items) {
      await this.inventoryService.deductStock(item.productId, item.quantity);
    }

    // Apply defaults if customer info is not provided or empty
    const saleData = {
      ...createSaleDto,
      customer: createSaleDto.customer && Object.keys(createSaleDto.customer).some(key => createSaleDto.customer[key])
        ? createSaleDto.customer
        : { name: 'Cash' },
      paymentMethod: createSaleDto.paymentMethod || 'Cash',
    };

    const createdSale = new this.saleModel(saleData);
    return createdSale.save();
  }

  async findAll(
    search?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ sales: Sale[]; total: number; page: number; totalPages: number }> {
    const query: any = {};

    // Add search filter if provided
    if (search && search.trim()) {
      query.$or = [
        { 'items.productName': { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.mobile': { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } },
      ];
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.saleDate = {};

      if (startDate) {
        query.saleDate.$gte = new Date(startDate);
      }

      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    // Get total count for pagination
    const total = await this.saleModel.countDocuments(query).exec();

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated sales
    const sales = await this.saleModel
      .find(query)
      .sort({ saleDate: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      sales,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Sale> {
    return this.saleModel.findById(id).exec();
  }

  async update(id: string, updateSaleDto: CreateSaleDto): Promise<Sale> {
    // Get the original sale to restore stock
    const originalSale = await this.saleModel.findById(id).exec();
    if (!originalSale) {
      throw new BadRequestException('Sale not found');
    }

    // Restore stock from original sale
    for (const item of originalSale.items) {
      await this.inventoryService.addStock(item.productId, item.quantity);
    }

    // Check stock availability for updated items
    for (const item of updateSaleDto.items) {
      const stockCheck = await this.inventoryService.checkStock(item.productId, item.quantity);
      if (!stockCheck.available) {
        // Restore original sale stock if validation fails
        for (const originalItem of originalSale.items) {
          await this.inventoryService.deductStock(originalItem.productId, originalItem.quantity);
        }
        throw new BadRequestException(
          `Insufficient stock for ${item.productName}. Available: ${stockCheck.currentStock}, Required: ${item.quantity}`
        );
      }
    }

    // Deduct stock for updated items
    for (const item of updateSaleDto.items) {
      await this.inventoryService.deductStock(item.productId, item.quantity);
    }

    // Apply defaults if customer info is not provided or empty
    const saleData = {
      ...updateSaleDto,
      customer: updateSaleDto.customer && Object.keys(updateSaleDto.customer).some(key => updateSaleDto.customer[key])
        ? updateSaleDto.customer
        : { name: 'Cash' },
      paymentMethod: updateSaleDto.paymentMethod || 'Cash',
    };

    return this.saleModel.findByIdAndUpdate(id, saleData, { new: true }).exec();
  }

  async remove(id: string): Promise<Sale> {
    // Get the sale to restore stock
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) {
      throw new BadRequestException('Sale not found');
    }

    // Restore stock for all items
    for (const item of sale.items) {
      await this.inventoryService.addStock(item.productId, item.quantity);
    }

    return this.saleModel.findByIdAndDelete(id).exec();
  }
}

