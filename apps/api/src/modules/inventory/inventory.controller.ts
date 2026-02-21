import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth('access-token')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create an inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created' })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all inventory items' })
  @ApiResponse({ status: 200, description: 'List of inventory items' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'List of low stock items' })
  getLowStockItems() {
    return this.inventoryService.getLowStockItems();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Inventory item found' })
  findByProductId(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Inventory item found' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Inventory item updated' })
  update(@Param('id') id: string, @Body() updateData: Partial<CreateInventoryDto>) {
    return this.inventoryService.update(id, updateData);
  }

  @Put(':id/add-stock')
  @ApiOperation({ summary: 'Add stock to inventory' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Stock added' })
  addStock(@Param('id') productId: string, @Body() body: { quantity: number }) {
    return this.inventoryService.addStock(productId, body.quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted' })
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }
}

