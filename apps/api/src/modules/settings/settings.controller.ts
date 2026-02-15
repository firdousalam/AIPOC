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
import { SettingsService } from './settings.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '../../utils/constants';

@ApiTags('settings')
@ApiBearerAuth('access-token')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
}))
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    // ==================== CATEGORIES ====================

    @Post('categories')
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: HTTP_STATUS.CREATED, description: 'Category created successfully' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Category already exists' })
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.settingsService.createCategory(createCategoryDto);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Categories retrieved successfully' })
    findAllCategories() {
        return this.settingsService.findAllCategories();
    }

    @Get('categories/:id')
    @ApiOperation({ summary: 'Get category by ID' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Category found' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Category not found' })
    findOneCategory(@Param('id') id: string) {
        return this.settingsService.findOneCategory(id);
    }

    @Put('categories/:id')
    @ApiOperation({ summary: 'Update category' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Category updated successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Category not found' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Category name already exists' })
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
        return this.settingsService.updateCategory(id, updateCategoryDto);
    }

    @Delete('categories/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete category (soft delete - marks as inactive)' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Category deleted successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Category not found' })
    async removeCategory(@Param('id') id: string) {
        await this.settingsService.removeCategory(id);
        return { message: 'Category deleted successfully' };
    }

    @Put('categories/:id/toggle-status')
    @ApiOperation({ summary: 'Toggle category status (active/inactive)' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Category status toggled successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Category not found' })
    toggleCategoryStatus(@Param('id') id: string) {
        return this.settingsService.toggleCategoryStatus(id);
    }

    // ==================== COMPANIES ====================

    @Post('companies')
    @ApiOperation({ summary: 'Create a new company' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiResponse({ status: HTTP_STATUS.CREATED, description: 'Company created successfully' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Company already exists' })
    createCompany(@Body() createCompanyDto: CreateCompanyDto) {
        return this.settingsService.createCompany(createCompanyDto);
    }

    @Get('companies')
    @ApiOperation({ summary: 'Get all companies' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Companies retrieved successfully' })
    findAllCompanies() {
        return this.settingsService.findAllCompanies();
    }

    @Get('companies/:id')
    @ApiOperation({ summary: 'Get company by ID' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Company found' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Company not found' })
    findOneCompany(@Param('id') id: string) {
        return this.settingsService.findOneCompany(id);
    }

    @Put('companies/:id')
    @ApiOperation({ summary: 'Update company' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Company updated successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Company not found' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Company name already exists' })
    updateCompany(@Param('id') id: string, @Body() updateCompanyDto: CreateCompanyDto) {
        return this.settingsService.updateCompany(id, updateCompanyDto);
    }

    @Delete('companies/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete company (soft delete - marks as inactive)' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Company deleted successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Company not found' })
    async removeCompany(@Param('id') id: string) {
        await this.settingsService.removeCompany(id);
        return { message: 'Company deleted successfully' };
    }

    @Put('companies/:id/toggle-status')
    @ApiOperation({ summary: 'Toggle company status (active/inactive)' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Company status toggled successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Company not found' })
    toggleCompanyStatus(@Param('id') id: string) {
        return this.settingsService.toggleCompanyStatus(id);
    }

    // ==================== DISTRIBUTORS ====================

    @Post('distributors')
    @ApiOperation({ summary: 'Create a new distributor' })
    @ApiBody({ type: CreateDistributorDto })
    @ApiResponse({ status: HTTP_STATUS.CREATED, description: 'Distributor created successfully' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Distributor already exists' })
    createDistributor(@Body() createDistributorDto: CreateDistributorDto) {
        return this.settingsService.createDistributor(createDistributorDto);
    }

    @Get('distributors')
    @ApiOperation({ summary: 'Get all distributors' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Distributors retrieved successfully' })
    findAllDistributors() {
        return this.settingsService.findAllDistributors();
    }

    @Get('distributors/:id')
    @ApiOperation({ summary: 'Get distributor by ID' })
    @ApiParam({ name: 'id', description: 'Distributor ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Distributor found' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Distributor not found' })
    findOneDistributor(@Param('id') id: string) {
        return this.settingsService.findOneDistributor(id);
    }

    @Put('distributors/:id')
    @ApiOperation({ summary: 'Update distributor' })
    @ApiParam({ name: 'id', description: 'Distributor ID' })
    @ApiBody({ type: CreateDistributorDto })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Distributor updated successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Distributor not found' })
    @ApiResponse({ status: HTTP_STATUS.CONFLICT, description: 'Distributor name already exists' })
    updateDistributor(@Param('id') id: string, @Body() updateDistributorDto: CreateDistributorDto) {
        return this.settingsService.updateDistributor(id, updateDistributorDto);
    }

    @Delete('distributors/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete distributor (soft delete - marks as inactive)' })
    @ApiParam({ name: 'id', description: 'Distributor ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Distributor deleted successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Distributor not found' })
    async removeDistributor(@Param('id') id: string) {
        await this.settingsService.removeDistributor(id);
        return { message: 'Distributor deleted successfully' };
    }

    @Put('distributors/:id/toggle-status')
    @ApiOperation({ summary: 'Toggle distributor status (active/inactive)' })
    @ApiParam({ name: 'id', description: 'Distributor ID' })
    @ApiResponse({ status: HTTP_STATUS.OK, description: 'Distributor status toggled successfully' })
    @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Distributor not found' })
    toggleDistributorStatus(@Param('id') id: string) {
        return this.settingsService.toggleDistributorStatus(id);
    }
}
