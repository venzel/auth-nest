import { User } from '../user.entity';

export class ResponseListUserDto {
    readonly users: User[];
    readonly message: string;
}
