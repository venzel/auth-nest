import { User } from '../user.entity';

export class ResponseFindUsersDto {
    users: User[];
    total: number;
}
