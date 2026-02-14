import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem, InventoryItemDocument } from './inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryModel: Model<InventoryItemDocument>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<InventoryItem> {
    const createdItem = new this.inventoryModel(createInventoryDto);
    return createdItem.save();
  }

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryModel.find().exec();
  }

  async findOne(id: string): Promise<InventoryItem> {
    return this.inventoryModel.findById(id).exec();
  }
}

