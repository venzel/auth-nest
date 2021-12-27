import { User } from '../user.entity';

export class ResponseUserDto {
    readonly user: User;
    readonly message: string;
}
