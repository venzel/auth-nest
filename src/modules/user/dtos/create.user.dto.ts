import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @Matches(/[a-zA-Z0-9_-]{2,20}/)
    @MaxLength(20, { message: 'O nome deve conter no máximo 20 caracteres!' })
    @IsNotEmpty({ message: 'Informe um nome!' })
    readonly name: string;

    @MaxLength(30, { message: 'O email deve conter no máximo 30 caracteres!' })
    @IsEmail({}, { message: 'Informe um email válido!' })
    @IsNotEmpty({ message: 'Informe um email!' })
    readonly email: string;

    @MaxLength(12, { message: 'A senha deve conter no máximo 12 caracteres!' })
    @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres!' })
    @IsNotEmpty({ message: 'Informe uma senha' })
    readonly password: string;
}
