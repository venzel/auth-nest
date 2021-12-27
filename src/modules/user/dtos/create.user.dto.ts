import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
    @MaxLength(200, { message: 'O endereço de email deve ter menos de 200 caracteres!' })
    @IsEmail({}, { message: 'Informe um endereço de email válido!' })
    @IsNotEmpty({ message: 'Informe um endereço de email!' })
    readonly email: string;

    @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres!' })
    @IsNotEmpty({ message: 'Informe o nome do usuário!' })
    readonly name: string;

    @IsNotEmpty({ message: 'Informe uma senha' })
    readonly password: string;
}
