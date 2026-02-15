import { IsString, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../utils/constants';

export class CreateCategoryDto {
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Category name') })
    name: string;

    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Description') })
    description?: string;
}
