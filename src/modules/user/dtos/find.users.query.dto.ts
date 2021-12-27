import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { BaseQueryParametersDto } from './base-query-parameters.dto';

export class FindUsersQueryDto extends BaseQueryParametersDto {
    @IsOptional()
    @MaxLength(20, { message: 'O nome deve ter no máximo 20 caracteres!' })
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres!' })
    @IsString({ message: 'Informe um nome válido!' })
    name: string;

    @IsOptional()
    @MaxLength(30, { message: 'O email deve ter no máximo 30 caracteres!' })
    @MinLength(3, { message: 'O email deve ter no mínimo 3 caracteres!' })
    @IsEmail({ message: 'Informe um email válido!' })
    email: string;

    @IsOptional()
    @Matches(/\b(?:true|false)\b/gi, { message: 'O status só pode ser true ou false!' })
    status: boolean;

    @IsOptional()
    @Matches(/\b(?:admin|user)\b/gi, { message: 'O role só pode ser admin ou user!' })
    role: string;
}
