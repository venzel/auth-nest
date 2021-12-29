import { User } from '../user.entity';

export class ResponseListUserDto {
    users: User[];
    message: string;
}
