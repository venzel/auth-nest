import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @Matches(/[a-zA-Z0-9_-]{2,20}/)
    @MaxLength(20, { message: 'O nome deve conter no máximo 20 caracteres!' })
    @IsNotEmpty({ message: 'Informe um nome!' })
    name: string;
}
