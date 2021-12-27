import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @MaxLength(20, { message: 'O nome deve ter menos de 20 caracteres!' })
    @IsNotEmpty({ message: 'Informe o nome do usuário!' })
    readonly name: string;
}
