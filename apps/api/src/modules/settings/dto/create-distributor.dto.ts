import { IsString, IsOptional, IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../utils/constants';

export class CreateDistributorDto {
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Distributor name') })
    name: string;

    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Description') })
    description?: string;

    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Contact person') })
    contactPerson?: string;

    @IsOptional()
    @IsEmail({}, { message: VALIDATION_MESSAGES.COMMON.MUST_BE_EMAIL('Email') })
    email?: string;

    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Phone') })
    phone?: string;

    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.COMMON.MUST_BE_STRING('Address') })
    address?: string;
}
