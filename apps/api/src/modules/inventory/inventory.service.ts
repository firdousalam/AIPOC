import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem, InventoryItemDocument } from './inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryModel: Model<InventoryItemDocument>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto): Promise<InventoryItem> {
    const createdItem = new this.inventoryModel(createInventoryDto);
    return createdItem.save();
  }

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryModel.find().sort({ productName: 1 }).exec();
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async findByProductId(productId: string): Promise<InventoryItem | null> {
    return this.inventoryModel.findOne({ productId }).exec();
  }

  async update(id: string, updateData: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = await this.inventoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async updateByProductId(productId: string, updateData: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = await this.inventoryModel
      .findOneAndUpdate({ productId }, updateData, { new: true })
      .exec();
    if (!item) {
      throw new NotFoundException(`Inventory item for product ${productId} not found`);
    }
    return item;
  }

  async addStock(productId: string, quantity: number): Promise<InventoryItem> {
    const item = await this.findByProductId(productId);
    if (!item) {
      throw new NotFoundException(`Inventory item for product ${productId} not found`);
    }
    const newQuantity = item.quantity + quantity;
    const lastRestocked = new Date();
    return this.inventoryModel.findOneAndUpdate(
      { productId },
      { quantity: newQuantity, lastRestocked },
      { new: true }
    ).exec();
  }

  async deductStock(productId: string, quantity: number): Promise<InventoryItem> {
    const item = await this.findByProductId(productId);
    if (!item) {
      throw new NotFoundException(`Inventory item for product ${productId} not found`);
    }
    if (item.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock for ${item.productName}. Available: ${item.quantity}, Required: ${quantity}`
      );
    }
    const newQuantity = item.quantity - quantity;
    return this.inventoryModel.findOneAndUpdate(
      { productId },
      { quantity: newQuantity },
      { new: true }
    ).exec();
  }

  async checkStock(productId: string, quantity: number): Promise<{ available: boolean; currentStock: number }> {
    const item = await this.findByProductId(productId);
    if (!item) {
      return { available: false, currentStock: 0 };
    }
    return {
      available: item.quantity >= quantity,
      currentStock: item.quantity,
    };
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return this.inventoryModel
      .find({
        $expr: { $lte: ['$quantity', '$reorderLevel'] },
        status: 'active',
      })
      .sort({ quantity: 1 })
      .exec();
  }

  async delete(id: string): Promise<InventoryItem> {
    const item = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async syncWithProduct(productId: string, productName: string, initialStock: number = 0): Promise<InventoryItem> {
    let item = await this.findByProductId(productId);
    if (!item) {
      item = await this.create({
        productId,
        productName,
        quantity: initialStock,
        reorderLevel: 10,
      });
    } else {
      item = await this.inventoryModel.findOneAndUpdate(
        { productId },
        { productName },
        { new: true }
      ).exec();
    }
    return item;
  }
}

