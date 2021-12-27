import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
    @MaxLength(50, { message: 'O endereço de email deve ter menos de 50 caracteres!' })
    @IsEmail({}, { message: 'Informe um endereço de email válido!' })
    @IsNotEmpty({ message: 'Informe um endereço de email!' })
    readonly email: string;

    @MaxLength(20, { message: 'A senha deve conter menos de 20 caracteres!' })
    @MinLength(6, { message: 'A senha deve conter mais de 6 caracteres!' })
    @IsNotEmpty({ message: 'Informe uma senha válida!' })
    readonly password: string;
}
