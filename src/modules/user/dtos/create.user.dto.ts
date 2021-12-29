import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @Matches(/[a-zA-Z0-9_-]{2,20}/, { message: 'Insira um nome válido!' })
    @MaxLength(20, { message: 'O nome deve conter no máximo 20 caracteres!' })
    @IsNotEmpty({ message: 'Informe um nome!' })
    name: string;

    @MaxLength(30, { message: 'O email deve conter no máximo 30 caracteres!' })
    @IsEmail({}, { message: 'Informe um email válido!' })
    @IsNotEmpty({ message: 'Informe um email!' })
    email: string;

    @MaxLength(12, { message: 'A senha deve conter no máximo 12 caracteres!' })
    @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres!' })
    @IsNotEmpty({ message: 'Informe uma senha' })
    password: string;

    @MaxLength(12, { message: 'A confirmação de senha deve conter no máximo 12 caracteres!' })
    @MinLength(6, { message: 'A confirmação de senha deve conter no mínimo 6 caracteres!' })
    @IsNotEmpty({ message: 'Informe uma confirmação de senha' })
    passwordConfirmation: string;
}
