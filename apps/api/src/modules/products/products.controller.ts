import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SUCCESS_MESSAGES, API_DOCS, HTTP_STATUS } from '../../utils/constants';

@ApiTags('products')
@ApiBearerAuth('access-token')
@Controller('products')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true
}))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: API_DOCS.PRODUCT.CREATE_SUMMARY })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: HTTP_STATUS.CREATED, description: API_DOCS.PRODUCT.CREATED_SUCCESS })
  @ApiResponse({ status: HTTP_STATUS.BAD_REQUEST, description: API_DOCS.COMMON.BAD_REQUEST })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: API_DOCS.PRODUCT.GET_ALL_SUMMARY })
  @ApiResponse({ status: HTTP_STATUS.OK, description: API_DOCS.PRODUCT.LIST_SUCCESS })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: API_DOCS.PRODUCT.GET_ONE_SUMMARY })
  @ApiParam({ name: 'id', description: API_DOCS.PRODUCT.PRODUCT_ID_PARAM })
  @ApiResponse({ status: HTTP_STATUS.OK, description: API_DOCS.PRODUCT.RETRIEVED_SUCCESS })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: API_DOCS.PRODUCT.NOT_FOUND })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: API_DOCS.PRODUCT.UPDATE_SUMMARY })
  @ApiParam({ name: 'id', description: API_DOCS.PRODUCT.PRODUCT_ID_PARAM })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: HTTP_STATUS.OK, description: API_DOCS.PRODUCT.UPDATED_SUCCESS })
  @ApiResponse({ status: HTTP_STATUS.BAD_REQUEST, description: API_DOCS.COMMON.BAD_REQUEST })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: API_DOCS.PRODUCT.NOT_FOUND })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_DOCS.PRODUCT.DELETE_SUMMARY })
  @ApiParam({ name: 'id', description: API_DOCS.PRODUCT.PRODUCT_ID_PARAM })
  @ApiResponse({ status: HTTP_STATUS.OK, description: API_DOCS.PRODUCT.DELETED_SUCCESS })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: API_DOCS.PRODUCT.NOT_FOUND })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: SUCCESS_MESSAGES.PRODUCT.DELETED };
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle product status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Product status toggled successfully' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: API_DOCS.COMMON.UNAUTHORIZED })
  toggleStatus(@Param('id') id: string) {
    return this.productsService.toggleStatus(id);
  }
}

