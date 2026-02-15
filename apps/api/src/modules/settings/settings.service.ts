import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Company, CompanyDocument } from './schemas/company.schema';
import { Distributor, DistributorDocument } from './schemas/distributor.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { ERROR_MESSAGES } from '../../utils/constants';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
        @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
        @InjectModel(Distributor.name) private distributorModel: Model<DistributorDocument>,
    ) { }

    // ==================== CATEGORIES ====================

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const category = new this.categoryModel(createCategoryDto);
            return await category.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exists');
            }
            throw error;
        }
    }

    async findAllCategories(): Promise<Category[]> {
        return this.categoryModel.find({ status: 'active' }).sort({ name: 1 }).exec();
    }

    async findOneCategory(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async updateCategory(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const category = await this.categoryModel
                .findByIdAndUpdate(id, updateCategoryDto, { new: true })
                .exec();

            if (!category) {
                throw new NotFoundException(`Category with ID ${id} not found`);
            }

            return category;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exists');
            }
            throw error;
        }
    }

    async removeCategory(id: string): Promise<void> {
        const result = await this.categoryModel.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true }
        ).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async toggleCategoryStatus(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        category.status = category.status === 'active' ? 'inactive' : 'active';
        return await category.save();
    }

    // ==================== COMPANIES ====================

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
        try {
            const company = new this.companyModel(createCompanyDto);
            return await company.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Company with this name already exists');
            }
            throw error;
        }
    }

    async findAllCompanies(): Promise<Company[]> {
        return this.companyModel.find({ status: 'active' }).sort({ name: 1 }).exec();
    }

    async findOneCompany(id: string): Promise<Company> {
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async updateCompany(id: string, updateCompanyDto: CreateCompanyDto): Promise<Company> {
        try {
            const company = await this.companyModel
                .findByIdAndUpdate(id, updateCompanyDto, { new: true })
                .exec();

            if (!company) {
                throw new NotFoundException(`Company with ID ${id} not found`);
            }

            return company;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Company with this name already exists');
            }
            throw error;
        }
    }

    async removeCompany(id: string): Promise<void> {
        const result = await this.companyModel.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true }
        ).exec();
        if (!result) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
    }

    async toggleCompanyStatus(id: string): Promise<Company> {
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        company.status = company.status === 'active' ? 'inactive' : 'active';
        return await company.save();
    }

    // ==================== DISTRIBUTORS ====================

    async createDistributor(createDistributorDto: CreateDistributorDto): Promise<Distributor> {
        try {
            const distributor = new this.distributorModel(createDistributorDto);
            return await distributor.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Distributor with this name already exists');
            }
            throw error;
        }
    }

    async findAllDistributors(): Promise<Distributor[]> {
        return this.distributorModel.find({ status: 'active' }).sort({ name: 1 }).exec();
    }

    async findOneDistributor(id: string): Promise<Distributor> {
        const distributor = await this.distributorModel.findById(id).exec();
        if (!distributor) {
            throw new NotFoundException(`Distributor with ID ${id} not found`);
        }
        return distributor;
    }

    async updateDistributor(id: string, updateDistributorDto: CreateDistributorDto): Promise<Distributor> {
        try {
            const distributor = await this.distributorModel
                .findByIdAndUpdate(id, updateDistributorDto, { new: true })
                .exec();

            if (!distributor) {
                throw new NotFoundException(`Distributor with ID ${id} not found`);
            }

            return distributor;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Distributor with this name already exists');
            }
            throw error;
        }
    }

    async removeDistributor(id: string): Promise<void> {
        const result = await this.distributorModel.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true }
        ).exec();
        if (!result) {
            throw new NotFoundException(`Distributor with ID ${id} not found`);
        }
    }

    async toggleDistributorStatus(id: string): Promise<Distributor> {
        const distributor = await this.distributorModel.findById(id).exec();
        if (!distributor) {
            throw new NotFoundException(`Distributor with ID ${id} not found`);
        }
        distributor.status = distributor.status === 'active' ? 'inactive' : 'active';
        return await distributor.save();
    }
}
